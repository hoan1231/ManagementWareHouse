using KTStore.Library.Helper;
using System;
using System.Web.Mvc;

namespace KTStore.Controllers
{
    public class MNGController : Controller
    {
        /// <summary>
        /// Danh sách tài khoản
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View("Users");
        }

        /// <summary>
        /// Thông tin tài khoản
        /// </summary>
        /// <returns></returns>
        public ActionResult UserInfor()
        {
            return View("UserInfor");
        }

        /// <summary>
        /// Danh sách tài khoản
        /// </summary>
        /// <returns></returns>
        public ActionResult Users()
        {
            return View("Users");
        }

        /// <summary>
        /// Quản lý quyền
        /// </summary>
        /// <returns></returns>
        public ActionResult Role()
        {
            return View("Role");
        }

        /// <summary>
        /// Quản lý menu
        /// </summary>
        /// <returns></returns>
        public ActionResult Menu()
        {
            return View("Menu");
        }

        /// <summary>
        /// Lịch sử đăng nhập
        /// </summary>
        /// <returns></returns>
        public ActionResult LoginHistory()
        {
            ViewData["fromDate"] = DateTime.Now.AddDays(-7).ToString(MP_FormatHelper.Format103);
            ViewData["toDate"] = DateTime.Now.ToString(MP_FormatHelper.Format103);
            return View("LoginHistory");
        }

        /// <summary>
        /// Quản lý danh mục
        /// </summary>
        /// <returns></returns>
        public ActionResult Category()
        {
            return View("Category");
        }

        /// <summary>
        /// Quên mật khẩu
        /// </summary>
        /// <returns></returns>
        public ActionResult ForgotPassword()
        {
            return View("ForgotPassword");
        }
    }
}
