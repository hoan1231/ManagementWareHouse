using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(KTStore.Startup))]

namespace KTStore
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
