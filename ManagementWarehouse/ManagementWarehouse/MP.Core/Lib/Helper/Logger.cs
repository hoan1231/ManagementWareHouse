using log4net;
using log4net.Config;
using System;
using System.Collections;
using System.IO;
using System.Reflection;

namespace Library.Lib
{
    public class Logger
    {
        private readonly ILog logger;

        public static string userID = null;

        public static string clientIP = null;

        public static string station = "";

        protected string _userID = null;

        protected static string logLevel = "";

        public string userIP = null;

        public static int indent = 0;

        public static string defaultConfigPath = AppDomain.CurrentDomain.SetupInformation.ConfigurationFile;

        public static string currentConfigPath = AppDomain.CurrentDomain.SetupInformation.ConfigurationFile;

        public string UserID
        {
            get
            {
                return _userID;
            }
            set
            {
                _userID = value;
            }
        }

        public static Logger CreateInstant(string message)
        {
            return new Logger(message);
        }

        public Logger(string message)
            : this(message, currentConfigPath)
        {
        }

        public Logger(Type type)
            : this(type, defaultConfigPath)
        {
        }

        public Logger(string message, string str_configPath)
        {
            try
            {
                FileInfo configFile = new FileInfo(str_configPath);
                XmlConfigurator.Configure(configFile);
                logger = LogManager.GetLogger(message);
            }
            catch (Exception message2)
            {
                logger.Error(message2);
            }
        }

        public Logger(Type type, string str_configPath)
        {
            try
            {
                FileInfo configFile = new FileInfo(str_configPath);
                XmlConfigurator.Configure(configFile);
                logger = LogManager.GetLogger(type.ToString());
            }
            catch (Exception message)
            {
                logger.Error(message);
            }
        }

        public static void SetConfigPath(string _configPath)
        {
            currentConfigPath = _configPath;
        }

        public static void SetDefaultConfigPath()
        {
            SetConfigPath(defaultConfigPath);
        }

        public void Start(object obj)
        {
            if (logger != null)
            {
                logger.Info("[" + ((userIP != null) ? userIP : clientIP) + "][" + station + "][" +
                    ((UserID != null) ? UserID : userID) + "]" + Space(indent) + ">> Init " + obj + " >>");
                indent++;
            }
        }

        public void End(object obj)
        {
            if (logger != null)
            {
                indent--;
                logger.Info("[" + ((userIP != null) ? userIP : clientIP) + "][" + station + "][" +
                    ((UserID != null) ? UserID : userID) + "]" + Space(indent) + "<< End " + obj + " <<");
            }
        }

        private string Space(int indent)
        {
            string text = "";
            for (int i = 0; i < indent; i++)
            {
                text += "\t";
            }
            return text;
        }

        public void Info(object obj)
        {
            if (logger != null)
            {
                logger.Info("[" + ((userIP != null) ? userIP : clientIP) + "][" + station + "][" +
                    ((UserID != null) ? UserID : userID) + "] " + Space(indent) + obj);
            }
        }

        public void Param(string name, object value)
        {
            if (logger != null)
            {
                logger.Info("[" + ((userIP != null) ? userIP : clientIP) + "][" + station + "][" +
                    ((UserID != null) ? UserID : userID) + "] " + Space(indent) + name + "= " + value);
            }
        }

        public void Debug(object obj)
        {
            if (logger != null)
            {
                if (obj is Hashtable)
                {
                    LogHashTable(obj as Hashtable);
                }
                else
                {
                    logger.Debug("[" + ((userIP != null) ? userIP : clientIP) + "][" + station + "][" +
                        ((UserID != null) ? UserID : userID) + "] " + Space(indent) + obj);
                }
            }
        }

        public void Error(object obj)
        {
            if (logger != null)
            {
                Log(obj, "Error");
            }
        }

        public void Warning(object obj)
        {
            if (logger != null)
            {
                logger.Warn("[" + ((userIP != null) ? userIP : clientIP) + "][" + station + "][" +
                    ((UserID != null) ? UserID : userID) + "] Warning : " + Space(indent) + obj);
            }
        }

        public static void ResetIndent()
        {
            indent = 0;
        }

        private void LogHashTable(Hashtable parameter)
        {
            try
            {
                if (parameter == null)
                {
                    Debug("parameter null");
                }
                else
                {
                    IDictionaryEnumerator enumerator = parameter.GetEnumerator();
                    try
                    {
                        while (enumerator.MoveNext())
                        {
                            DictionaryEntry dictionaryEntry = (DictionaryEntry)enumerator.Current;
                            Param(dictionaryEntry.Key.ToString(), dictionaryEntry.Value.ToString());
                        }
                    }
                    finally
                    {
                        (enumerator as IDisposable)?.Dispose();
                    }
                }
            }
            catch (Exception)
            {
            }
        }

        public void LogObjectProperties(object obj)
        {
            PropertyInfo[] properties = obj.GetType().GetProperties();
            for (int i = 0; i < properties.Length; i++)
            {
                Param(properties[i].Name, properties[i].GetValue(obj, null));
            }
        }

        private void Log(object obj, string level)
        {
            if (obj is ArrayList)
            {
                ArrayList arrayList = (ArrayList)obj;
                for (int i = 0; i < arrayList.Count; i++)
                {
                    logger.Error("[" + ((userIP != null) ? userIP : clientIP) + "][" + station + "][" +
                        ((UserID != null) ? UserID : userID) + "] " + level + " : " + Space(indent) + arrayList[i].ToString());
                }
            }
            else
            {
                logger.Error("[" + ((userIP != null) ? userIP : clientIP) + "][" + station + "][" +
                    ((UserID != null) ? UserID : userID) + "] " + level + " : " + Space(indent) + obj.ToString());
            }
        }
    }
}