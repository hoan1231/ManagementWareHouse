namespace KTStore.MP.Core.ModelExt.MNG
{
    public class ResetPasswordResponseModel
    {
        public string UserID { get; set; }
        public string Code { get; set; }
        public string Email { get; set; }
        public int ExpiresSeconds { get; set; }
    }
}