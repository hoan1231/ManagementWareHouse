using KTStore.Library.Helper;
using KTStore.MP.Core.BUS.MNG;
using KTStore.MP.Core.Lib.Helper;
using System;
using System.Web.Http;

namespace KTStore.Controllers.Manager
{
    [MPAuthorize]
    [RoutePrefix("api/LoginHis")]
    public class LoginHistoryController : ApiController
    {
        LoginHistoryServices _loginHistoryServices = new LoginHistoryServices();

        [HttpPost]
        [Route("GetHistory")]
        public object GetHistory(string from, string to, bool isExport)
        {
            DateTime dtFrom = DateTime.Now, dtTo = DateTime.Now;
            bool chkFrom = DateTime.TryParseExact(from, MP_FormatHelper.Format103, System.Globalization.CultureInfo.InvariantCulture,
               System.Globalization.DateTimeStyles.None, out dtFrom);
            bool chkTo = DateTime.TryParseExact(to, MP_FormatHelper.Format103, System.Globalization.CultureInfo.InvariantCulture,
               System.Globalization.DateTimeStyles.None, out dtTo);
            if (!chkFrom || !chkTo) return new { status = MP_AjaxError.DateFormat };

            return new { status = MP_AjaxError.OK, value = _loginHistoryServices.GetLoginHistory(dtFrom.AbsoluteStart(), dtTo.AbsoluteEnd(), isExport) };
        }
    }
}
