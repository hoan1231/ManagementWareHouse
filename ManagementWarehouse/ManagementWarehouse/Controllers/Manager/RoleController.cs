using KTStore.Library.Helper;
using KTStore.MP.Core.BUS.MNG;
using KTStore.MP.Core.ModelExt.MNG;
using Microsoft.AspNet.Identity;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace KTStore.Controllers.Manager
{
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [Authorize]
    [RoutePrefix("api/Role")]
    public class RoleController : ApiController
    {
        #region PROPERTIES
        RoleServices _roleServices = new RoleServices();
        #endregion

        #region TAB: Quyền hệ thống


        [Route("UpdateRoleInMenu")]
        [HttpPost]
        public HttpResponseMessage UpdateRoleInMenu(RoleMenuUpdateModel objs)
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new { value = _roleServices.UpdateRoleInMenu(objs, this.RequestContext.Principal.Identity.Name) });
        }

        /// <summary>
        /// Thêm mới quyền cho công ty
        /// </summary>
        /// <param name="roleName"></param>
        /// <returns></returns>
        [Route("AddSysRole")]
        [HttpPost]
        public HttpResponseMessage AddSysRole(string roleName)
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new { value = _roleServices.AddSysRole(roleName, this.RequestContext.Principal.Identity.Name) });
        }


        /// <summary>
        /// Lấy thông tin quyền hệ thống
        /// </summary>
        /// <returns></returns>
        [Route("GetAllRoles")]
        [HttpGet]
        public HttpResponseMessage GetAllRolesAndModules()
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new
                {
                    roles = _roleServices.GetAllRoles(),
                    modules = _roleServices.GetAllModules()
                });
        }


        [Route("GetMenuChild")]
        [HttpPost]
        public HttpResponseMessage GetMenuChild(string MenuId, string RoleId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                value = _roleServices.GetMenuChild(MenuId, RoleId)
            });
        }

        [Route("EditSysRoleName")]
        [HttpPost]
        public HttpResponseMessage EditSysRoleName(string name, string roleId)
        {
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(roleId))
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            Guid _RoleId = Guid.Empty;
            bool checkRole = Guid.TryParse(roleId, out _RoleId);
            if (!checkRole) return Request.CreateResponse(HttpStatusCode.BadRequest);

            string response = _roleServices.EditSysRoleName(name, roleId, this.RequestContext.Principal.Identity.Name);
            if (response != MP_AjaxError.OK) return Request.CreateResponse(HttpStatusCode.BadRequest);
            return Request.CreateResponse(HttpStatusCode.OK, new { value = response });
        }

        /// <summary>
        /// Lấy danh sách user theo quyền
        /// </summary>
        /// <param name="roleID"></param>
        /// <returns></returns>
        [Route("GetUsersInRole")]
        [HttpPost]
        public HttpResponseMessage GetUsersInRole(string roleID)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { value = _roleServices.GetUsersInRoleByRoleID(roleID) });
        }


        [Route("ApprovedRole")]
        [HttpPost]
        public HttpResponseMessage ApprovedRole(string roleID, bool check)
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new { value = _roleServices.ApprovedRole(roleID, !check, this.RequestContext.Principal.Identity.Name) });
        }

        #endregion
    }
}
