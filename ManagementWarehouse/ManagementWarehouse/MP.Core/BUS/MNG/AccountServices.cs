using CRM_Finance.Models.EFModel;
using System;

namespace CRM_Finance.MP.Core.BUS.MNG
{
    public class AccountServices
    {
        /// <summary>
        /// Tạo mới lịch sử login/logout
        /// </summary>
        /// <param name="login"></param>
        public void CreateLoginHistory(MNG_HistoryLogin login)
        {
            ManagementWarehouseEntities dbContext = new ManagementWarehouseEntities();
            dbContext.MNG_HistoryLogin.Add(new MNG_HistoryLogin()
            {
                DateLogin = DateTime.Now,
                FullName = login.FullName,
                ID = Guid.NewGuid(),
                IP = login.IP,
                Status = login.Status,
                UserName = login.UserName
            });
            dbContext.SaveChanges();
        }
    }
}