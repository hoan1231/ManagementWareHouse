using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using KTStore.MP.Core.BUS.MNG;
using KTStore.MP.Core.Lib.Helper;
using KTStore.MP.Core.ModelExt.MNG;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace KTStore.Controllers.Manager
{
    [RoutePrefix("api/ForgotPassword")]
    public class ForgotPasswordController : ApiController
    {
        /// <summary>
        /// Quên mật khẩu
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [HttpGet]
        [Route("GetCode")]
        public async Task<HttpResponseMessage> GetCode(string UserName)
        {
            if (string.IsNullOrEmpty(UserName)) return Request.CreateResponse(HttpStatusCode.BadRequest);

            var UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = await UserManager.FindByNameAsync(UserName);

            if (user == null || string.IsNullOrEmpty(user.Email)) return Request.CreateResponse(HttpStatusCode.BadRequest, "NoEmail");
            if (!CRMHelper.IsValidEmail(user.Email)) return Request.CreateResponse(HttpStatusCode.BadRequest, "InvalidEmail");

            var code = await UserManager.GeneratePasswordResetTokenAsync(user.Id.ToString());
            if (string.IsNullOrEmpty(code)) return Request.CreateResponse(HttpStatusCode.Ambiguous, "NoCode");

            ForgotPasswordServices _forgotPasswordServices = new ForgotPasswordServices();
            if (!_forgotPasswordServices.SaveTokenRecoveryPassword(code, user.Id))
            {
                return Request.CreateResponse(HttpStatusCode.Ambiguous, "NoCode");
            }

            string content = "Please reset your password by code : <b>" + code + "</b>";
            _forgotPasswordServices.SendMailOTPForgotPassword(user, content);
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                responseValue =
                new ResetPasswordResponseModel()
                {
                    UserID = user.Id,
                    //Code = code,
                    //Email = user.Email,
                    ExpiresSeconds = (int)TimeSpan.FromMinutes(15).TotalSeconds
                }
            });
        }

        /// <summary>
        /// Rest mật khẩu
        /// </summary>
        /// <param name="userid"></param>
        /// <param name="code"></param>
        /// <returns></returns>
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [HttpGet]
        [Route("Recovery")]
        public async Task<HttpResponseMessage> Recovery(string UserID, string Code, string NewPassword)
        {
            if (string.IsNullOrEmpty(UserID) || string.IsNullOrEmpty(Code)) return Request.CreateResponse(HttpStatusCode.BadRequest);
            Guid _id = Guid.Empty;
            bool checkGuid = Guid.TryParse(UserID, out _id);
            if (!checkGuid) return Request.CreateResponse(HttpStatusCode.BadRequest);
            if (string.IsNullOrEmpty(NewPassword)) return Request.CreateResponse(HttpStatusCode.BadRequest);

            var UserManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            var user = await UserManager.FindByIdAsync(UserID);

            if (user == null) return Request.CreateResponse(HttpStatusCode.BadRequest, "NoUser");

            var result = await UserManager.ResetPasswordAsync(user.Id, Code, NewPassword);
            if (!result.Succeeded)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new { value = result.Errors });
            }
            ForgotPasswordServices _forgotPasswordServices = new ForgotPasswordServices();
            _forgotPasswordServices.ClearTokenRecoveryPassword(user.Id, user.UserName, Code, 1);
            return Request.CreateResponse(HttpStatusCode.OK);
        }




        IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}
