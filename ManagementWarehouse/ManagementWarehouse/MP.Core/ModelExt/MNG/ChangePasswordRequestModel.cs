namespace KTStore.MP.Core.ModelExt.MNG
{
    public class ChangePasswordRequestModel
    {
        private string _OldPass = string.Empty;
        private string _NewPass = string.Empty;
        private string _ReNewPass = string.Empty;

        public string OldPass { get => _OldPass; set => _OldPass = value; }
        public string NewPass { get => _NewPass; set => _NewPass = value; }
        public string ReNewPass { get => _ReNewPass; set => _ReNewPass = value; }
    }
}