using KTStore.Models;
using KTStore.MP.Core.BUS.MNG;
using KTStore.MP.Core.ModelExt.MNG;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace KTStore.Controllers.Manager
{
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [MPAuthorize]
    [RoutePrefix("api/MNG/UserInfor")]
    public class UserInforController : ApiController
    {
        private RoleServices _RoleServices = new RoleServices();

        /// <summary>
        /// Lấy thông tin cá nhân
        /// </summary>
        /// <returns></returns>
        [Route("Get")]
        [HttpGet]
        public HttpResponseMessage GetUserInfor()
        {
            var userManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            ApplicationUser user = userManager.FindByName(this.RequestContext.Principal.Identity.Name);
            if (user == null) return Request.CreateResponse(HttpStatusCode.BadRequest, "Không tìm thấy thông tin tài khoản.");

            //Lấy danh sách quyền
            List<string> roles = _RoleServices.GetAllRoleNameByUserId(user.Id);
            string rolesStr = string.Empty;
            if (roles != null && roles.Count > 0)
            {
                roles.ForEach(x =>
                {
                    rolesStr += string.IsNullOrEmpty(rolesStr) ? x : (", " + x);
                });

            }

            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                value = new UserInforResponseModel()
                {
                    Email = user.Email,
                    Fullname = user.FullName,
                    Phonenumber = user.PhoneNumber,
                    Roles = rolesStr
                }
            });
        }

        /// <summary>
        /// Cập nhật thông tin cá nhân
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("UpdateInfor")]
        [HttpPost]
        public async Task<HttpResponseMessage> UpdateInfor(UserInforResponseModel model)
        {
            if (string.IsNullOrEmpty(model.Fullname) || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Phonenumber))
                return Request.CreateResponse(HttpStatusCode.BadGateway, "Yêu cầu nhập đủ thông tin.");

            if (!MP.Core.Lib.Helper.CRMHelper.IsValidEmail(model.Email)) return Request.CreateResponse(HttpStatusCode.BadGateway, "Sai định dạng email.");

            var userManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            ApplicationUser user = userManager.FindByName(this.RequestContext.Principal.Identity.Name);
            if (user == null) return Request.CreateResponse(HttpStatusCode.BadRequest, "Không tìm thấy thông tin tài khoản.");

            user.Email = model.Email;
            user.PhoneNumber = model.Phonenumber;
            user.FullName = model.Fullname;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, result.Errors.ToString());
            }

            return Request.CreateResponse(HttpStatusCode.OK, "OK");
        }


        /// <summary>
        /// Thay đổi mật khẩu
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [Route("ChangePassword")]
        [HttpPost]
        public async Task<HttpResponseMessage> ChangePassword(ChangePasswordRequestModel model)
        {
            if (string.IsNullOrEmpty(model.OldPass) || string.IsNullOrEmpty(model.NewPass) || string.IsNullOrEmpty(model.ReNewPass))
                return Request.CreateResponse(HttpStatusCode.BadGateway, "Yêu cầu nhập đủ thông tin.");
            if (model.NewPass != model.ReNewPass)
                return Request.CreateResponse(HttpStatusCode.BadGateway, "Nhập lại mật khẩu không khớp.");
            var userManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            ApplicationUser user = userManager.Find(this.RequestContext.Principal.Identity.Name, model.OldPass);
            if (user == null) return Request.CreateResponse(HttpStatusCode.BadRequest, "Mật khẩu cũ không chính xác.");

            if (model.OldPass == model.NewPass) return Request.CreateResponse(HttpStatusCode.BadRequest, "Mật khẩu mới không được trùng với mật khẩu cũ.");

            var result = await userManager.ChangePasswordAsync(user.Id, model.OldPass, model.NewPass);
            if (!result.Succeeded)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Mật khẩu yêu cầu 8 ký tự, bao gồm: số, chữ hoa, chữ thường, ký tự đặc biệt.");
            }

            return Request.CreateResponse(HttpStatusCode.OK, "OK");
        }
    }
}
