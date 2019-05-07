using CRM_Finance.Library.Helper;
using CRM_Finance.Models.EFModel;
using ExcelDataReader;
using Library.Helper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;

namespace CRM_Finance.MP.Core.BUS.MNG
{
    public class UserServices
    {
        ManagementWarehouseEntities dbContext = null;

        public UserServices()
        {
            dbContext = new ManagementWarehouseEntities();
        }
        /// <summary>
        /// Thêm mới User
        /// </summary>
        /// <returns></returns>
        public object AddUsers(AspNetUsers User, string userLogin)
        {
            if (!checkExitUserName(User.UserName, User.Id)) return new { status = MP_AjaxError.Exits };

            var userStore = new UserStore<IdentityUser>();
            var manager = new UserManager<IdentityUser>(userStore);
            var user = new IdentityUser() { UserName = User.UserName, Email = User.Email };
            IdentityResult result = manager.Create(user, User.PasswordHash);
            if (result.Succeeded)
            {
                AspNetUsers aspUser = dbContext.AspNetUsers.Where(x => x.UserName == User.UserName).FirstOrDefault<AspNetUsers>();
                if (aspUser != null)
                {
                    if (string.IsNullOrEmpty(User.CC_Host)) User.CC_Host = string.Empty;
                    if (string.IsNullOrEmpty(User.CC_Pass)) User.CC_Pass = string.Empty;
                    if (string.IsNullOrEmpty(User.CC_Queue)) User.CC_Queue = string.Empty;
                    if (string.IsNullOrEmpty(User.AgentNumber)) User.AgentNumber = string.Empty;
                    if (string.IsNullOrEmpty(User.CC_Agent)) User.CC_Agent = string.Empty;
                    if (string.IsNullOrEmpty(User.Email)) User.Email = string.Empty;
                    SqlParameter[] param = new SqlParameter[12];
                    param[0] = new SqlParameter("@UserName", User.UserName);
                    param[1] = new SqlParameter("@Email", User.Email);
                    param[2] = new SqlParameter("@FullName", User.FullName);
                    param[3] = new SqlParameter("@CC_Host", User.CC_Host);
                    param[4] = new SqlParameter("@CC_Pass", User.CC_Pass);
                    param[5] = new SqlParameter("@CC_Queue", User.CC_Queue);
                    param[6] = new SqlParameter("@CC_Trunk", User.CC_Trunk);
                    param[7] = new SqlParameter("@CC_Agent", User.CC_Agent);
                    param[8] = new SqlParameter("@AgentNumber", User.AgentNumber);
                    param[9] = new SqlParameter("@AgentLogin", userLogin);
                    param[10] = new SqlParameter("@UserId", aspUser.Id);
                    param[11] = new SqlParameter("@Type", "Add");
                    SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_UpdateUser", param);
                }
            }
            return new { status = MP_AjaxError.OK };

        }
        /// <summary>
        /// Lấy tất cả user
        /// </summary>
        /// <returns></returns>
        public DataTable GetListUser(AspNetUsers User, string userLogin)
        {
            if (string.IsNullOrEmpty(User.UserName)) User.UserName = string.Empty;
            if (string.IsNullOrEmpty(User.Email)) User.Email = string.Empty;
            if (string.IsNullOrEmpty(User.AgentNumber)) User.AgentNumber = string.Empty;
            if (string.IsNullOrEmpty(User.CC_Host)) User.CC_Host = string.Empty;
            if (string.IsNullOrEmpty(User.CC_Queue)) User.CC_Queue = string.Empty; ;
            if (string.IsNullOrEmpty(User.CC_Trunk)) User.CC_Trunk = string.Empty;
            if (string.IsNullOrEmpty(User.CC_Agent)) User.CC_Agent = string.Empty;
            if (string.IsNullOrEmpty(User.CC_Pass)) User.CC_Pass = string.Empty;
            if (string.IsNullOrEmpty(User.FullName)) User.FullName = string.Empty;
            SqlParameter[] param = new SqlParameter[9];
            param[0] = new SqlParameter("@UserName", User.UserName);
            param[1] = new SqlParameter("@Email", User.Email);
            param[2] = new SqlParameter("@AgentNumber", User.AgentNumber);
            param[3] = new SqlParameter("@CC_Host", User.CC_Host);
            param[4] = new SqlParameter("@CC_Queue", User.CC_Queue);
            param[5] = new SqlParameter("@CC_Trunk", User.CC_Trunk);
            param[6] = new SqlParameter("@CC_Agent", User.CC_Agent);
            param[7] = new SqlParameter("@CC_Pass", User.CC_Pass);
            param[8] = new SqlParameter("@FullName", User.FullName);
            DataTable dt = SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "[dbo].[MNG_GetListUser]", param);
            return dt;
        }
        /// <summary>
        /// Cập nhật user
        /// </summary>
        /// <returns></returns>
        public object UpdateUser(AspNetUsers User, string userLogin)
        {
            if (string.IsNullOrEmpty(userLogin)) return new { status = MP_AjaxError.ErrLogin };
            AspNetUsers mngUser = dbContext.AspNetUsers.Where(x => x.Id == User.Id).First<AspNetUsers>();
            if (mngUser != null && checkExitUserName(mngUser.UserName, mngUser.Id))
            {
                if (string.IsNullOrEmpty(User.Email)) User.Email = string.Empty;
                SqlParameter[] param = new SqlParameter[12];
                param[0] = new SqlParameter("@UserName", User.UserName);
                param[1] = new SqlParameter("@Email", User.Email);
                param[2] = new SqlParameter("@FullName", User.FullName);
                param[9] = new SqlParameter("@AgentLogin", userLogin);
                param[10] = new SqlParameter("@UserId", User.Id);
                param[11] = new SqlParameter("@Type", "Update");
                SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_UpdateUser", param);
                return new { status = MP_AjaxError.OK };
            }
            else return new { status = MP_AjaxError.Exits };


        }
        /// <summary>
        /// Lấy xóa user
        /// </summary>
        /// <returns></returns>
        public object DeleteUser(string userId)
        {
            AspNetUsers lst = dbContext.AspNetUsers.Where(x => x.Id == userId).First<AspNetUsers>();
            if (lst != null)
            {
                // lst.IsDeleted = true;
                dbContext.SaveChanges();
            }
            return new { status = MP_AjaxError.OK };
        }

        /// <summary>
        /// Cập nhật quyền đối với từng user
        /// </summary>
        /// <returns></returns>
        public object UpdateRoleByUser(string UserId, string RoleId)
        {
            SqlParameter[] param = new SqlParameter[2];
            param[0] = new SqlParameter("@UserId", UserId);
            param[1] = new SqlParameter("@RoleId", RoleId);
            SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_UpdateRoleByUser", param);
            return new { status = MP_AjaxError.OK };
        }
        /// <summary>
        /// Xóa tất  cả quyền theo user
        /// </summary>
        /// <returns></returns>
        public object DeleteRoleByUser(string UserId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserId", UserId);
            SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_DeleteRoleByUser", param);
            return new { status = MP_AjaxError.OK };
        }
        /// <summary>
        /// Lấy danh sách quyền theo user
        /// </summary>
        /// <returns></returns>
        public DataTable GetRoleByUser(string UserId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserId", UserId);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_GetRoleByUser", param);
        }
        /// <summary>
        /// Reset mật khẩu
        /// </summary>
        /// <returns></returns>
        public object ResetPass(string userId)
        {
            var userStore = new UserStore<IdentityUser>();
            var manager = new UserManager<IdentityUser>(userStore);

            var removePassword = manager.RemovePassword(userId);
            if (removePassword.Succeeded)
            {
                //Removed Password Success
                var AddPassword = manager.AddPassword(userId, System.Configuration.ConfigurationManager.AppSettings["PassDefault"]);
            }
            return new { status = MP_AjaxError.OK, value = System.Configuration.ConfigurationManager.AppSettings["PassDefault"] };
        }
        /// <summary>
        /// chỉnh sửa user
        /// </summary>
        /// <returns></returns>
        public object EditUser(string data, string userId, string type, string userLogin)
        {
            SqlParameter[] param = new SqlParameter[4];
            param[0] = new SqlParameter("@UserId", userId);
            param[1] = new SqlParameter("@Type", type);
            param[2] = new SqlParameter("@UserLogin", userLogin);
            param[3] = new SqlParameter("@Data", data);
            SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_EditUser", param);
            return new { status = MP_AjaxError.OK };
        }
        /// <summary>
        /// Lấy thông tin user theo Id
        /// </summary>
        /// <returns></returns>
        public DataTable GetUserById(string UserId)
        {
            SqlParameter[] param = new SqlParameter[1];
            param[0] = new SqlParameter("@UserId", UserId);
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_GetUserById", param);
        }
        /// <summary>
        /// Kiểm tra tên đăng nhập có tồn tại không
        /// </summary>
        /// <returns></returns>
        public bool checkExitUserName(string userName, string userId)
        {
            List<AspNetUsers> lst = dbContext.AspNetUsers.Where(x => x.UserName == userName && x.Id != userId).ToList<AspNetUsers>();
            if (lst.Count == 0) return true;
            else return false;
        }
        /// <summary>
        /// Import User 
        /// </summary>
        /// <returns></returns>
        public object ReadImportData(DataTable tbl, string userLogin)
        {
            DateTime currentTime = DateTime.Now;
            int succ = 0, err = 0, up = 0;
            string mess = "";
            if (tbl.Rows.Count > 1)
            {
                for (int i = 1; i < tbl.Rows.Count; i++)
                {
                    try
                    {
                        var NameLogin = tbl.Rows[i][1].ToString().Trim();
                        var Pass = tbl.Rows[i][2].ToString().Trim();
                        var FullName = tbl.Rows[i][0].ToString().Trim();
                        if (!string.IsNullOrEmpty(tbl.Rows[i][0].ToString()) && !string.IsNullOrEmpty(tbl.Rows[i][1].ToString()) && !string.IsNullOrEmpty(tbl.Rows[i][2].ToString()) && checkExitUserName(NameLogin, ""))
                        {
                            if (!checkExitUserName(NameLogin, "")) return new { status = MP_AjaxError.Exits };
                            var userStore = new UserStore<IdentityUser>();
                            var manager = new UserManager<IdentityUser>(userStore);
                            var user = new IdentityUser() { UserName = NameLogin, Email = tbl.Rows[i][4].ToString() };
                            IdentityResult result = manager.Create(user, Pass);
                            if (result.Succeeded)
                            {
                                succ++;
                                AspNetUsers aspUser = dbContext.AspNetUsers.Where(x => x.UserName == NameLogin).FirstOrDefault<AspNetUsers>();
                                if (aspUser != null)
                                {
                                    SqlParameter[] param = new SqlParameter[12];
                                    param[0] = new SqlParameter("@UserName", NameLogin);
                                    param[1] = new SqlParameter("@Email", tbl.Rows[i][3].ToString());
                                    param[2] = new SqlParameter("@FullName", FullName);
                                    param[3] = new SqlParameter("@CC_Host", tbl.Rows[i][5].ToString());
                                    param[4] = new SqlParameter("@CC_Pass", tbl.Rows[i][9].ToString());
                                    param[5] = new SqlParameter("@CC_Queue", tbl.Rows[i][6].ToString());
                                    param[6] = new SqlParameter("@CC_Trunk", tbl.Rows[i][7].ToString());
                                    param[7] = new SqlParameter("@CC_Agent", tbl.Rows[i][8].ToString());
                                    param[8] = new SqlParameter("@AgentNumber", tbl.Rows[i][4].ToString());
                                    param[9] = new SqlParameter("@AgentLogin", userLogin);
                                    param[10] = new SqlParameter("@UserId", aspUser.Id);
                                    param[11] = new SqlParameter("@Type", "Add");
                                    SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "dbo.MNG_UpdateUser", param);
                                }
                            }
                        }
                        else err++;
                    }
                    catch (Exception ex)
                    {
                        err++;
                        mess += ex.Message.ToString() + " _dòng: " + i.ToString();
                    }
                }
            }
            else
            {
                return new { status = MP_AjaxError.NotFound };
            }
            return new { status = MP_AjaxError.OK, valueSucc = succ.ToString(), valueErr = err.ToString(), valueUp = up.ToString() };

        }
        /// <summary>
        /// Đọc file excel return datatable
        /// </summary>
        /// <returns></returns>
        public DataTable ExcelToDataTableUsingExcelDataReader(string storePath)
        {
            FileStream stream = File.Open(storePath, FileMode.Open, FileAccess.Read);

            string fileExtension = Path.GetExtension(storePath);
            IExcelDataReader excelReader = null;
            if (fileExtension == ".xls")
            {
                excelReader = ExcelReaderFactory.CreateBinaryReader(stream);
            }
            else if (fileExtension == ".xlsx")
            {
                excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
            }
            DataSet result = excelReader.AsDataSet();
            var test = result.Tables[0];
            DataTable dt = new DataTable();
            dt = result.Tables[0];
            return dt;
        }
    }
}