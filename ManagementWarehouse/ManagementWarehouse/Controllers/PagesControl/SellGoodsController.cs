using CRM_Finance.Library.Helper;
using System;
using System.Web.Mvc;

namespace CRM_Finance.Controllers
{
    public class SellGoodsController : Controller
    {
        public ActionResult ListOrderSell()
        {
            return View("ListOrderSell");
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
