using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.User;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;

namespace ParseAlphabet.ERP.Web.Modules.GN.User;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class UserApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly UserRepository _userRepository;

    public UserApiController(UserRepository userRepository, IHttpContextAccessor accessor)
    {
        _userRepository = userRepository;
        _accessor = accessor;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<UserGetPage>>> GetPage(NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _userRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<UserGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return await _userRepository.GetRecordById(keyvalue);
    }

    [HttpPost]
    [Route("getrecordbynationalcode")]
    public async Task<MyResultPage<UserGetRecord>> GetUserByNationalCode([FromBody] GetUserByNationalCode model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _userRepository.GetUserByNationalCode(model);
    }

    [HttpPost]
    [Route("getnationalcode")]
    public async Task<bool> GetUserByNationalCode([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _userRepository.CheckNationalCode(model);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] UserModel model)
    {
        var CompanyId = UserClaims.GetCompanyId();

        var result = await _userRepository.AlwoInsert(CompanyId);
        if (result.Successfull == false) return result;


        if (ModelState.IsValid)
        {
            model.PasswordSalt = Password.GetRandomSalt();
            model.PasswordHash = Password.GetHash(model.Password, model.PasswordSalt);
            model.Picture = Convertor.ImageBase64ToByte(model.Picture_base64);
            model.CompanyId = UserClaims.GetCompanyId();

            return await _userRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] UserModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.Picture = Convertor.ImageBase64ToByte(model.Picture_base64);
            return await _userRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        return await _userRepository.Delete(keyvalue);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _userRepository.Csv(model);
    }

    [HttpPost]
    [Route("changepassword")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> ChangePassword([FromBody] UserChangePassword model)
    {
        var resultQuery = new MyResultQuery();

        var salt = Password.GetRandomSalt();
        var hash = Password.GetHash(model.Password, salt);
        await _userRepository.ChangePassword(model.Id, hash, salt);
        resultQuery.StatusMessage = "success";
        return resultQuery;
    }

    [HttpPost]
    [Route("changepasswordprofile")]
    [AllowAnonymous]
    public async Task<MyResultQuery> ChangePasswordProfile([FromBody] UserChangePassword model)
    {
        var resultQuery = new MyResultQuery();

        model.Id = UserClaims.GetUserId();
        ;

        var salt = Password.GetRandomSalt();
        var hash = Password.GetHash(model.Password, salt);
        await _userRepository.ChangePassword(model.Id, hash, salt);
        resultQuery.StatusMessage = "success";
        return resultQuery;
    }


    [HttpGet]
    [Route("getdropdown/{isActive?}/{isSystem?}/{isRoleId?}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(byte? isActive = 2, bool isSystem = true,
        bool isRoleId = false)
    {
        byte roleId = 0;
        var companyId = UserClaims.GetCompanyId();
        if (isRoleId) roleId = UserClaims.GetRoleId();
        ;

        return await _userRepository.GetDropDown(companyId, roleId, isActive, isSystem);
    }

    [HttpPost]
    [Route("profile")]
    [AllowAnonymous]
    public async Task<Profile> GetProfile()
    {
        var userId = UserClaims.GetUserId();
        ;


        var userAgent = new UserAgent(Request.Headers["User-Agent"]);
        MyClaim.Init(_accessor);
        var ipAdrress = MyClaim.IpAddress;

        var profile = await _userRepository.GetProfile(userId);

        profile.Ip = ipAdrress;
        profile.Browser = userAgent.Browser.NameAndVersion;
        profile.OperatingSystem = userAgent.OS.NameAndVersion;

        return profile;
    }

    [HttpPost]
    [Route("useroffline")]
    [AllowAnonymous]
    public async Task<bool> ExistApplication()
    {
        var userId = UserClaims.GetUserId();
        ;
        var companyId = UserClaims.GetCompanyId();
        return await _userRepository.UserSetONOFF(false, userId, companyId);
    }

    [HttpPost]
    [Route("useronline")]
    [AllowAnonymous]
    public async Task<bool> LoginApplication()
    {
        var userId = UserClaims.GetUserId();
        ;
        var companyId = UserClaims.GetCompanyId();
        return await _userRepository.UserSetONOFF(true, userId, companyId);
    }

    [HttpPost]
    [Route("checkexistmobilenumber")]
    [AllowAnonymous]
    public async Task<bool> CheckExistMobileNumber([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _userRepository.CheckExistMobileNumber(model);
    }

    [HttpPost]
    [Route("checkexistemailaddress")]
    [AllowAnonymous]
    public async Task<bool> CheckExistEmailAddress([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _userRepository.CheckExistEmailAddress(model);
    }

    [HttpPost]
    [Route("checkexistusername")]
    [AllowAnonymous]
    public async Task<bool> CheckExistUsername([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _userRepository.CheckExistUserName(model);
    }
}

[Route("GN")]
[Authorize]
public class UserController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.User);
    }
}