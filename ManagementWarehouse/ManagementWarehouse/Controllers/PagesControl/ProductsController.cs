using KTStore.Library.Helper;
using System;
using System.Web.Mvc;

namespace KTStore.Controllers
{
    public class ProductsController : Controller
    {
        public ActionResult ListProduct()
        {
            return View("ListProduct");
        }
        public ActionResult PrintBarCode()
        {
            return View("PrintBarCode");
        }
        public ActionResult AddAjustment()
        {
            return View("AddAjustment");
        }
        public ActionResult StoctCounts()
        {
            return View("StoctCounts");
        }
        public ActionResult Quotes()
        {
            return View("Quotes");
        }
        public ActionResult Promotion()
        {
            return View("Promotion");
        }
    }
}
