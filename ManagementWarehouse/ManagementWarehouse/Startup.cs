using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(CRM_Finance.Startup))]

namespace CRM_Finance
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
