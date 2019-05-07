using CRM_Finance.Library.Helper;
using System;
using System.Web.Mvc;

namespace CRM_Finance.Controllers
{
    public class ProductsController : Controller
    {
       
        public ActionResult Sales()
        {
            return View("Sales");
        }
    }
}
