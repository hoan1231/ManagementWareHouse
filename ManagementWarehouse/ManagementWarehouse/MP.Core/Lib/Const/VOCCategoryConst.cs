namespace KTStore.Library.Const
{
    public static class VOCCategoryConst
    {
        public static string Cat_Sex = "gt";
        public static string Cat_VOCCustomerType = "lkh";
        public static string Cat_VOCCustomerType_Exits = "Lkh001";
        public static string Cat_VOCCustomerType_NoExits = "Lkh002";
        public static string Cat_VOCPriority = "vut";
        public static string Cat_VOCChanel = "ktn";
        public static string Cat_VOCChanel_FaceBook = "KTN004";
        public static string Cat_VOCFBForm = "vhtf";
        /// <summary>
        /// vpl
        /// </summary>
        public static string Cat_VOCType = "vpl";
        public static string Cat_VOCReceiveDepartment = "bptn";
        /// <summary>
        /// vlv
        /// </summary>
        public static string Cat_VOCFied = "vlv";
        public static string Cat_VOCFiedDetails = "vlvd";

        /// <summary>
        /// PbxlV: phòng ban xử lý VOC
        /// </summary>
        public static string Cat_VOCDepartment = "PbxlV";

        /// <summary>
        /// md
        /// </summary>
        public static string Cat_VOCLevel = "md";
        public static string Cat_VOCVote = "dgckh";
        public static string Cat_VOCDeadLineUnit = "unit";
        public static string Cat_VOCCustomerInTheBank = "Lkh001";
        public static string Cat_VOCEndCode = "vmkt";
        public static string Cat_VOCBranch = "vcn";

        public static string UnitDeadline_Day = "Unit-02";
        public static string UnitDeadline_Hour = "Unit-03";
        public static string UnitDeadline_Minute = "Unit-04";


        #region Trạng thái ticket
        /// <summary>
        /// Sự vụ quá hạn
        /// </summary>
        public static string OverDeadline = "TTSV-05";
        /// <summary>
        /// Lấy text: Sự vụ quá hạn
        /// </summary>
        public static string OverDeadlineStr = "Sự vụ quá hạn";
        /// <summary>
        /// Sự vụ đúng hạn
        /// </summary>
        public static string OnDeadline = "TTSV-09";
        /// <summary>
        /// Lấy text: Sự vụ đúng hạn
        /// </summary>
        public static string OnDeadlineStr = "Sự vụ đúng hạn";

        /// <summary>
        /// Trong phản ánh
        /// </summary>
        public static string OnReflect = "PA-01";
        /// <summary>
        /// Ngoài phản ánh
        /// </summary>
        public static string OutReflect = "PA-02";
        /// <summary>
        /// Chọn tất cả sự vụ quá hạn và đúng hạn
        /// </summary>
        public static string AllTicket = "TTSV-000";
        /// <summary>
        /// Chọn tất cả sự vụ theo trạng thái
        /// </summary>
        public static string AllTicketStatus = "TTSV-00";
        /// <summary>
        /// Tiếp nhận mới
        /// </summary>
        public static string TicketNew = "TTSV-01";
        /// <summary>
        /// String Tiếp nhận mới
        /// </summary>
        public static string TicketNewStr = "Tiếp nhận mới";
        /// <summary>
        /// Đang xử lý: TTSV-02
        /// </summary>
        public static string TicketHanding = "TTSV-02";
        /// <summary>
        /// String Đang xử lý
        /// </summary>
        public static string TicketHandingStr = "Đang xử lý";
        /// <summary>
        /// Sự vụ đã xử lý
        /// </summary>
        public static string TicketHandled = "TTSV-03";
        /// <summary>
        /// String Sự vụ đã xử lý
        /// </summary>
        public static string TicketHandledStr = "Đã xử lý";
        /// <summary>
        /// Sự vụ đang xác nhận khách hàng
        /// </summary>
        public static string TicketConfirming = "TTSV-04";
        /// <summary>
        /// String Sự vụ đang xác nhận khách hàng
        /// </summary>
        public static string TicketConfirmingStr = "Đang xác nhận khách hàng";
        /// <summary>
        /// Sự vụ đã xác nhận khách hàng: TTSV-06
        /// </summary>
        public static string TicketConfirmed = "TTSV-06";
        /// <summary>
        /// string Sự vụ hoàn thành
        /// </summary>
        public static string TicketConfirmedStr = "Hoàn thành";
        /// <summary>
        /// Sự vụ đã đóng
        /// </summary>
        public static string TicketClosed = "TTSV-08";
        /// <summary>
        /// String Sự vụ đã đóng
        /// </summary>
        public static string TicketClosedStr = "Sự vụ đã đóng";

        #endregion

        #region Trạng thái gửi sms và email
        /// <summary>
        /// Chưa gửi SMS hoặc Email: Tte -0000001
        /// </summary>
        public static string VOC_EmailStatus_NoSend = "Tte -0000001";
        /// <summary>
        /// Đã gửi SMS hoặc Email: Tte -0000002
        /// </summary>
        public static string VOC_EmailStatus_Send = "Tte -0000002";
        #endregion
    }
}