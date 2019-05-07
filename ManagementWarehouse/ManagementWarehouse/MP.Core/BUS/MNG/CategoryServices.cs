using CRM_Finance.Library.Helper;
using CRM_Finance.Models.EFModel;
using CRM_Finance.MP.Core.Lib.Helper;
using CRM_Finance.MP.Core.ModelExt.MNG;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace CRM_Finance.MP.Core.BUS.MNG
{
    public class CategoryServices
    {
        private ManagementWarehouseEntities dbContext = null;
        public CategoryServices()
        {
            dbContext = new ManagementWarehouseEntities();
        }

        #region CatType
        /// <summary>
        /// Lấy lên cây danh mục
        /// </summary>
        public object GetAllCatType4Tree()
        {
            List<CategoryModel> lst =
                dbContext.Database.SqlQuery<CategoryModel>("dbo.MNG_GetAllCatType").ToList<CategoryModel>();
            if (lst != null && lst.Count > 0)
            {
                lst.ForEach(x =>
                {
                    if (x.HasChild)
                    {
                        x.children = dbContext.MNG_CatType.Where(c =>
                            c.CatTypeGroup == x.CatTypeCode && !c.IsDeleted).Select(s =>
                                new CategoryModel()
                                {
                                    text = s.CatTypeName,
                                    icon = "fa fa-keyboard-o",
                                    CatTypeCode = s.CatTypeCode,
                                    CatTypeGroup = s.CatTypeGroup,
                                    CatTypeName = s.CatTypeName,
                                    HasChild = false
                                }).ToList();
                    }
                });
            }
            return new CategoryModel() { text = "Danh mục", children = lst, state = new StateCategoryTree() { opened = true, selected = true } };
        }

        /// <summary>
        /// Cập nhật tên danh mục
        /// </summary>
        /// <param name="cat"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object UpdateCateTypeName(MNG_CatType cat, string userName)
        {
            try
            {
                MNG_CatType catType = dbContext.MNG_CatType.Where(x => x.CatTypeCode == cat.CatTypeCode && !x.IsDeleted).FirstOrDefault();
                if (catType == null) return MP_AjaxError.NotFound;
                if (dbContext.MNG_CatType.Any(x => x.CatTypeName == cat.CatTypeName && x.CatTypeCode != cat.CatTypeCode))
                    return MP_AjaxError.Exits;

                catType.CatTypeName = cat.CatTypeName;
                dbContext.SaveChanges();
                return MP_AjaxError.OK;
            }
            catch (System.Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Thêm mới CatType
        /// </summary>
        /// <param name="cat"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object AddNewCatType(MNG_CatType cat, string userName)
        {
            try
            {
                #region HANDLER
                string[] value = CRMHelper.RemoveUnicode(cat.CatTypeName).Split(' ');
                string result = string.Empty;
                for (int i = 0; i < value.Count(); i++)
                {
                    result += value[i].Substring(0, 1);
                }
                if (result.Length > 5)
                    result = result.Substring(0, 5);

                if (!dbContext.MNG_Category.Any(x => x.CatTypeCode == result))
                {
                    cat.IsDeleted = false;
                    cat.CatTypeCode = result;
                    dbContext.MNG_CatType.Add(cat);
                    dbContext.SaveChanges();
                }
                else
                {
                    return MP_AjaxError.Exits;
                }
                return MP_AjaxError.OK;
                #endregion
            }
            catch (System.Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Cập nhật isdeleted = true cho CatType
        /// </summary>
        /// <param name="cat"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object DeleteCateType(MNG_CatType cat)
        {
            try
            {
                MNG_CatType _cat = dbContext.MNG_CatType.Where(x => x.CatTypeCode == cat.CatTypeCode && !x.IsDeleted).FirstOrDefault();
                if (_cat != null)
                {
                    _cat.IsDeleted = true;
                    dbContext.SaveChanges();
                    return MP_AjaxError.OK;
                }
                else
                {
                    return MP_AjaxError.NotFound;
                }
            }
            catch (System.Exception ex)
            {
                return ex.Message;
            }

        }
        #endregion

        #region Category
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cateTypeCode"></param>
        /// <returns></returns>
        public object GetCategoryByCatTypeCode(string cateTypeCode)
        {
            return dbContext.MNG_Category.Where(x => x.CatTypeCode == cateTypeCode && !x.IsDeleted).OrderBy(o => o.CatCode).ToList();

        }

        /// <summary>
        /// Thêm mới category
        /// </summary>
        /// <param name="category"></param>
        /// <returns></returns>
        public object AddNewCategory(MNG_Category category, string userName)
        {
            try
            {
                MNG_Category obj = new MNG_Category
                {
                    CatName = category.CatName,
                    CatTypeCode = category.CatTypeCode,
                    CatCode = category.CatCode,
                    CatID = Guid.NewGuid(),
                    CreatedBy = userName,
                    CreatedDate = DateTime.Now,
                    ExpandProperties = category.ExpandProperties,
                    IsDeleted = false,
                    OrderBy = 0,
                    Value = string.Empty
                };
                dbContext.MNG_Category.Add(obj);
                dbContext.SaveChanges();
                return MP_AjaxError.OK;
            }
            catch (System.Exception ex)
            {
                return ex.Message;
            }

        }

        /// <summary>
        /// Cập nhật category
        /// </summary>
        /// <param name="category"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object UpdateCategory(MNG_Category category, string userName)
        {
            #region VALIDATE
            MNG_Category cate = dbContext.MNG_Category.Where(x => !x.IsDeleted && x.CatID == category.CatID).FirstOrDefault();
            if (cate == null) return MP_AjaxError.NotFound;//Không tìm thấy

            if (dbContext.MNG_Category.Any(x => !x.IsDeleted && x.CatID != category.CatID && x.CatCode == category.CatCode))
                return MP_AjaxError.Exits;//Tồn tại CatCode
            #endregion

            #region  HANDLER
            try
            {
                cate.CatCode = category.CatCode;
                cate.CatName = category.CatName;
                cate.ExpandProperties = category.ExpandProperties;
                cate.UpdatedBy = userName;
                cate.UpdatedDate = DateTime.Now;
                dbContext.SaveChanges();
                return MP_AjaxError.OK;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            #endregion
        }

        /// <summary>
        /// Cập nhật isdeleted = true cho Category
        /// </summary>
        /// <param name="cat"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object DeleteCategory(MNG_Category cat)
        {
            try
            {
                MNG_Category _cat = dbContext.MNG_Category.Where(x => x.CatCode == cat.CatCode && !x.IsDeleted).FirstOrDefault();
                if (_cat != null)
                {
                    _cat.IsDeleted = true;
                    dbContext.SaveChanges();
                    return MP_AjaxError.OK;
                }
                else
                {
                    return MP_AjaxError.NotFound;
                }
            }
            catch (System.Exception ex)
            {
                return ex.Message;
            }
            #endregion
        }


    }
}