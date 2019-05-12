using KTStore.Library.Helper;
using System;
using System.Web.Mvc;

namespace KTStore.Controllers
{
    public class ReportsController : Controller
    {
        public ActionResult TurnoverByDay()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("TurnoverByDay");
        }
        public ActionResult TurnoverByMonth()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("TurnoverByMonth");
        }
        public ActionResult CustomerStatistics()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("CustomerStatistics");
        }
        public ActionResult AgentStatistics()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("AgentStatistics");
        }
        public ActionResult SupplierStatistics()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("SupplierStatistics");
        }
        public ActionResult ReportProduct()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("ReportProduct");
        }
        public ActionResult ProfitAndCost()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("ProfitAndCost");
        }
        public ActionResult ReportSalesByBranch()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("ReportSalesByBranch");
        }
        public ActionResult InventoryChart()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("InventoryChart");
        }
    }
}
