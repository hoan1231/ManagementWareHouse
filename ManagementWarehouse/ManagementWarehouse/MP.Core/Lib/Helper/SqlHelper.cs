using Library.Lib;
using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Library.Helper
{
    public abstract class SqlHelper
    {
        public static string ConnectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();

        private static Hashtable parmCache;

        static SqlHelper()
        {
            ConnectionString = string.Empty;
            parmCache = Hashtable.Synchronized(new Hashtable());
            try
            {
                if (ConfigurationManager.ConnectionStrings["DefaultConnection"] != null)
                {
                    ConnectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
                }
            }
            catch
            {
            }
        }

        public static int ExecuteNonQuery(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            int result = 0;
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    SqlCommand sqlCommand = new SqlCommand();
                    PrepareCommand(sqlCommand, sqlConnection, null, cmdType, cmdText, commandParameters);
                    result = sqlCommand.ExecuteNonQuery();
                    sqlCommand.Parameters.Clear();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    sqlConnection.Close();
                    sqlConnection.Dispose();
                }
            }
            return result;
        }

        public static int ExecuteNonQuery(string connectionString, CommandType cmdType, string cmdText, int TimeOut, params SqlParameter[] commandParameters)
        {
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            int result = 0;
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    SqlCommand sqlCommand = new SqlCommand();
                    PrepareCommand(sqlCommand, sqlConnection, null, cmdType, cmdText, commandParameters);
                    sqlCommand.CommandTimeout = TimeOut;
                    result = sqlCommand.ExecuteNonQuery();
                    sqlCommand.Parameters.Clear();
                }
                catch (Exception ex)
                {

                    throw ex;
                }
                finally
                {
                    sqlConnection.Close();
                    sqlConnection.Dispose();
                }
            }
            return result;
        }

        public static int ExecuteNonQuery(string connectionString, CommandType cmdType, string cmdText)
        {
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            return ExecuteNonQuery(connectionString, cmdType, cmdText, (SqlParameter[])null);
        }

        public static SqlDataReader ExecuteReader(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            SqlCommand sqlCommand = new SqlCommand();
            SqlConnection sqlConnection = new SqlConnection(connectionString);
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            try
            {
                PrepareCommand(sqlCommand, sqlConnection, null, cmdType, cmdText, commandParameters);
                SqlDataReader result = sqlCommand.ExecuteReader(CommandBehavior.CloseConnection);
                sqlCommand.Parameters.Clear();
                return result;
            }
            catch (Exception ex)
            {

                throw ex;
            }
            finally
            {
                sqlConnection.Close();
                sqlConnection.Dispose();
            }
        }

        public static DataTable ExecuteDataTable(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            DataTable dataTable = new DataTable();
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    SqlCommand sqlCommand = new SqlCommand();
                    PrepareCommand(sqlCommand, sqlConnection, null, cmdType, cmdText, commandParameters);
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                    sqlDataAdapter.Fill(dataTable);
                    sqlDataAdapter.Dispose();
                    sqlCommand.Parameters.Clear();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    sqlConnection.Close();
                    sqlConnection.Dispose();
                }

            }
            return dataTable;
        }

        public static DataTable ExecuteDataTable(string connectionString, CommandType cmdType, string cmdText, int timeOut, params SqlParameter[] commandParameters)
        {
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            DataTable dataTable = new DataTable();
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    SqlCommand sqlCommand = new SqlCommand();
                    sqlCommand.CommandTimeout = timeOut;
                    PrepareCommand(sqlCommand, sqlConnection, null, cmdType, cmdText, commandParameters);
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                    sqlDataAdapter.Fill(dataTable);
                    sqlDataAdapter.Dispose();
                    sqlCommand.Parameters.Clear();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    sqlConnection.Close();
                    sqlConnection.Dispose();
                }
            }
            return dataTable;
        }

        public static DataTable ExecuteDataTable(string connectionString, CommandType cmdType, string cmdText)
        {
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            return ExecuteDataTable(connectionString, cmdType, cmdText, (SqlParameter[])null);
        }

        public static DataTable ExecuteDataTable(string connectionString, Hashtable commandParameters, CommandType cmdType, string cmdText)
        {
            DataTable dataTable = new DataTable();
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    SqlCommand sqlCommand = new SqlCommand();
                    PrepareCommand(sqlCommand, sqlConnection, null, cmdType, cmdText, commandParameters);
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                    sqlDataAdapter.Fill(dataTable);
                    sqlDataAdapter.Dispose();
                    sqlCommand.Parameters.Clear();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    sqlConnection.Close();
                    sqlConnection.Dispose();
                }
            }
            return dataTable;
        }

        public static DataTable ExecuteDataTable(string connectionString, Hashtable commandParameters, CommandType cmdType, string cmdText, int timeOut)
        {
            DataTable dataTable = new DataTable();
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    SqlCommand sqlCommand = new SqlCommand();
                    sqlCommand.CommandTimeout = timeOut;
                    PrepareCommand(sqlCommand, sqlConnection, null, cmdType, cmdText, commandParameters);
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                    sqlDataAdapter.Fill(dataTable);
                    sqlDataAdapter.Dispose();
                    sqlCommand.Parameters.Clear();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    sqlConnection.Close();
                    sqlConnection.Dispose();
                }
            }
            return dataTable;
        }

        public static DataSet ExecuteDataSet(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            DataSet dataSet = new DataSet();
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    SqlCommand sqlCommand = new SqlCommand();
                    PrepareCommand(sqlCommand, sqlConnection, null, cmdType, cmdText, commandParameters);
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                    sqlDataAdapter.Fill(dataSet);
                    sqlDataAdapter.Dispose();
                    sqlCommand.Parameters.Clear();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    sqlConnection.Close();
                    sqlConnection.Dispose();
                }
            }
            return dataSet;
        }

        public static DataSet ExecuteDataSet(string connectionString, Hashtable commandParameters, CommandType cmdType, string cmdText)
        {
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            DataSet dataSet = new DataSet();
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                try
                {
                    SqlParameter value = new SqlParameter("@name", "aaa'dd'");
                    SqlCommand sqlCommand = new SqlCommand();
                    sqlCommand.CommandText = "SELECT * FROM test where columnName=@name";
                    sqlCommand.Parameters.Add(value);
                    PrepareCommand(sqlCommand, sqlConnection, null, cmdType, cmdText, commandParameters);
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter(sqlCommand);
                    sqlDataAdapter.Fill(dataSet);
                    sqlDataAdapter.Dispose();
                    sqlCommand.Parameters.Clear();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    sqlConnection.Close();
                    sqlConnection.Dispose();
                }
            }
            return dataSet;
        }

        public static DataSet ExecuteDataSet(string connectionString, CommandType cmdType, string cmdText)
        {
            Logger.CreateInstant("SQLHelper").Debug(cmdText);
            return ExecuteDataSet(connectionString, cmdType, cmdText, (SqlParameter[])null);
        }

        public static object ExecuteScalar(string connectionString, CommandType cmdType, string cmdText, params SqlParameter[] commandParameters)
        {
            object result;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                try
                {
                    Logger.CreateInstant("SQLHelper").Debug(cmdText);
                    SqlCommand sqlCommand = new SqlCommand();
                    PrepareCommand(sqlCommand, conn, null, cmdType, cmdText, commandParameters);
                    result = sqlCommand.ExecuteScalar();
                    sqlCommand.Parameters.Clear();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    conn.Close();
                }

            }
            return result;
        }

        public static void CacheParameters(string cacheKey, params SqlParameter[] commandParameters)
        {
            parmCache[cacheKey] = commandParameters;
        }

        public static SqlParameter[] GetCachedParameters(string cacheKey)
        {
            SqlParameter[] array = (SqlParameter[])parmCache[cacheKey];
            if (array == null)
            {
                return null;
            }
            SqlParameter[] array2 = new SqlParameter[array.Length];
            int i = 0;
            for (int num = array.Length; i < num; i++)
            {
                array2[i] = (SqlParameter)((ICloneable)array[i]).Clone();
            }
            return array2;
        }

        public static void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, SqlParameter[] cmdParms)
        {
            if (conn.State != ConnectionState.Open)
            {
                conn.Open();
            }
            cmd.Connection = conn;
            cmd.CommandText = cmdText;
            if (trans != null)
            {
                cmd.Transaction = trans;
            }
            cmd.CommandType = cmdType;
            if (cmdParms != null)
            {
                foreach (SqlParameter value in cmdParms)
                {
                    cmd.Parameters.Add(value);
                }
            }
        }

        public static void PrepareCommand(SqlCommand cmd, SqlConnection conn, SqlTransaction trans, CommandType cmdType, string cmdText, Hashtable cmdParms)
        {
            if (conn.State != ConnectionState.Open)
            {
                conn.Open();
            }
            cmd.Connection = conn;
            cmd.CommandText = cmdText;
            if (trans != null)
            {
                cmd.Transaction = trans;
            }
            cmd.CommandType = cmdType;
            if (cmdParms != null)
            {
                IDictionaryEnumerator enumerator = cmdParms.GetEnumerator();
                try
                {
                    while (enumerator.MoveNext())
                    {
                        DictionaryEntry dictionaryEntry = (DictionaryEntry)enumerator.Current;
                        SqlParameter value = new SqlParameter("@" + dictionaryEntry.Key, dictionaryEntry.Value);
                        cmd.Parameters.Add(value);
                    }
                }
                finally
                {
                    (enumerator as IDisposable)?.Dispose();
                }
            }
        }

        public static bool IsNumbericDataType(string dataType)
        {
            dataType = dataType.ToLower();
            switch (dataType)
            {
                case "int":
                case "float":
                case "bit":
                case "money":
                case "smallmoney":
                case "tinyint":
                case "smallint":
                case "bigint":
                case "decimal":
                case "numeric":
                case "real":
                    return true;
                default:
                    return false;
            }
        }

        public static bool IsUnicodeDataType(string dataType)
        {
            dataType = dataType.ToLower();
            switch (dataType)
            {
                case "nvarchar":
                case "nchar":
                case "ntext":
                    return true;
                default:
                    return false;
            }
        }

        public static bool RecordHasChanged(Guid ID, string tableName, string updatedDate)
        {
            Logger logger = new Logger("SQLHelper");
            if (updatedDate != "")
            {
                updatedDate = DateTime.Parse(updatedDate).ToString("yyyy-MM-dd HH:mm:ss");
            }
            Logger.CreateInstant("SQLHelper.CheckRecordHasChanged").Debug("Buffer update:" + updatedDate);
            string str = "SELECT convert(varchar(19),updatedDate,121) as UpdatedDate FROM " + tableName + " WHERE ID = '" + ID + "'";
            str = ((!string.IsNullOrEmpty(updatedDate)) ? (str + " AND  convert(varchar(19),updatedDate,121) = '" + updatedDate + "'") : (str + " AND  convert(varchar(19),updatedDate,121) IS NULL "));
            Logger.CreateInstant("SQLHelper.CheckRecordHasChanged").Debug("Kiem tra update:" + str);
            DataTable dataTable = ExecuteDataTable(ConnectionString, CommandType.Text, str);
            if (dataTable.Rows.Count == 0)
            {
                logger.Error("Record da bi thay doi duoi database");
                return true;
            }
            return false;
        }
    }
}