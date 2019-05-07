using System.Web.Mvc;

namespace CRM_Finance.Controllers.PagesControl
{
    public class ErrController : Controller
    {
        // GET: Help
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Forbidden()
        {
            return View("Forbidden");
        }
        public ActionResult Notfound()
        {
            return View("Notfound");
        }
    }
}