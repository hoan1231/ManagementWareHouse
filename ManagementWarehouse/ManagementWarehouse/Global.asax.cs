using KTStore.MP.Core.Lib.Helper;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace KTStore
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings
                    .ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            GlobalConfiguration.Configuration.Formatters
                .Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);

          
            //App.Scheduler.Start(120);
        }

        protected void Application_End()
        {
            //if (App.Scheduler != null)
            //{
            //    App.Scheduler.Dispose();
            //    App.Scheduler = null;
            //}
            ////Force the App to be restarted immediately
            //Scheduler sc = new Scheduler();
            //sc.PingServer();
        }
    }
}
