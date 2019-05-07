using CRM_Finance.Models.EFModel;
using CRM_Finance.MP.Core.BUS.MNG;
using Microsoft.AspNet.Identity;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CRM_Finance.Controllers.Manager
{
    [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
    [MPAuthorize]
    [RoutePrefix("api/Category")]
    public class CategoryController : ApiController
    {
        CategoryServices _categoryServices = new CategoryServices();

        #region CATTYPE
        /// <summary>
        /// Lấy cây thư mục
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetAllCatType4Tree")]
        public object GetAllCatType4Tree()
        {
            return _categoryServices.GetAllCatType4Tree();
        }

        /// <summary>
        /// Cập nhật cattypename
        /// </summary>
        /// <param name="cat"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("UpdateCateTypeName")]
        public HttpResponseMessage UpdateCateTypeName(MNG_CatType cat)
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new { status = _categoryServices.UpdateCateTypeName(cat, this.RequestContext.Principal.Identity.Name) });
        }

        /// <summary>
        /// Thêm mới Cattype
        /// </summary>
        /// <param name="cat"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("AddNewCatType")]
        public HttpResponseMessage AddNewCatType(MNG_CatType cat)
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new { status = _categoryServices.AddNewCatType(cat, this.RequestContext.Principal.Identity.Name) });
        }

        /// <summary>
        /// Delete Cattype
        /// </summary>
        /// <param name="cat"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("DeleteCateType")]
        public HttpResponseMessage DeleteCateType(MNG_CatType cat)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { status = _categoryServices.DeleteCateType(cat) });
        }
        #endregion

        #region CATEGORY
        /// <summary>
        /// Lấy danh sách category theo cattypecode
        /// </summary>
        /// <param name="catTypeCode"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetCategoryByCatTypeCode")]
        public HttpResponseMessage GetCategoryByCatTypeCode(string catTypeCode)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { value = _categoryServices.GetCategoryByCatTypeCode(catTypeCode) });
        }

        /// <summary>
        /// Thêm mới category
        /// </summary>
        /// <param name="category"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("AddNewCategory")]
        public HttpResponseMessage AddNewCategory(MNG_Category category)
        {
            return Request.CreateResponse(HttpStatusCode.OK,
                new { value = _categoryServices.AddNewCategory(category, this.RequestContext.Principal.Identity.Name) });
        }

        /// <summary>
        /// Cập nhật category
        /// </summary>
        /// <param name="cate"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("UpdateCategory")]
        public HttpResponseMessage UpdateCategory(MNG_Category cate)
        {
            #region VALIDATE
            if (cate == null || string.IsNullOrEmpty(cate.CatTypeCode) || string.IsNullOrEmpty(cate.CatCode) || string.IsNullOrEmpty(cate.CatName))
                return Request.CreateResponse(HttpStatusCode.BadRequest, "NoCategory");
            #endregion

            return Request.CreateResponse(HttpStatusCode.OK,
                new { value = _categoryServices.UpdateCategory(cate, this.RequestContext.Principal.Identity.Name) });
        }

        /// <summary>
        /// Xóa category
        /// </summary>
        /// <param name="cat"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("DeleteCategory")]
        public HttpResponseMessage DeleteCategory(MNG_Category cat)
        {
            return Request.CreateResponse(HttpStatusCode.OK, new { status = _categoryServices.DeleteCategory(cat) });
        }


        #endregion
    }
}
