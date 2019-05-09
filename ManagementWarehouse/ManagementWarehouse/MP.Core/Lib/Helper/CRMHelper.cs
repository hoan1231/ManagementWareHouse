using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Reflection;
using System.Text;
using System.Web.Script.Serialization;

namespace KTStore.MP.Core.Lib.Helper
{
    public static class CRMHelper
    {
        /// <summary>
        /// Gets the 12:00:00 instance of a DateTime
        /// </summary>
        public static DateTime AbsoluteStart(this DateTime dateTime)
        {
            return dateTime.Date;
        }

        /// <summary>
        /// Gets the 11:59:59 instance of a DateTime
        /// </summary>
        public static DateTime AbsoluteEnd(this DateTime dateTime)
        {
            return AbsoluteStart(dateTime).AddDays(1).AddTicks(-1);
        }

        /// <summary>
        /// Convert list object to datatable
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="items"></param>
        /// <returns></returns>
        public static DataTable ToDataTable<T>(List<T> items)
        {
            try
            {
                DataTable dataTable = new DataTable(typeof(T).Name);
                //Get all the properties
                PropertyInfo[] Props = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                foreach (PropertyInfo prop in Props)
                {
                    //Setting column names as Property names
                    dataTable.Columns.Add(prop.Name);
                }
                foreach (T item in items)
                {
                    var values = new object[Props.Length];
                    for (int i = 0; i < Props.Length; i++)
                    {
                        //inserting property values to datatable rows
                        values[i] = Props[i].GetValue(item, null);
                    }
                    dataTable.Rows.Add(values);
                }
                //put a breakpoint here and check datatable
                return dataTable;
            }
            catch (OutOfMemoryException)
            {
                return new DataTable();
            }
        }

        /// <summary>
        /// Export to one sheet excel
        /// Trả về : 
        /// "err": lỗi
        /// đường dẫn: thành công
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public static string ExportDatatableToExcel(System.Data.DataTable dt, string fileName, string sheetName = "SheetBC")
        {
            try
            {
                string _fileName = "CP_" + fileName + "_" + DateTime.Now.ToString("yyyyMMddhhmmss") + ".xlsx";
                using (ClosedXML.Excel.XLWorkbook wb = new ClosedXML.Excel.XLWorkbook())
                {
                    wb.Worksheets.Add(dt.Copy(), sheetName);
                    wb.Style.Alignment.Horizontal = ClosedXML.Excel.XLAlignmentHorizontalValues.Center;
                    wb.Style.Font.Bold = true;

                    if (!Directory.Exists(System.Web.HttpContext.Current.Server.MapPath("/export/")))
                    {
                        Directory.CreateDirectory(System.Web.HttpContext.Current.Server.MapPath("/export/"));
                    }

                    string pathStr = System.Web.HttpContext.Current.Server.MapPath("/export/") + _fileName;
                    using (var outStream = new System.IO.MemoryStream())
                    {
                        using (var fileStream = new System.IO.FileStream(pathStr, System.IO.FileMode.CreateNew, System.IO.FileAccess.ReadWrite))
                        {
                            wb.SaveAs(fileStream, false);
                        }
                    }
                    return _fileName;
                }
            }
            catch (Exception)
            {
                return "err";
            }

        }

        /// <summary>
        /// Export to one sheet excel
        /// Trả về : 
        /// "err": lỗi
        /// đường dẫn: thành công
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        public static string ExportDatatableToExcelMultiSheet(DataSet ds)
        {
            try
            {
                string _fileName = "CP_Thông tin phản hồi_" + DateTime.Now.ToString("yyyyMMddhhmmss") + ".xlsx";
                using (ClosedXML.Excel.XLWorkbook wb = new ClosedXML.Excel.XLWorkbook())
                {
                    for (int i = 0; i < ds.Tables.Count; i++)
                    {
                        wb.Worksheets.Add(ds.Tables[i].Copy(), ds.Tables[i].TableName);
                    }
                    wb.Style.Alignment.Horizontal = ClosedXML.Excel.XLAlignmentHorizontalValues.Center;
                    wb.Style.Font.Bold = true;
                    string pathStr = System.Web.HttpContext.Current.Server.MapPath("/export/") + _fileName;
                    using (var outStream = new System.IO.MemoryStream())
                    {
                        using (var fileStream = new System.IO.FileStream(pathStr, System.IO.FileMode.CreateNew, System.IO.FileAccess.ReadWrite))
                        {
                            wb.SaveAs(fileStream, false);
                        }
                    }
                    return _fileName;
                }
            }
            catch (Exception)
            {
                return "err";
            }

        }

        /// <summary>
        /// Checksum
        /// </summary>
        /// <param name="dataToCalculate"></param>
        /// <returns></returns>
        public static string Checksum(this string dataToCalculate)
        {
            byte[] byteToCalculate = Encoding.ASCII.GetBytes(dataToCalculate);
            int checksum = 0;
            foreach (byte chData in byteToCalculate)
            {
                checksum += chData;
            }
            checksum &= 0xff;
            return checksum.ToString("X2");
        }

        /// <summary>
        /// Tạo chuỗi connectionstring
        /// </summary>
        /// <param name="dataBase"></param>
        /// <param name="user"></param>
        /// <param name="pw"></param>
        /// <returns></returns>
        public static string GenSQLConnectionString(string dataBase, string pw)
        {
            //Tạm thời lấy IP server mặc định là 36.112
            return "server=192.168.36.112;database=" + dataBase +
                ";uid=" + dataBase + ";pwd=" + pw + ";MultipleActiveResultSets=True;Integrated Security=False";
        }

        /// <summary>
        /// Xóa bỏ dấu tiếng Việt
        /// </summary>
        /// <param name="text"></param>
        /// <returns></returns>
        public static string RemoveUnicode(string text)
        {
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
    "đ",
    "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
    "í","ì","ỉ","ĩ","ị",
    "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
    "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
    "ý","ỳ","ỷ","ỹ","ỵ",};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
    "d",
    "e","e","e","e","e","e","e","e","e","e","e",
    "i","i","i","i","i",
    "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
    "u","u","u","u","u","u","u","u","u","u","u",
    "y","y","y","y","y",};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }
            return text;
        }


        public static string DataTableToJSONWithJavaScriptSerializer(DataTable table)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            return jsSerializer.Serialize(parentRow);
        }


        /// <summary>
        /// Kiểm tra định dạng email
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        public static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }

    /// <summary>
    /// Enum cho việc tạo Job theo loại cảnh báo VOC
    /// </summary>
    public enum CreateTriggerType
    {
        /// <summary>
        /// Thông tin bình thường không tạo cảnh báo
        /// </summary>
        Notification = 1,
        /// <summary>
        /// Quá hạn xử lý
        /// </summary>
        OnDeadline = 2,
        /// <summary>
        /// Sắp đến hạn xử lý
        /// </summary>
        CommingDeadline = 3
    }
}