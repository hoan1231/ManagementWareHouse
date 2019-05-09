using KTStore.Models;
using KTStore.Providers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Infrastructure;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Collections.Concurrent;
using System.Web.Helpers;

namespace KTStore
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }
        public static OAuthBearerAuthenticationOptions OAuthOptionsNotServer { get; private set; }

        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit https://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationRoleManager>(ApplicationRoleManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                // In production mode set AllowInsecureHttp = false
                AllowInsecureHttp = true,
                AccessTokenProvider = new GuidProvider()
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);
            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthOptions);

            //Binhnc Token Consumption
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
            //SignalR

            app.Map("/signalr", map =>
            {
                // Setup the CORS middleware to run before SignalR.
                // By default this will allow all origins. You can 
                // configure the set of origins and/or http verbs by
                // providing a cors options with a different policy.
                map.UseCors(CorsOptions.AllowAll);
                var hubConfiguration = new HubConfiguration
                {
                    // You can enable JSONP by uncommenting line below.
                    // JSONP requests are insecure but some older browsers (and some
                    // versions of IE) require JSONP to work cross domain
                    EnableJSONP = true,
                    //EnableJavaScriptProxies = true
                };
                // Require authentication for all hubs
                //var authorizer = new QueryStringBearerAuthorizeAttribute();
                //var module = new AuthorizeModule(authorizer, authorizer);
                //GlobalHost.HubPipeline.AddModule(module);
                // Run the SignalR pipeline. We're not using MapSignalR
                // since this branch already runs under the "/signalr" path.
                map.RunSignalR(hubConfiguration);
            });
        }
    }


    public class GuidProvider : IAuthenticationTokenProvider
    {
        private static ConcurrentDictionary<string, AuthenticationTicket> tokens
            = new ConcurrentDictionary<string, AuthenticationTicket>();

        public void Create(AuthenticationTokenCreateContext context)
        {
            throw new NotImplementedException();
        }

        public async System.Threading.Tasks.Task CreateAsync(AuthenticationTokenCreateContext context)
        {
            var guid = Guid.NewGuid().ToString();
            var ticket = Crypto.Hash(guid);
            tokens.TryAdd(ticket, context.Ticket);
            context.SetToken(ticket);
        }

        public void Receive(AuthenticationTokenReceiveContext context)
        {
            throw new NotImplementedException();
        }

        public async System.Threading.Tasks.Task ReceiveAsync(AuthenticationTokenReceiveContext context)
        {
            AuthenticationTicket ticket;

            if (tokens.TryGetValue(context.Token, out ticket))
            {
                if (ticket.Properties.ExpiresUtc.Value < DateTime.UtcNow)
                {
                    tokens.TryRemove(context.Token, out ticket);
                }
                context.SetTicket(ticket);
            }
        }
    }
}
