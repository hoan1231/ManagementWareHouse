using KTStore.Library.Helper;
using KTStore.Models.EFModel;
using KTStore.MP.Core.ModelExt.MNG;
using Library.Helper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace KTStore.MP.Core.BUS.MNG
{
    public class RoleServices
    {
        KTStoreEntities dbContext = null;

        public RoleServices()
        {
            dbContext = new KTStoreEntities();
        }

        /// <summary>
        /// Lấy tất cả quyền theo công ty
        /// </summary>
        /// <returns></returns>
        public DataTable GetCompanyAllRoles(string IDCompany)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@IDCompany", IDCompany);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "[dbo].[MNG_GetCompanyAllRoles]", param);
        }

        /// <summary>
        /// Lấy tất cả quyền hệ thống
        /// </summary>
        /// <returns></returns>
        public DataTable GetAllRoles()
        {
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "[dbo].[MNG_GetAllRoles]");
        }


        /// <summary>
        /// Lấy tất cả Menu Parent theo công ty
        /// </summary>
        /// <returns></returns>
        public DataTable GetCompanyAllModules(string IDCompany)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@IDCompany", IDCompany);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "[dbo].[MNG_GetCompanyAllModules]", param);
        }

        /// <summary>
        /// Lấy tất cả Menu Parent hệ thống
        /// </summary>
        /// <returns></returns>
        public DataTable GetAllModules()
        {
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "[dbo].[MNG_GetAllModules]");
        }

        /// <summary>
        /// Lấy menu con theo menu cha, quyền công ty
        /// </summary>
        /// <param name="MenuId"></param>
        /// <param name="RoleId"></param>
        /// <param name="CompanyId"></param>
        /// <returns></returns>
        public DataTable GetCompanyMenuChild(string MenuId, string RoleId, string CompanyId)
        {
            SqlParameter[] param = new SqlParameter[3];
            param[0] = new SqlParameter("@RoleID", RoleId);
            param[1] = new SqlParameter("@MenuID", MenuId);
            param[2] = new SqlParameter("@IDCompany", CompanyId);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.[MNG_GetCompanyMenuChildByRoleIDAndMenuID]", param);
        }

        /// <summary>
        /// Lấy menu con theo menu cha, quyền hệ thống
        /// </summary>
        /// <param name="MenuId"></param>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public DataTable GetMenuChild(string MenuId, string RoleId)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@RoleID", RoleId);
            param[1] = new SqlParameter("@MenuID", MenuId);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure,
                "dbo.[MNG_GetMenuChildByRoleIDAndMenuID]", param);
        }

        /// <summary>
        /// Lấy tất user trong role theo roleid
        /// </summary>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public DataTable GetUsersInRoleByRoleID(string RoleId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@RoleID", RoleId);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_GetUsersInRoleByRoleID", param);
        }

        /// <summary>
        /// Cập nhật quyền truy cập menu cho quyền
        /// </summary>
        /// <param name="model"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object UpdateRoleInMenu(RoleMenuUpdateModel model, string userName)
        {
            try
            {
                string _lstMenu = string.Empty;
                if (model.LstMenuID != null && model.LstMenuID.Count > 0)
                {
                    model.LstMenuID.ForEach(x =>
                    {
                        _lstMenu += !string.IsNullOrEmpty(_lstMenu) ? ("," + x) : x;
                    });

                }
                SqlParameter[] param = new SqlParameter[4];
                param[0] = new SqlParameter("@RoleID", model.RoleID);
                param[1] = new SqlParameter("@MenuParentID", model.MenuParentID);
                param[2] = new SqlParameter("@LstMenuID", _lstMenu);
                param[3] = new SqlParameter("@userName", userName);
                SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_UpdateRoleInMenu", param);
                return MP_AjaxError.OK;
            }
            catch (System.Exception ex)
            {
                return ex;
            }
        }

        /// <summary>
        /// Bặt tắt quyền
        /// </summary>
        /// <param name="roleID"></param>
        /// <param name="check"></param>
        /// <returns></returns>
        public object ApprovedRole(string roleID, bool check, string userName)
        {
            try
            {
                AspNetRoles aspNetRole = dbContext.AspNetRoles.Where(x => x.Id == roleID && !x.IsDeleted).FirstOrDefault();
                if (aspNetRole != null)
                {
                    aspNetRole.IsEnable = check;
                    aspNetRole.UpdatedBy = userName;
                    aspNetRole.UpdatedDate = DateTime.Now;
                    dbContext.SaveChanges();
                }
                return MP_AjaxError.OK;

            }
            catch (System.Exception ex)
            {
                return ex;
            }
        }

        /// <summary>
        /// Thêm mới quyền
        /// </summary>
        /// <param name="roleName"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object AddCompanyRole(string roleName, string idCompany, string userName)
        {
            try
            {
                AspNetRoles aspNetRole = dbContext.AspNetRoles.Where(x => x.Name == roleName && !x.IsDeleted).FirstOrDefault();
                if (aspNetRole != null) return MP_AjaxError.Exits;

                dbContext.AspNetRoles.Add(new AspNetRoles()
                {
                    CreatedBy = userName,
                    CreatedDate = DateTime.Now,
                    Id = Guid.NewGuid().ToString(),
                    IsDeleted = false,
                    IsEnable = true,
                    Name = roleName,
                    RoleLevel = 0
                });
                dbContext.SaveChanges();
                return MP_AjaxError.OK;
            }
            catch (Exception ex)
            {
                return ex;
            }
        }

        /// <summary>
        /// Cập nhật tên quyền công ty
        /// </summary>
        /// <param name="roleName"></param>
        /// <param name="roleId"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public string EditRoleName(string roleName, string roleId, string userName)
        {
            try
            {
                AspNetRoles aspNetRole = dbContext.AspNetRoles.Where(x => x.Id == roleId && !x.IsDeleted).FirstOrDefault();
                if (aspNetRole == null) return MP_AjaxError.NotFound;
                if (dbContext.AspNetRoles.Any(x => x.Id != roleId && !x.IsDeleted && x.Name == roleName))
                    return MP_AjaxError.Exits;

                aspNetRole.Name = roleName;
                aspNetRole.UpdatedBy = userName;
                aspNetRole.UpdatedDate = DateTime.Now;
                dbContext.SaveChanges();
                return MP_AjaxError.OK;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="roleName"></param>
        /// <param name="roleId"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public string EditSysRoleName(string roleName, string roleId, string userName)
        {
            try
            {
                AspNetRoles aspNetRole = dbContext.AspNetRoles.Where(x => x.Id == roleId && !x.IsDeleted).FirstOrDefault();
                if (aspNetRole == null) return MP_AjaxError.NotFound;
                if (dbContext.AspNetRoles.Any(x => x.Id != roleId && !x.IsDeleted && x.Name == roleName))
                    return MP_AjaxError.Exits;

                aspNetRole.Name = roleName;
                aspNetRole.UpdatedBy = userName;
                aspNetRole.UpdatedDate = DateTime.Now;
                dbContext.SaveChanges();
                return MP_AjaxError.OK;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Thêm mới quyền hệ thống
        /// </summary>
        /// <param name="roleName"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        public object AddSysRole(string roleName, string userName)
        {
            try
            {
                AspNetRoles aspNetRole = dbContext.AspNetRoles.Where(x => x.Name == roleName && !x.IsDeleted).FirstOrDefault();
                if (aspNetRole != null) return MP_AjaxError.Exits;

                dbContext.AspNetRoles.Add(new AspNetRoles()
                {
                    CreatedBy = userName,
                    CreatedDate = DateTime.Now,
                    Id = Guid.NewGuid().ToString(),
                    IsDeleted = false,
                    IsEnable = true,
                    Name = roleName,
                    RoleLevel = 0
                });
                dbContext.SaveChanges();
                return MP_AjaxError.OK;
            }
            catch (Exception ex)
            {
                return ex;
            }
        }

        /// <summary>
        /// Kiểm tra là quyền Admin theo Username
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public bool CheckIsAdminByUsername(string userName)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserName", userName);
            DataTable dt = SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_CheckIsAdminByUsername", param);
            if (dt != null && dt.Rows.Count > 0) return true;
            else return false;
        }

        /// <summary>
        /// Lấy danh sách tên quyền theo userid
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        public List<string> GetAllRoleNameByUserId(string userID)
        {
            return dbContext.Database.SqlQuery<string>(
                    "[dbo].[MNG_GetAllRolesByUserId] @UserId",
                    new SqlParameter("UserId", userID)).ToList();
        }
    }
}