using KTStore.Library.Helper;
using System;
using System.Web.Mvc;

namespace KTStore.Controllers
{
    public class SellGoodsController : Controller
    {
        public ActionResult ListOrderSell()
        {
            return View("ListOrderSell");
        }
        public ActionResult AddOrderSell()
        {
            return View("AddOrderSell");
        }
        public ActionResult Deliveries()
        {
            return View("Deliveries");
        }
        public ActionResult Promotion()
        {
            return View("Promotion");
        }
    }
}
