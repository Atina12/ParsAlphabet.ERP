using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos._History;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCartable;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;
using ParsAlphabet.ERP.Application.Dtos.MC.Prescription;
using ParsAlphabet.ERP.Application.Dtos.NewDtos.AdmissionServiceRepositoryDto;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionClose;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionMaster;
using ParsAlphabet.ERP.Infrastructure.Implantation._History;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCash;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMaster;
using ParsAlphabet.WebService.Api.Model.CIS;
using System.Security.Claims;
using static ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CIS.WebServiceViewModel;

namespace ParseAlphabet.ERP.Web.Modules.MC.Admission;

[Route("api/MC/[controller]")]
      
[ApiController]
[Authorize]
public class AdmissionApiController(
    AdmissionServiceRepository admissionServiceRepository,
    IHttpContextAccessor accessor,
    IAdmissionCounterRepository admissionCounter,
    HistoryRepository history,
    IAdmissionCloseRepository admissionCloseRepository,
    AdmissionCashRepository admissionCashRepository,
    IAdmissionMasterRepository admissionMasterRepository,
    IAdmissionsRepository admissionRepository
) : ControllerBase
{
    // Web Service Start

    [HttpPost]
    [Route("callupinsurance")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataStatus<CallupInsurance_Result>> CallUpInsurance(
        [FromBody] GetCallUpInsurance callUpInsurance)
    {
        // var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        // var result = await keyA3.CallUpInsurance(callUpInsurance);
        var companyId = UserClaims.GetCompanyId();

        //if (result.Status == 100)
        //{
        //    if (result.Data.Insurances != null)
        //    {
        //        if (result.Data.Insurances.Length == 1)
        //        {
        //            result.Data.Insurances[0].InsuranceBoxId = (await _insurerRepository.GetInsurerIdByBoxId(result.Data.Insurances[0].InsuranceBoxId, companyId)).ToString();
        //        }
        //        else if (result.Data.Insurances.Length > 1)
        //        {
        //            for (int i = 0; i < result.Data.Insurances.Length; i++)
        //            {
        //                result.Data.Insurances[i].InsuranceBoxId = (await _insurerRepository.GetInsurerIdByBoxId(result.Data.Insurances[i].InsuranceBoxId, companyId)).ToString();
        //            }

        //        }
        //    }
        //}
        throw new Exception();
        //return result;
    }

    [HttpPost]
    [Route("getpersonbybirth")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataStatus<GetPatient_Result>> GetPersonByBirth([FromBody] GetPersonByBirth birth)
    {
        //if (!ModelState.IsValid)
        //{
        //    var res = new MyResultDataStatus<GetPatient_Result>()
        //    {
        //        Data = new GetPatient_Result()
        //    };

        //    res.Successfull = false;
        //    res.Status = -100;
        //    res.StatusMessage = "سال تولد و نمبر تذکره اجبار می باشد";
        //}
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var result = await keyA3.GetPersonByBirth(birth);

        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("gethid")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataStatus<GetHID_Result>> GetHID([FromBody] GetHIDOnline getHID)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var result = await keyA3.GetHID(getHID);

        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("gethidurgent")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataStatus<GetHID_Result>> GetHIDUrgent([FromBody] GetHIDUrgent getHID)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var result = await keyA3.GetHIDUrgent(getHID);

        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("eliminatehid")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataStatus<EliminateHID_Result>> EliminateHID([FromBody] EliminateHID model)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var result = await keyA3.EliminateHID(model);

        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("savepatientbill")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataStatus<SavePatientBill_Result>> SavePatientBill([FromBody] SavePatientBill model)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var result = await keyA3.SavePatientBill(model);

        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("verifyhid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataStatus<VerifyHID>> GetStatusHID([FromBody] int id)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);
        //var result = new MyResultDataStatus<VerifyHID>()
        //{
        //    Data = new VerifyHID()
        //};

        //var searchModel = new GetAdmissionSearch()
        //{
        //    AttenderId = 0,
        //    Id = id,
        //    PatientFullName = "",
        //    PatientNationalCode = "",
        //    CompanyId = int.Parse(User.FindFirstValue("CompanyId"))
        //};

        //var admission = await _admissionRepository.GetAdmission(searchModel);
        ////searchModel.CompanyId = UserClaims.GetCompanyId();

        //var hid = new HID
        //{
        //    Id = admission.AdmissionHID,
        //    AssignerCode = admission.BasicInsurerCode == "1" || admission.BasicInsurerCode == "2" ? admission.BasicInsurerCode : "3"
        //};

        //var person = new Person
        //{
        //    IsForeign = admission.PatientNationalityId.ToLower() != "ir",
        //    NationalCode = admission.PatientNationalCode
        //};

        //var resultVerify = new MyResultDataStatus<VerifyHIDStatus_Result>();
        //resultVerify = await keyA3.VerifyHIDStatus(hid, person);

        //result.Data.Id = id;
        //result.Data.HID = admission.AdmissionHID;

        //if (resultVerify.Data != null)
        //{
        //    result.Data.Status = resultVerify.Data.Status;
        //    result.Data.StatusId = resultVerify.Data.StatusId;
        //    result.Status = resultVerify.Status;
        //    result.StatusMessage = resultVerify.StatusMessage;
        //    result.Successfull = resultVerify.Successfull;
        //}
        //else
        //{
        //    result.Status = -100;
        //    result.StatusMessage = "پاسخ وب سرویس حاوی اطلاعات نمی باشد .";
        //    result.Successfull = false;
        //}

        //return result;
        throw new Exception();
    }

    // Web Service End

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        try
        {
            model.CompanyId = UserClaims.GetCompanyId();

            if (model.Form_KeyValue[0]?.ToString() == "myadm")
                model.Form_KeyValue[1] = User.FindFirstValue("UserId");

            var userId = UserClaims.GetUserId();
            var roleId = UserClaims.GetRoleId();
            var result = await admissionServiceRepository.GetPage(model, userId, roleId);
            return result;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }


    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.VIW, "")]
    public async Task<AdmissionDisplay> Display([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await admissionServiceRepository.AdmissionDisplay(id, CompanyId);
    }


    [Route("calculateadmissionPrice")]
    [HttpPost]
    [Authenticate(Operation.VIW, "")]
    public async Task<CalAdmissionPrice> CalAdmissionPrice([FromBody] GetCalAdmissionPrice model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await admissionServiceRepository.CalAdmissionPrice(model);
        return result;
    }

    [Route("insert")]
    [HttpPost]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataQuery<AdmissionResultQuery>> InsertAdmission([FromBody] AdmissionModel model)
    {
        if (ModelState.IsValid)
        {
            return await admissionRepository.InsertAdmission(model);
        }

        return ModelState.ToMyResultDataQuery<AdmissionResultQuery>();
    }

    [Route("insertadmissioncashline")]
    [HttpPost]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataQuery<MyResultStatus>> InsertAdmissionCashLine(
        [FromBody] AdmissionCashLineModel model)
    {
        if (ModelState.IsValid)
        {
            return await admissionRepository.InsertAdmissionCashLine(model);
        }

        return ModelState.ToMyResultDataQuery<MyResultStatus>();
    }


    [Route("getscheduleblockautoreserve")]
    [HttpPost]
    [Authenticate(Operation.VIW, "")]
    public async Task<GeneratedReserve> GetSchduleBlockAutoReserve(GetGeneratedReserve model)
    {
        var result = await admissionServiceRepository.GetSchduleBlockAutoReserve(model);
        return result;
    }


    [HttpPost]
    [Route("getattenderschedule")]
    [Authenticate(Operation.VIW, "")]
    public List<AttenderWeekSchedule> GetAttenderSchedule([FromBody] GetAttenderWeekSchedule model)
    {
        return admissionServiceRepository.GetAttenderSchedule(model);
    }


    [HttpPost]
    [Route("getattenderreservelist")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<ReserveItem>> GetAttenderReserveList([FromBody] GetReservedItem model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionServiceRepository.GetAttenderReserveList(model);
    }

    [HttpPost]
    [Route("admissionservicelinelist")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<AdmissionServiceLineGetList>> AdmissionServiceLineList([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await admissionServiceRepository.AdmissionServiceLineGetList(id, companyId);
    }


    [HttpGet]
    [Route("updatelastaction/{admissionMasterId}/{identityId}/{currentActionId}/{requestActionId}/{patientId}")]
    public async Task<MyResultStatus> UpdateLastAction(int admissionMasterId, int identityId, byte currentActionId,
        byte requestActionId, int patientId)
    {
        var releaseUserId = UserClaims.GetUserId();
        ;
        var releaseDateTime = DateTime.Now;

        return await admissionServiceRepository.UpdateLastAction(admissionMasterId, identityId, currentActionId,
            requestActionId, patientId, releaseUserId, releaseDateTime);
    }


    [HttpGet]
    [Route("updatescheduleblockrelease/{admissionId}")]
    [Authenticate(Operation.VIW, "Admission#AdmissionMaster")]
    public async Task<MyResultStatus> AttenderScheduleBlockRelease(int admissionId)
    {
        var userId = UserClaims.GetUserId();
        ;
        var releaseDateTime = DateTime.Now;
        return await admissionServiceRepository.AttenderScheduleBlockRelease(admissionId, userId, releaseDateTime);
    }

    [HttpPost]
    [Route("updatereferringdoctorinfo")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> UpdateReferringDoctorInfo([FromBody] UpdateReferringDoctorInfo model)
    {
        return await admissionServiceRepository.UpdateReferringDoctorInfo(model);
    }

    [HttpPost]
    [Route("getdiagnosis")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<AdmissionDiagnosisLineList>> GetAdmissionDiagnosis([FromBody] int id)
    {
        return await admissionServiceRepository.GetAdmissionDiagnosis(id);
    }

    [HttpPost]
    [Route("opencash")]
    public async Task<bool> CheckOpenCash([FromBody] int id)
    {
        MyClaim.Init(accessor);
        var companyId = UserClaims.GetCompanyId();
        short branchId = 0;

        var dateTime = DateTime.Now;

        if (id != 0)
        {
            dateTime = await admissionServiceRepository.GetCreateDate(id);
            branchId = await admissionServiceRepository.GetBranchId(id);
        }


        return await admissionCloseRepository.CheckExistOpenCash(dateTime.ToString("yyyy/MM/dd"), branchId, companyId);
    }


    [HttpPost]
    [Route("getadmissionamount")]
    public async Task<decimal> GetAdmissionAmount([FromBody] int id)
    {
        return await admissionServiceRepository.GetAdmissionAmount(id);
    }

    [HttpPost]
    [Route("search")]
    public async Task<AdmissionSearch> Search([FromBody] GetAdmissionSearch model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionServiceRepository.GetAdmission(model);
    }

    [HttpPost]
    [Route("searchinbound")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<SearchAdmission>>> SearchAdmission([FromBody] GetSearchAdmission model)
    {
        model.UserId = UserClaims.GetUserId();
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        return await admissionServiceRepository.SearchAdmissionInbound(model, roleId);
    }

    [HttpPost]
    [Route("chartadmission")]
     [Authenticate(Operation.VIW, "")]
    
    public async Task<DataChartAdmission> ChartAdmission(GetChartAdmission model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionServiceRepository.GetAdmissionChart(model);
    }

    [HttpGet]
    [Route("getdetailaccountbyadmissionmasterid/{id}/{fundTypeId}")]
    public async Task<List<MyDropDownViewModel>> GetDetailAccountByAdmissions(int id, byte fundTypeId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await admissionServiceRepository.GetDetailAccountByAdmissionId(id, fundTypeId, companyId);
    }

    [HttpPost]
    [Route("getlistadmissioninsurerthirdpartystatev1")]
    public async Task<object> GetAdmissionInsurerThirdPartyStateGetList_V1(
        [FromBody] GetAdmissionFilterByInsurerThirdPartyState model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionServiceRepository.GetAdmissionInsurerThirdPartyStateGetList_V1(model);
    }


    [Route("insertadmissionbycashline")]
    [HttpPost]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataQuery<AdmissionResultQuery>> InsertAdmissionByCashLine(
        AdmissionByAdmissionCashLine modelValue)
    {
        return await admissionRepository.InsertAdmissionByCashLine(modelValue, ModelState);
    }

    [HttpPost]
    [Route("getpateitnreservedlist")]
    public async Task<List<GetAdmissionReservedList>> GetAdmissionReservedList([FromBody] int patientId)
    {
        return await admissionServiceRepository.GetAdmissionReservedList(patientId);
    }

    [HttpPost]
    [Route("getaggregationprintadmission")]
    [AllowAnonymous]
    public async Task<List<AggregationPrintAdmission>> GetAggregationPrintAdmission([FromBody] int id)
    {
        return await admissionServiceRepository.GetAggregationPrintAdmission(id);
    }


    [HttpPost]
    [Route("getseparationprintadmission")]
    public async Task<List<PrintAdmission>> GetSeparationPrint([FromBody] int id)
    {
        return await admissionServiceRepository.GetSeparationPrintAdmission(id);
    }

    [HttpPost]
    [Route("getstandprintadmission")]
    public async Task<StandPrintAdmission> GetStandPrint([FromBody] string AdmissionMasterId)
    {
        return await admissionServiceRepository.GetStandPrintAdmission(AdmissionMasterId);
    }

    [HttpPost]
    [Route("patientreservedlist")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PatientReservedList>>> PatientReservedList([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionServiceRepository.GetPatientReservedList(model, roleId);
    }

    [HttpPost]
    [Route("patientMovelist")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PatientMovelist>>> PatientMovelist([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionServiceRepository.GetPatientMovelist(model);
    }

    [HttpPost]
    [Route("updatereservedatepatient")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> UpdateReserveDatePatient(PatientReservedDateModel model)
    {
        model.ReserveUserId = UserClaims.GetUserId();
        ;
        return await admissionServiceRepository.UpdateReserveDatePatient(model);
    }

    [HttpGet]
    [Route("getservicelistbyadmissionattender")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetServiceListByAdmissionAttender(int attenderId,
        string fromWorkDayDatePersian, string toWorkDayDatePersian)
    {
        var companyId = UserClaims.GetCompanyId();
        return await admissionServiceRepository.GetServiceListByAdmissionAttender(attenderId, fromWorkDayDatePersian,
            toWorkDayDatePersian, companyId);
    }


    [HttpPost]
    [Route("validationadmissionservice/{admissionMasterId}/{currentActionId}/{admissionCentralId}")]
    public async Task<List<string>> ValidationAdmissionService([FromBody] UpdateAction model,
        [FromRoute] int admissionMasterId, byte currentActionId, int admissionCentralId)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;

        var validationResult =
            await admissionServiceRepository.ValidationActionLogAdmissionService(model, roleId, admissionMasterId);

        if (validationResult.Count == 0 && admissionCentralId > 0)
            validationResult = await admissionServiceRepository.AdmissionServiceReturnCentral(admissionCentralId,
                model.IdentityId, currentActionId, model.RequestActionId);

        return validationResult;
    }

    [HttpGet]
    [Route("deleteadmissionservice/{admissionMasterId}/{id}/{branchId}")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> DeleteAdmissionService(int admissionMasterId, int id, short branchId)
    {
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        return await admissionServiceRepository.DeleteAdmissionService(admissionMasterId, id, branchId, roleId, userId);
    }

    [HttpPost]
    [Route("updatereservemovepatient")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> UpdateReserveMovePatient(PatientReservedMoveModel model)
    {
        model.ReserveUserId = UserClaims.GetUserId();
        ;
        return await admissionServiceRepository.UpdateReserveMovePatient(model);
    }

    [HttpPost]
    [Route("updatereserveshiftpatient")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> UpdateReserveShiftPatient(PatientReservedShiftModel model)
    {
        model.ReserveUserId = UserClaims.GetUserId();
        ;
        return await admissionServiceRepository.UpdateReserveShiftPatient(model);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.Admission.Index);
    }

    [Route("[controller]/form/{id?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Form(int? id)
    {
        return PartialView(Views.MC.Admission.Form);
    }

    [Route("[controller]/newform/{id?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult NewForm(int? id)
    {
        return PartialView(Views.MC.Admission.NewForm);
    }

    [Route("[controller]/display/{id}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.Admission.Display);
    }
}