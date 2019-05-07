using CRM_Finance.Models;
using CRM_Finance.MP.Core.BUS.MNG;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.AspNet.SignalR.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.DataHandler;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CRM_Finance.Providers
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
        }




        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();
            var _accountServices = new AccountServices();
            ApplicationUser user = await userManager.FindAsync(context.UserName, context.Password);

            if (user.LockoutEnabled)
            {
                await Task.Factory.StartNew(() =>
                {
                    _accountServices.CreateLoginHistory(new Models.EFModel.MNG_HistoryLogin()
                    {
                        DateLogin = DateTime.Now,
                        UserName = context.UserName,
                        Status = "Thất bại: Tài khoản đang bị khóa.",
                        IP = context.OwinContext.Request.RemoteIpAddress
                    });
                });
                context.SetError("invalid_grant", "Tài khoản đang bị khóa.");
                return;
            }

            if (user == null)
            {
                await Task.Factory.StartNew(() =>
                                {
                                    _accountServices.CreateLoginHistory(new Models.EFModel.MNG_HistoryLogin()
                                    {
                                        DateLogin = DateTime.Now,
                                        UserName = context.UserName,
                                        Status = "Thất bại: Sai tài khoản hoặc mật khẩu",
                                        IP = context.OwinContext.Request.RemoteIpAddress
                                    });
                                });
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }

            await Task.Factory.StartNew(() =>
            {
                _accountServices.CreateLoginHistory(new Models.EFModel.MNG_HistoryLogin()
                {
                    DateLogin = DateTime.Now,
                    UserName = context.UserName,
                    Status = "Thành công",
                    IP = context.OwinContext.Request.RemoteIpAddress
                });
            });


            ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager,
               OAuthDefaults.AuthenticationType);
            ClaimsIdentity cookiesIdentity = await user.GenerateUserIdentityAsync(userManager,
                CookieAuthenticationDefaults.AuthenticationType);

            // Create generic identity.  
            MenuServices _menuServices = new MenuServices();


            IList<Claim> claims = new List<Claim>();
            claims.Add(new Claim("UserID", string.IsNullOrEmpty(user.Id) ? string.Empty : user.Id));
            claims.Add(new Claim("PhoneNumber", string.IsNullOrEmpty(user.PhoneNumber) ? string.Empty : user.PhoneNumber));
            claims.Add(new Claim("FullName", string.IsNullOrEmpty(user.FullName) ? string.Empty : user.FullName));
            claims.Add(new Claim("Email", string.IsNullOrEmpty(user.Email) ? string.Empty : user.Email));
            claims.Add(new Claim("Menus",
               string.IsNullOrEmpty(user.Id) ? string.Empty : _menuServices.GetMenu4ClaimsByUserId(user.Id.ToString())));
            oAuthIdentity.AddClaims(claims);

            AuthenticationProperties properties = CreateProperties(user.UserName);
            AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
            context.Validated(ticket);
            context.Request.Context.Authentication.SignIn(cookiesIdentity);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();
            ApplicationUser user = userManager.FindByNameAsync(context.Identity.Name).Result;
            List<string> roleNames = userManager.GetRolesAsync(user.Id).Result.ToList();


            //if (user.UserName == "admin")
            //{
            //    context.Properties.IssuedUtc = DateTime.UtcNow;
            //    context.Properties.ExpiresUtc = DateTime.UtcNow.Add(TimeSpan.FromMinutes(1));
            //}



            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }


        public static AuthenticationProperties CreateProperties(string userName)
        {
            IDictionary<string, string> data = new Dictionary<string, string>
            {
                { "userName", userName }
            };
            return new AuthenticationProperties(data);
        }
    }


    public class QueryStringBearerAuthorizeAttribute : AuthorizeAttribute
    {
        public override bool AuthorizeHubConnection(HubDescriptor hubDescriptor, IRequest request)
        {
            var dataProtectionProvider = new DpapiDataProtectionProvider();
            var secureDataFormat = new TicketDataFormat(dataProtectionProvider.Create());
            // authenticate by using bearer token in query string
            var token = request.QueryString.Get(OAuthDefaults.AuthenticationType);
            var ticket = secureDataFormat.Unprotect(token);
            if (ticket != null && ticket.Identity != null && ticket.Identity.IsAuthenticated)
            {
                // set the authenticated user principal into environment so that it can be used in the future
                request.Environment["server.User"] = new ClaimsPrincipal(ticket.Identity);
                return true;
            }
            else
            {
                return false;
            }
        }

        public override bool AuthorizeHubMethodInvocation(IHubIncomingInvokerContext hubIncomingInvokerContext, bool appliesToMethod)
        {
            var connectionId = hubIncomingInvokerContext.Hub.Context.ConnectionId;
            // check the authenticated user principal from environment
            var environment = hubIncomingInvokerContext.Hub.Context.Request.Environment;
            var principal = environment["server.User"] as ClaimsPrincipal;
            if (principal != null && principal.Identity != null && principal.Identity.IsAuthenticated)
            {
                // create a new HubCallerContext instance with the principal generated from token
                // and replace the current context so that in hubs we can retrieve current user identity
                hubIncomingInvokerContext.Hub.Context = new HubCallerContext(new ServerRequest(environment), connectionId);
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}