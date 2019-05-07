using CRM_Finance.Models.EFModel;
using CRM_Finance.MP.Core.BUS.MNG;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CRM_Finance.Controllers.Manager
{
    [MPAuthorize]
    [RoutePrefix("api/Menu")]
    public class MenuController : ApiController
    {
        MenuServices _menuServices = new MenuServices();

        /// <summary>
        /// Lấy menu cha của hệ thống hiện tại
        /// </summary>
        /// <returns></returns>
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [HttpGet]
        [Route("GetAllMenuParent")]
        public HttpResponseMessage GetAllMenuParent()
        {
            ManagementWarehouseEntities dbContext = new ManagementWarehouseEntities();
            List<MNG_Menu> lst = dbContext.MNG_Menu.Where(x =>
            !x.IsDeleted && (!x.ParentId.HasValue || x.ParentId.Value == Guid.Empty)).ToList<MNG_Menu>();

            return Request.CreateResponse(HttpStatusCode.OK, new { valueMenu = lst });
        }

        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [HttpPost]
        [Route("GetMenuChildByParentId")]
        public HttpResponseMessage GetMenuChildByParentId(string parentId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { value = _menuServices.GetMenuChildByParentId(parentId) });
        }

        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [HttpPost]
        [Route("DeleteMenu")]
        public HttpResponseMessage DeleteMenu(string menuId)
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new { value = _menuServices.DeleteMenu(menuId, this.RequestContext.Principal.Identity.Name) });
        }

        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [HttpPost]
        [Route("UpdateMenu")]
        public HttpResponseMessage UpdateMenu(MNG_Menu menu)
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new { value = _menuServices.UpdateMenu(menu, this.RequestContext.Principal.Identity.Name) });
        }


        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [HttpPost]
        [Route("AddSysMenu")]
        public HttpResponseMessage AddSysMenu(MNG_Menu menu)
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new { value = _menuServices.AddMenu(menu, this.RequestContext.Principal.Identity.Name) });
        }
    }
}
