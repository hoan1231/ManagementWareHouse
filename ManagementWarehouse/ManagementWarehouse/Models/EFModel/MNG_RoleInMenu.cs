//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CRM_Finance.Models.EFModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class MNG_RoleInMenu
    {
        public System.Guid Id { get; set; }
        public System.Guid RoleId { get; set; }
        public string RoleName { get; set; }
        public System.Guid MenuId { get; set; }
        public bool IsShow { get; set; }
        public bool IsAdd { get; set; }
        public bool IsEdit { get; set; }
        public bool IsDelete { get; set; }
        public bool IsExport { get; set; }
        public bool IsPrint { get; set; }
        public bool IsEnable { get; set; }
        public bool IsDisable { get; set; }
        public bool IsAll { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public bool Status { get; set; }
    }
}
