using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http.Controllers;
using System.Web.Mvc;

namespace KTStore
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }

    public class MPAuthorize : System.Web.Http.AuthorizeAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var currentIdentity = System.Threading.Thread.CurrentPrincipal.Identity;
            if (!currentIdentity.IsAuthenticated)
            {
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Unauthorized");
                return;
            }

            if (actionContext.Request.Headers.Contains("AuthorizeLocation"))
            {
                string token = actionContext.Request.Headers.GetValues("AuthorizeLocation").First();
                string[] directTokens = { "MNG" };
                if (!directTokens.Contains(token))
                {
                    actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "BadRequest");
                    return;
                }
            }

            try
            {
                string Menus = ((ClaimsPrincipal)System.Threading.Thread.CurrentPrincipal).Claims.Where(c =>
                c.Type == "Menus").Select(x => x.Value).SingleOrDefault();
                var item = actionContext.Request.Headers.Referrer.LocalPath;
                if (string.IsNullOrEmpty(Menus))
                {
                    actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Forbidden");
                    return;
                }
                string[] menuArr = Menus.Split(',');
                if (menuArr == null && menuArr.Length == 0)
                {
                    actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Forbidden");
                    return;
                }
                if (menuArr.Contains(item))
                {
                    var _menuServices = new MP.Core.BUS.MNG.MenuServices();
                    string userID = ((ClaimsPrincipal)System.Threading.Thread.CurrentPrincipal).Claims.Where(c =>
                    c.Type == "UserID").Select(x => x.Value).SingleOrDefault();
                    if (!_menuServices.CheckMenuByUserIdAndUrl(userID, item))
                    {
                        actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Forbidden");
                        return;
                    }
                }
                else
                {
                    actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Forbidden");
                    return;
                }
            }
            catch (Exception)
            {
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Forbidden, "Forbidden");
                return;
            }

        }
    }
}
