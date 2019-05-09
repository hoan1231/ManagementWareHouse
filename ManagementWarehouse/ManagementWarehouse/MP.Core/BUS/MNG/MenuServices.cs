using KTStore.Library.Helper;
using KTStore.Models.EFModel;
using Library.Helper;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace KTStore.MP.Core.BUS.MNG
{
    public class MenuServices
    {

        /// <summary>
        /// Lấy menu theo userID
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public object GetMenuByUserId(string userID)
        {
            SqlParameter param = new SqlParameter("@UserID", userID);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_GetMenuByUserID", param);
        }

        /// <summary>
        /// Lấy menu theo userID cho manager
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public object GetMenuManagerByUserId(string userID)
        {
            SqlParameter param = new SqlParameter("@UserID", userID);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_GetMenuByUserID", param);
        }

        /// <summary>
        /// Lấy menu theo userID cho phần đăng nhập claims
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public string GetMenu4ClaimsByUserId(string userID)
        {
            try
            {
                SqlParameter param = new SqlParameter("@UserID", userID);
                DataTable dt = SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_GetMenu4ClaimByUserID", param);
                if (dt != null && dt.Rows.Count > 0) return dt.Rows[0][0].ToString();
                else return string.Empty;
            }
            catch (System.Exception)
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// Lấy menu theo userID cho phần đăng nhập claims
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public bool CheckMenuByUserIdAndUrl(string userID, string url)
        {
            try
            {
                SqlParameter param = new SqlParameter("@UserID", userID);
                DataTable dt = SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "MNG_GetMenu4ClaimByUserID", param);
                if (dt != null && dt.Rows.Count > 0) return true;
                else return false;
            }
            catch (System.Exception)
            {
                return false;
            }
        }

        /// <summary>
        /// Lấy thông tin menu theo menu cha hệ thống hiện tại
        /// </summary>
        /// <param name="parentId"></param>
        /// <returns></returns>
        public object GetMenuChildByParentId(string parentId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@ParentId", parentId);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure,
                "dbo.[MNG_GetMenuChildByParentId]", param);
        }



        /// <summary>
        /// Cập nhật trường Isdelete = true cho menu
        /// </summary>
        /// <param name="menuId"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object DeleteMenu(string menuId, string userName)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[2];
                param[0] = new SqlParameter("@MenuId", menuId);
                param[1] = new SqlParameter("@userName", userName);
                SqlHelper.ExecuteNonQuery(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_UpdateDeleteMenu", param);
                return MP_AjaxError.OK;
            }
            catch (System.Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Cập nhật thông tin quyền
        /// </summary>
        /// <param name="menu"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object UpdateMenu(MNG_Menu menu, string userName)
        {
            try
            {
                KTStoreEntities dbContext = new KTStoreEntities();
                if (dbContext.MNG_Menu.Any(x => x.OrderIndex == menu.OrderIndex && x.MenuName == menu.MenuName && x.MenuId != menu.MenuId))
                    return MP_AjaxError.Exits;

                MNG_Menu mNG_Menu = dbContext.MNG_Menu.Where(x =>
                    x.MenuId == menu.MenuId && !x.IsDeleted).FirstOrDefault();
                if (mNG_Menu == null) return MP_AjaxError.NotFound;

                mNG_Menu.MenuName = menu.MenuName;
                mNG_Menu.MenuUrl = menu.MenuUrl;
                mNG_Menu.OrderIndex = menu.OrderIndex;
                mNG_Menu.Note = menu.Note;
                mNG_Menu.IsEnable = menu.IsEnable;
                mNG_Menu.UpdatedBy = userName;
                mNG_Menu.UpdatedDate = DateTime.Now;
                dbContext.SaveChanges();
                return MP_AjaxError.OK;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Thêm mới thông tin menu
        /// </summary>
        /// <param name="menu"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public string AddMenu(MNG_Menu menu, string userName)
        {
            try
            {
                KTStoreEntities dbContext = new KTStoreEntities();
                if (dbContext.MNG_Menu.Any(x => x.OrderIndex == menu.OrderIndex && x.MenuName == menu.MenuName))
                    return MP_AjaxError.Exits;
                dbContext.MNG_Menu.Add(new MNG_Menu()
                {
                    Action = string.Empty,
                    CreatedBy = userName,
                    CreatedDate = DateTime.Now,
                    Icon = string.Empty,
                    IsDeleted = false,
                    IsEnable = true,
                    MenuId = Guid.NewGuid(),
                    MenuName = menu.MenuName,
                    MenuUrl = menu.MenuUrl,
                    Note = menu.Note,
                    OrderIndex = menu.OrderIndex,
                    ParentId = menu.ParentId
                });
                dbContext.SaveChanges();
                return MP_AjaxError.OK;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}