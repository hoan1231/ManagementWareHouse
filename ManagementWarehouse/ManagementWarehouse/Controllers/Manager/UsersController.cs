using CRM_Finance.Library.Helper;
using CRM_Finance.Models;
using CRM_Finance.Models.EFModel;
using CRM_Finance.MP.Core.BUS.MNG;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace CRM_Finance.Controllers.Manager
{
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [MPAuthorize]
    [RoutePrefix("api/Users")]
    public class UsersController : ApiController
    {
        UserServices _UsersServices = new UserServices();


        [Route("AddUsers")]
        [HttpPost]
        public async Task<HttpResponseMessage> AddUsers(AspNetUsers obj)
        {
            var manager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = await manager.FindByNameAsync(obj.UserName);
            if (user != null) return Request.CreateResponse(HttpStatusCode.BadRequest, "Tên đăng nhập đã tồn tại.");

            if (string.IsNullOrEmpty(obj.Email)) obj.Email = string.Empty;

            ApplicationUser appUser = new ApplicationUser()
            {
                UserName = obj.UserName,
                Email = obj.Email,
                CreatedBy = this.RequestContext.Principal.Identity.Name,
                CreatedDate = DateTime.Now,
                FullName = obj.FullName,
            };

            IdentityResult result = manager.Create(appUser, obj.PasswordHash);
            if (!result.Succeeded)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, result.Errors.FirstOrDefault());
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [Route("GetListUser")]
        [HttpPost]

        public object GetListUser(AspNetUsers obj)
        {
            var result = _UsersServices.GetListUser(obj, this.RequestContext.Principal.Identity.GetUserName());
            return new { value = result };
        }

        [Route("GetUserId")]
        [HttpPost]
        public object GetUserId(string UserId)
        {
            var result = _UsersServices.GetUserById(UserId);
            return new { value = result };
        }

        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("UpdateUser")]
        [HttpPost]
        public object UpdateUser(AspNetUsers user)
        {
            var result = _UsersServices.UpdateUser(user, this.RequestContext.Principal.Identity.GetUserName());
            return new { value = result };
        }

        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("DeleteUser")]
        [HttpPost]
        public object DeleteUser(string userId)
        {
            var result = _UsersServices.DeleteUser(userId);
            return new { value = result };
        }

        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("IsLockUser")]
        [HttpPost]
        public async Task<HttpResponseMessage> IsLockUser(string userId, bool check)
        {
            var manager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = await manager.FindByIdAsync(userId);
            if (user == null) return Request.CreateResponse(HttpStatusCode.OK, "Không tìm thấy thông tin tài khoản.");
            IdentityResult result = manager.SetLockoutEnabled(userId, !check);
            if (!result.Succeeded)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, result.Errors.FirstOrDefault());
            }
            return Request.CreateResponse(HttpStatusCode.OK);
        }

        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("IsResetPass")]
        [HttpPost]


        public object IsResetPass(string userId)
        {
            var result = _UsersServices.ResetPass(userId);
            return new { value = result };
        }
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("GetRoleByUser")]
        [HttpPost]
        public object GetRoleByUser(string userId)
        {
            var result = _UsersServices.GetRoleByUser(userId);
            return new { value = result };
        }
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("DeleteRoleByUser")]
        [HttpPost]
        public object DeleteRoleByUser(string userId)
        {
            var result = _UsersServices.DeleteRoleByUser(userId);
            return new { value = result };
        }
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("UpdateRoleByUser")]
        [HttpPost]
        public object UpdateRoleByUser(string UserId, string RoleId)
        {
            var result = _UsersServices.UpdateRoleByUser(UserId, RoleId);
            return new { value = result };
        }
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("EditUser")]
        [HttpPost]

        public object EditUser(string data, string userId, string type)
        {
            var result = _UsersServices.EditUser(data, userId, type, this.RequestContext.Principal.Identity.GetUserName());
            return new { value = result };
        }
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("ImportUser")]
        [HttpPost]
        public object ImportUser()
        {
            var file = HttpContext.Current.Request.Files["file"];
            if (file != null)
            {
                if (file.ContentType == "application/vnd.ms-excel" ||
                    file.ContentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                {
                    string mapPath = System.Configuration.ConfigurationManager.AppSettings["PathUploadFile"];
                    if (!Directory.Exists(mapPath))
                    {
                        Directory.CreateDirectory(mapPath);
                    }
                    string extention = Path.GetExtension(mapPath + file.FileName);
                    string nameWh = Path.GetFileNameWithoutExtension(mapPath + file.FileName);
                    string path = System.Web.HttpContext.Current.Server.MapPath(mapPath + DateTime.Now.ToString("yyyyMMddHHmmss") + "_" + nameWh + extention);
                    file.SaveAs(path);
                    DataTable tbl = new DataTable();
                    tbl = _UsersServices.ExcelToDataTableUsingExcelDataReader(path);
                    var result = _UsersServices.ReadImportData(tbl, this.RequestContext.Principal.Identity.GetUserName());
                    return new { status = MP_AjaxError.OK, value = result };
                }
                else return new { status = MP_AjaxError.NotFound };
            }
            else return new { status = MP_AjaxError.NotFound };
        }

    }
}
