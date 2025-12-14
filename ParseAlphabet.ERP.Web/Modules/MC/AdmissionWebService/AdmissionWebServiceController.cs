using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Interfaces.MC.Prescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionDiagnosis;
using ParsAlphabet.WebService.Api.Model.CIS;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionWebService;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionWebServiceApiController(
    IAdmissionWebServiceRepository admissionReimbursmentRepository
  )
    : ControllerBase
{
   

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionReimbursment>>> GetPage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionReimbursmentRepository.GetPage(model, 1);
    }

    [HttpPost]
    [Route("getpageReturns")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionReimbursment>>> GetPageReturns([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionReimbursmentRepository.GetPage(model, 2);
    }


    [HttpPost]
    [Route("getfilteritemsales")]
    public GetColumnsViewModel GetFilterParameterSales()
    {
        return admissionReimbursmentRepository.GetColumnSale();
    }

    [HttpPost]
    [Route("getfilteritemreturns")]
    public GetColumnsViewModel GetFilterParameterReturns()
    {
        return admissionReimbursmentRepository.GetColumnReturn();
    }

    [HttpPost]
    [Route("getupdatehid")]
    public async Task<MyResultDataQuery<List<Wcf_Result>>> GetUpdateHid([FromBody] List<int> admissionIds)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);
        //var result = new MyResultDataQuery<List<Wcf_Result>>();
        //result.Data = new List<Wcf_Result>();
        //var keyA3Binding = new BindingReimburesmentModel_WCF(_companyRepository, _setupRepository, _admissionDiagnosisRepository, _admissionRepository, _admissionReimbursmentRepository, _admissionsRepository, _prescriptionRepository);
        //var userId = UserClaims.GetUserId();;
        //var companyId = UserClaims.GetCompanyId();

        //foreach (var admissionId in admissionIds)
        //{
        //    var admissionBinded = await keyA3Binding.BindAdmissionHidUpdate(admissionId, companyId);
        //    var resultUpdateHid = await keyA3.UpdateHID(admissionBinded);
        //    await _admissionReimbursmentRepository.UpdateAdmissionServiceHidUpdate(admissionId, resultUpdateHid.Successfull, userId);

        //    if (!string.IsNullOrEmpty(resultUpdateHid.Data.ErrorMessage))
        //    {

        //        result.Data.Add(new Wcf_Result()
        //        {
        //            Id = admissionId,
        //            AdmissionHid = admissionBinded.Hid.AssignerCode,
        //            ErrorMessage = resultUpdateHid.Data.ErrorMessage
        //        });
        //        result.Successfull = resultUpdateHid.Successfull;
        //    }
        //}

        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("activeinsurerreimbursement")]
    public async Task<MyResultDataStatus<GetActiveInsurerReimbursement_Result>>
        GetActiveInsurerReimbursementHIDByNationalCode([FromBody] int id)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var searchModel = new GetAdmissionSearch()
        //{
        //    AttenderId = 0,
        //    Id = id,
        //    PatientFullName = "",
        //    PatientNationalCode = ""
        //};

        //searchModel.CompanyId = UserClaims.GetCompanyId();
        //var admission = await _admissionRepository.GetAdmission(searchModel);

        //var resultReimbursementList = await keyA3.GetActiveInsurerReimbursementHIDByNationalCode(admission.PatientNationalCode);

        //if (resultReimbursementList.Data != null && resultReimbursementList.Data.HIDList != null)
        //{
        //    var resultGrouped = resultReimbursementList.Data.HIDList.GroupBy(h => new { h.Id, h.Assigner })
        //                                                  .Select(i => i.FirstOrDefault()).ToArray();

        //    resultReimbursementList.Data.HIDList = resultGrouped;
        //}

        //return resultReimbursementList;
        throw new Exception();
    }

    [HttpPost]
    [Route("geteliminatehid")]
    public async Task<MyResultDataQuery<List<Wcf_Result>>> GetEliminateHid([FromBody] List<int> admissionIds)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);
        //var result = new MyResultDataQuery<List<Wcf_Result>>();
        //result.Data = new List<Wcf_Result>();
        //var keyA3Binding = new BindingReimburesmentModel_WCF(_companyRepository, _setupRepository, _admissionDiagnosisRepository, _admissionRepository, _admissionReimbursmentRepository, _admissionsRepository, _prescriptionRepository);
        //var userId = UserClaims.GetUserId();;

        //foreach (var AdmissionId in admissionIds)
        //{
        //    var CompanyId = UserClaims.GetCompanyId();

        //    var admissionBinded = await keyA3Binding.BindAdmissionHidEliminate(AdmissionId, CompanyId);
        //    var resultUpdateHid = await keyA3.EliminateHID(admissionBinded);
        //    await _admissionReimbursmentRepository.SaveEliminateHid(AdmissionId, resultUpdateHid.Successfull, userId);

        //    if (!string.IsNullOrEmpty(resultUpdateHid.Data.ErrorMessage))
        //    {

        //        result.Data.Add(new Wcf_Result()
        //        {
        //            Id = AdmissionId,
        //            AdmissionHid = admissionBinded.Hid.AssignerCode,
        //            ErrorMessage = resultUpdateHid.Data.ErrorMessage
        //        });
        //        result.Successfull = resultUpdateHid.Successfull;
        //    }
        //}

        //return result;
        throw new Exception();
    }


    [HttpPost]
    [Route("savepatientbill")]
    public async Task<MyResultDataQuery<List<Wcf_Result>>> SavePatientBill([FromBody] List<int> admissionIds)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);
        //var result = new MyResultDataQuery<List<Wcf_Result>>();
        //result.Data = new List<Wcf_Result>();
        //var keyA3Binding = new BindingReimburesmentModel_WCF(_companyRepository, _setupRepository, _admissionDiagnosisRepository, _admissionRepository, _admissionReimbursmentRepository, _admissionsRepository, _prescriptionRepository);
        //var userId = UserClaims.GetUserId();;
        //var CompanyId = UserClaims.GetCompanyId();
        //foreach (var admId in admissionIds)
        //{
        //    var admissionSearchModel = new GetAdmissionSearch
        //    {
        //        Id = admId,
        //        CompanyId = CompanyId
        //    };

        //    var admission = await _admissionRepository.GetAdmission(admissionSearchModel);
        //    admission.CompanyId = UserClaims.GetCompanyId();
        //    var admissionBinded = await keyA3Binding.BindAdmissionSavePatientBill(admission);

        //    var resultValidateAdmission = keyA3Binding.ValidateAdmissionSavePatientBill(admissionBinded);

        //    if (resultValidateAdmission.ErrorMessage != "")
        //    {
        //        result.Data.Add(new Wcf_Result()
        //        {
        //            Id = admId,
        //            AdmissionHid = resultValidateAdmission.AdmissionHid,
        //            ErrorMessage = "خدمات ذکرشده فاقد نوع خدمت می باشد مجاز به ثبت صورتحساب مراجعه کننده نمی باشید."
        //        });
        //        result.Successfull = false;
        //    }

        //    if (resultValidateAdmission.ErrorMessage == "")
        //    {
        //        var resultSavePatientBill = await keyA3.SavePatientBill(admissionBinded);

        //        if (resultSavePatientBill.Data == null)
        //        {
        //            result.Data.Add(new Wcf_Result()
        //            {
        //                Id = admId,
        //                AdmissionHid = admissionBinded.Admission.HID,
        //                ErrorMessage = "پاسخ وب سرویس حاوی اطلاعات نمی باشد"
        //            });
        //            result.Successfull = false;
        //        }
        //        else if (!string.IsNullOrEmpty(resultSavePatientBill.Data.ErrorMessage))
        //        {
        //            result.Data.Add(new Wcf_Result()
        //            {
        //                Id = admId,
        //                AdmissionHid = admissionBinded.Admission.HID,
        //                ErrorMessage = resultSavePatientBill.Data.ErrorMessage
        //            });

        //            result.Successfull = false;
        //        }
        //        else if (string.IsNullOrEmpty(resultSavePatientBill.Data.ErrorMessage) && string.IsNullOrEmpty(resultSavePatientBill.Data.CompositionUID) && string.IsNullOrEmpty(resultSavePatientBill.Data.MessageUID) && string.IsNullOrEmpty(resultSavePatientBill.Data.PatientUID))
        //        {
        //            result.Data.Add(new Wcf_Result()
        //            {
        //                Id = admId,
        //                AdmissionHid = admissionBinded.Admission.HID,
        //                ErrorMessage = resultSavePatientBill.Data.ErrorMessage
        //            });

        //            result.Successfull = false;
        //        }

        //        if (resultSavePatientBill.Data != null)
        //            await _admissionReimbursmentRepository.SavePatientBill(resultSavePatientBill.Data, resultSavePatientBill.Successfull, admId, userId);
        //    }
        //}

        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("getinsurerreimbursementhid")]
    public async Task<MyResultDataQuery<ReimbursmentPackage>> GetInsurerReimbursementHid(
        [FromBody] List<int> admissionIds)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);
        //var result = new MyResultDataQuery<ReimbursmentPackage>();
        //result.Data = new ReimbursmentPackage();
        //result.Data.WcfResult = new List<Wcf_Result>();
        //var keyA3Binding = new BindingReimburesmentModel_WCF(_companyRepository, _setupRepository, _admissionDiagnosisRepository, _admissionRepository, _admissionReimbursmentRepository, _admissionsRepository, _prescriptionRepository);
        //var userId = UserClaims.GetUserId();;
        //var CompanyId = UserClaims.GetCompanyId();

        //foreach (var AdmissionId in admissionIds)
        //{
        //    var admissionBinded = await keyA3Binding.BindAdmissionReimbursement(AdmissionId, CompanyId);
        //    var reimbursmentResult = await keyA3.GetInsurerReimbursement(admissionBinded);

        //    if (reimbursmentResult.Data != null && reimbursmentResult.Successfull)
        //    {
        //        result.Data.ReimbPackage = reimbursmentResult.Data;

        //        if (reimbursmentResult.Data.ReimbServices != null)
        //        {
        //            var codes = string.Join(',', reimbursmentResult.Data.ReimbServices.Select(a => a.ServiceId));
        //            var serviceByCodes = await _admissionReimbursmentRepository.GetAdmissionServiceByCode(codes, CompanyId);
        //            foreach (var itm in reimbursmentResult.Data.ReimbServices)
        //            {
        //                var serviceId = serviceByCodes.Where(a => a.Code == Convert.ToInt32(itm.ServiceId)).Select(a => a.Id).FirstOrDefault();
        //                itm.ServiceId = serviceId != 0 ? serviceId.ToString() : "";
        //            }
        //        }
        //    }
        //    else if (reimbursmentResult.Data == null)
        //    {
        //        result.Data.WcfResult.Add(new Wcf_Result()
        //        {
        //            Id = AdmissionId,
        //            AdmissionHid = admissionBinded.AssignerCode,
        //            ErrorMessage = "پاسخ وب سرویس حاوی اطلاعات نمی باشد"
        //        });
        //        result.Successfull = false;
        //    }
        //    else if (!string.IsNullOrEmpty(reimbursmentResult.Data.ErrorMessage))
        //    {
        //        result.Data.WcfResult.Add(new Wcf_Result()
        //        {
        //            Id = AdmissionId,
        //            AdmissionHid = admissionBinded.AssignerCode,
        //            ErrorMessage = reimbursmentResult.Data.ErrorMessage
        //        });
        //        result.Successfull = false;
        //    }

        //    //  await _admissionReimbursmentRepository.SaveInsurerReimbursement(reimbursmentResult.Data, reimbursmentResult.Successfull, AdmissionId, userId);
        //}

        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("getadmissionservicelines")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<ServiceLines>> GetAdmissionServiceLines([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await admissionReimbursmentRepository.GetAdmissionServiceLines(id, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] int admissionId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await admissionReimbursmentRepository.Csv(admissionId, CompanyId);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionWebServiceController : Controller
{
    [Authenticate(Operation.VIW, "")]
    [Route("[controller]")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.AdmissionWebService);
    }
}