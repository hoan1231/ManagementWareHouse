using KTStore.Library.Helper;
using System;
using System.Web.Mvc;

namespace KTStore.Controllers
{
    public class ReportsController : Controller
    {
        public ActionResult TurnoverByDay()
        {
            return View("TurnoverByDay");
        }
        public ActionResult TurnoverByMonth()
        {
            return View("TurnoverByMonth");
        }
        public ActionResult CustomerStatistics()
        {
            return View("CustomerStatistics");
        }
        public ActionResult AgentStatistics()
        {
            return View("AgentStatistics");
        }
        public ActionResult SupplierStatistics()
        {
            return View("SupplierStatistics");
        }
        public ActionResult ReportProduct()
        {
            return View("ReportProduct");
        }
        public ActionResult ProfitAndCost()
        {
            return View("ProfitAndCost");
        }
        public ActionResult ReportSalesByBranch()
        {
            return View("ReportSalesByBranch");
        }
        public ActionResult InventoryChart()
        {
            return View("InventoryChart");
        }
    }
}
