using System.Web.Mvc;

namespace KTStore.Controllers
{
    public class UserController : Controller
    {
        public ActionResult Customer()
        {
            return View("Customer");
        }
        public ActionResult ListSupplier()
        {
            return View("ListSupplier");
        }
    }
}
