using KTStore.Models;
using Library.Helper;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace KTStore.MP.Core.BUS.MNG
{
    public class ForgotPasswordServices
    {
        /// <summary>
        /// Lưu lại token lấy mật khẩu
        /// </summary>
        /// <param name="token"></param>
        /// <param name="userID"></param>
        /// <returns></returns>
        public bool SaveTokenRecoveryPassword(string token, string userID)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[2];
                param[0] = new SqlParameter("@Token", token);
                param[1] = new SqlParameter("@UserID", userID);
                SqlHelper.ExecuteNonQuery(SqlHelper.ConnectionString, CommandType.StoredProcedure, "MNG_SaveTokenRecoveryPassword", param);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }


        /// <summary>
        /// Hàm gửi email OTP lấy lại mật khẩu
        /// </summary>
        /// <param name="user"></param>
        /// <param name="content"></param>
        public void SendMailOTPForgotPassword(ApplicationUser user, string content)
        {
            #region Gửi email
            MailAddress from = new MailAddress("ithcm_support@mptelecom.com.vn", "OTC MANAGEMENT");
            MailAddress to = new MailAddress(user.Email, user.FullName);

            MailMessage mail = new MailMessage(from, to);

            SmtpClient client = new SmtpClient();
            client.Port = 587;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Host = "mail.mptelecom.com.vn";

            NetworkCredential Authentication = new NetworkCredential();
            client.UseDefaultCredentials = false;
            Authentication.UserName = "ithcm_support@mptelecom.com.vn";//email
            Authentication.Password = "*kt1234#";//pass
            client.Credentials = Authentication;
            client.EnableSsl = true;//set ssl = true
            client.Timeout = 50000;
            mail.BodyEncoding = Encoding.UTF8;
            mail.IsBodyHtml = true;
            mail.Subject = "[MP-OTC] Lấy lại mật khẩu.";
            mail.Body = content;
            client.Send(mail);
            #endregion
        }

        /// <summary>
        /// Xóa token trong bảng user
        /// </summary>
        /// <param name="userID"></param>
        public void ClearTokenRecoveryPassword(string userID, string userName, string token, int isUsed)
        {
            try
            {
                SqlParameter[] param = new SqlParameter[4];
                param[0] = new SqlParameter("@UserID", userID);
                param[1] = new SqlParameter("@UserName", userID);
                param[2] = new SqlParameter("@Token", token);
                param[3] = new SqlParameter("@IsUsed", isUsed);
                SqlHelper.ExecuteNonQuery(SqlHelper.ConnectionString, CommandType.StoredProcedure, "MNG_ClearTokenRecoveryPassword", param);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
    }
}