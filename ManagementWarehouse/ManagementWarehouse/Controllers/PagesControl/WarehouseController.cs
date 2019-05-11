using KTStore.Library.Helper;
using System;
using System.Web.Mvc;

namespace KTStore.Controllers
{
    public class WarehouseController : Controller
    {
        public ActionResult Tranfer()
        {
            return View("Tranfer");
        }
        public ActionResult ReturnProduct()
        {
            return View("ReturnProduct");
        }
        public ActionResult WareHouse()
        {
            return View("WareHouse");
        }
    }
}
