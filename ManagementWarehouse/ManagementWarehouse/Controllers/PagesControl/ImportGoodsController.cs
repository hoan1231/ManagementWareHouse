using CRM_Finance.Library.Helper;
using System;
using System.Web.Mvc;

namespace CRM_Finance.Controllers
{
    public class ImportGoodsController : Controller
    {
        public ActionResult ListOrderImport()
        {
            return View("ListOrderImport");
        }
        public ActionResult AddOrderImport()
        {
            return View("AddOrderImport");
        }
        public ActionResult ListExpenses()
        {
            return View("ListExpenses");
        }
        public ActionResult TransferWarehouse()
        {
            return View("TransferWarehouse");
        }
    }
}
