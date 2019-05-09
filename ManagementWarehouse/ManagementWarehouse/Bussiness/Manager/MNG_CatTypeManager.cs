using KTStore.Models.EFModel;
using Library.Helper;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace KTStore.Bussiness.Manager
{
    public class MNG_CatTypeManager
    {
        KTStoreEntities dbContext = null;

        public MNG_CatTypeManager()
        {
            dbContext = new KTStoreEntities();
        }
        public DataTable GetCatTypeMenu()
        {
            DataTable tbl = new DataTable();
            string sql = @"SELECT CatTypeCode, CatTypeName, CatTypeGroup, CASE WHEN (CatTypeCode IN (SELECT CatTypeGroup FROM MNG_CatType)) 
                           THEN 1 ELSE 0 END AS HasChild FROM MNG_CatType WHERE isdeleted = 0 AND (CatTypeGroup = '' OR CatTypeGroup IS NULL)  
                           ORDER BY CatTypeName";
            return SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.Text, sql);
        }

        public List<MNG_CatType> GetChildCat(string parentCat)
        {
            return dbContext.MNG_CatType.Where(x => x.CatTypeGroup == parentCat && !x.IsDeleted).ToList();
        }

        //public bool checkCode(string code)
        //{
        //    SqlParameter[] param = new SqlParameter[1];
        //    param[0] = new SqlParameter("@code", code);
        //    DataTable dt = SqlHelper.ExecuteDataTable(SqlHelper.ConnectionString, CommandType.StoredProcedure, "checkCode", param);
        //    return dt.Rows.Count > 0;
        //}

        //public void updateCategory(CimsCatTypeEntity info)
        //{
        //    SqlParameter[] param = new SqlParameter[3];
        //    param[0] = new SqlParameter("@name", info.CatTypeName);
        //    param[1] = new SqlParameter("@code", info.CatTypeCode);
        //    param[2] = new SqlParameter("@group", info.CatTypeGroup);
        //    SqlHelper.ExecuteNonQuery(Config.ConnectionConfig.ConnectionString, CommandType.StoredProcedure, "updateCategory", param);
        //}
    }
}