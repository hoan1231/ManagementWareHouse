namespace KTStore.MP.Core.ModelExt.MNG
{
    public class UserInforResponseModel
    {
        private string _Fullname = string.Empty;
        private string _Email = string.Empty;
        private string _Phonenumber = string.Empty;
        private string _Roles = string.Empty;

        public string Fullname { get => _Fullname; set => _Fullname = value; }
        public string Email { get => _Email; set => _Email = value; }
        public string Phonenumber { get => _Phonenumber; set => _Phonenumber = value; }
        public string Roles { get => _Roles; set => _Roles = value; }
    }
}