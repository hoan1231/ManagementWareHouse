using KTStore.Models.EFModel;
using System.Collections.Generic;

namespace KTStore.MP.Core.ModelExt.MNG
{
    public class RoleMenuUpdateModel
    {
        public string RoleID { get; set; }
        public string MenuParentID { get; set; }
        public List<string> LstMenuID { get; set; }
    }
}