using KTStore.MP.Core.BUS.MNG;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using OtpSharp;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KTStore.Models
{
    public class GoogleAuthenticatorTokenProvider : IUserTokenProvider<ApplicationUser, string>
    {
        public Task<string> GenerateAsync(string purpose, UserManager<ApplicationUser, string> manager, ApplicationUser user)
        {
            var otp = new Totp(KeyGeneration.GenerateRandomKey(20));
            return Task.FromResult<string>(otp.ComputeTotp());
        }

        public Task<bool> ValidateAsync(string purpose, string token, UserManager<ApplicationUser, string> manager, ApplicationUser user)
        {
            bool checkToken = user.PasswordResetToken == token;
            bool checkTime = user.PasswordResetTokenExpire >= DateTime.Now;
            if (!checkTime)
            {
                ForgotPasswordServices _forgotPasswordServices = new ForgotPasswordServices();
                _forgotPasswordServices.ClearTokenRecoveryPassword(user.Id, user.UserName, token, 0);
            }
            return Task.FromResult<bool>(checkToken && checkTime);
        }

        public Task NotifyAsync(string token, UserManager<ApplicationUser, string> manager, ApplicationUser user)
        {
            return Task.FromResult<int>(0);
        }

        public Task<bool> IsValidProviderForUserAsync(UserManager<ApplicationUser, string> manager, ApplicationUser user)
        {
            if (manager == null) throw new ArgumentNullException();
            else
            {
                return Task.FromResult<bool>(manager.SupportsUserPassword);
            }
        }
    }
    public class ApplicationRole : IdentityRole
    {
        public ApplicationRole() : base() { }
        public ApplicationRole(string name, string Note) : base(name)
        {
            this.Note = Note;
        }
        public virtual bool IsEnable { get; set; }
        public virtual int RoleLevel { get; set; }
        public virtual string Note { get; set; }
        public virtual DateTime CreatedDate { get; set; }
        public virtual string CreatedBy { get; set; }
        public virtual DateTime? UpdatedDate { get; set; }
        public virtual string UpdatedBy { get; set; }
        public virtual bool IsDeleted { get; set; }
    }

    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser, string> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

        public string Department { get; set; }
        public string FullName { get; set; }
        public string AgentNumber { get; set; }
        public string CC_Host { get; set; }
        public string CC_Queue { get; set; }
        public string CC_Trunk { get; set; }
        public string CC_Agent { get; set; }
        public string CC_Pass { get; set; }
        public string PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpire { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
    }

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string, IdentityUserLogin, IdentityUserRole, IdentityUserClaim>
    {
        public ApplicationDbContext()
        //: base("DefaultConnection", throwIfV1Schema: false)
        : base("DefaultConnection")
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}