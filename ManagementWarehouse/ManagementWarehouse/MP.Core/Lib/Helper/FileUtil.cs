using System.Collections.Generic;
using System.IO;

namespace KTStore.Library.Lib
{
    public class FileUtil
    {
        public static long TotalLinesOfFile(string fileName)
        {
            if (File.Exists(fileName))
            {
                return File.ReadAllLines(fileName).Length;
            }
            return 0L;
        }

        public static byte[] ReadByteArrayFromFile(string fileName)
        {
            byte[] array = null;
            FileStream fileStream = new FileStream(fileName, FileMode.Open, FileAccess.Read);
            BinaryReader binaryReader = new BinaryReader(fileStream);
            long length = new FileInfo(fileName).Length;
            array = binaryReader.ReadBytes((int)length);
            binaryReader.Close();
            fileStream.Close();
            return array;
        }

        public static List<string> GetAllDirectory(string dir)
        {
            List<string> list = new List<string>();
            GetAllDirectory(dir, list);
            return list;
        }

        protected static void GetAllDirectory(string dir, List<string> lstDir)
        {
            string[] directories = Directory.GetDirectories(dir);
            lstDir.Add(dir);
            for (int i = 0; i < directories.Length; i++)
            {
                GetAllDirectory(directories[i], lstDir);
            }
        }

        public static List<string> GetSubDirectory(string dir)
        {
            List<string> list = new List<string>();
            GetSubDirectory(dir, list);
            return list;
        }

        protected static void GetSubDirectory(string dir, List<string> lstDir)
        {
            string[] directories = Directory.GetDirectories(dir);
            if (directories.Length == 0)
            {
                lstDir.Add(dir);
            }
            else
            {
                for (int i = 0; i < directories.Length; i++)
                {
                    GetSubDirectory(directories[i], lstDir);
                }
            }
        }
    }
}