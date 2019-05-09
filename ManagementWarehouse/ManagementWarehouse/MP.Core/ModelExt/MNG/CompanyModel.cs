using KTStore.Library.Helper;
using System;

namespace KTStore.MP.Core.ModelExt.MNG
{
    public class CompanyModel
    {
        public System.Guid CompanyId { get; set; }
        public string NameCompany { get; set; }
        public Nullable<int> NumberAgent { get; set; }
        public Nullable<bool> Status { get; set; }
        public string Note { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CompanyCode { get; set; }
        public string CreatedDateStr
        {
            get => CreatedDate.HasValue ? CreatedDate.Value.ToString(MP_FormatHelper.Format103AndHourMinute) : string.Empty;
            set => CreatedDateStr = value;
        }
    }
}