using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Dtos.MC.Prescription;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.Attender_Assistant;
using ParsAlphabet.ERP.Application.Interfaces.MC.Prescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.HealthIDOrder;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurance;

namespace ParseAlphabet.ERP.Web.Modules.MC.Prescription;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class PrescriptionApiController(
    IPrescriptionRepository prescriptionRepository,
    IAttender_AssistantRepository attender_AssistantRepository
  )
    : ControllerBase
{

    [HttpPost]
    [Route("sendwebservice")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataQuery<List<Wcf_Result>>> SendToWebService([FromBody] List<int> ids)
    {
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var result = new MyResultDataQuery<List<Wcf_Result>>();
        //result.Data = new List<Wcf_Result>();
        //var companyId = UserClaims.GetCompanyId();

        //foreach (var id in ids)
        //{

        //    var prescription = await _prescriptionRepository.GetPrescriptionById(id, 0, companyId);
        //    var patientInfo = new Patient();

        //    // اگر شناسه شباد آفلاین بود
        //    if (!string.IsNullOrEmpty(prescription.PrescriptionHID) && !prescription.HIDOnline)
        //    {
        //        var key3UpdateHid = new BindingGetHID_WCF(_admissionRepository);
        //        var admissionId = await _prescriptionRepository.GetAdmissionIdById(id, companyId);
        //        var updateHidBinded = await key3UpdateHid.BindPrescriptionHidUpdate(admissionId, companyId);

        //        updateHidBinded.Hid.Id = prescription.PrescriptionHID;

        //        var hidUpdateResult = await keyA3.UpdateHID(updateHidBinded);

        //        if (hidUpdateResult.Successfull)
        //        {
        //            var updateHidModel = new UpdatePrescriptionHID()
        //            {
        //                HID = prescription.PrescriptionHID,
        //                HIDOnline = true,
        //                Id = id
        //            };

        //            await _prescriptionRepository.UpdatePrescriptionHid(updateHidModel);
        //        }
        //        else
        //        {
        //            result.Data.Add(new Wcf_Result()
        //            {
        //                Id = id,
        //                AdmissionHid = prescription.PrescriptionHID,
        //                ErrorMessage = hidUpdateResult.StatusMessage
        //            });
        //            result.Successfull = false;
        //            continue;
        //        }
        //    }

        //    var keyA3Binding = new BindingModelPrescription_WCF(_prescriptionRepository, _companyRepository, _setupRepository, _insuranceRepository, _admissionRepository, _admissionsRepository);

        //    var userId = UserClaims.GetUserId();;
        //    var prescriptionBinded = await keyA3Binding.BindPrescription(prescription, userId);

        //    var resultPrescription = new MyResultDataStatus<ResultSendPrescription>();
        //    resultPrescription = await keyA3.SaveAllPrescription(prescriptionBinded, prescription.PrescriptionTypeId);

        //    if (string.IsNullOrEmpty(resultPrescription.Data.ErrorMessage) && string.IsNullOrEmpty(resultPrescription.Data.CompositionUID) && string.IsNullOrEmpty(resultPrescription.Data.MessageUID) && string.IsNullOrEmpty(resultPrescription.Data.PatientUID))
        //    {
        //        result.Data.Add(new Wcf_Result()
        //        {
        //            Id = id,
        //            AdmissionHid = prescription.PrescriptionHID,
        //            ErrorMessage = "پاسخ وب سرویس حاوی اطلاعات نمی باشد"
        //        });
        //        result.Successfull = false;
        //    }
        //    else if (!string.IsNullOrEmpty(resultPrescription.Data.ErrorMessage))
        //    {
        //        result.Data.Add(new Wcf_Result()
        //        {
        //            Id = id,
        //            AdmissionHid = prescription.PrescriptionHID,
        //            ErrorMessage = resultPrescription.Data.ErrorMessage
        //        });
        //        result.Successfull = false;
        //    }
        //    resultPrescription.Data.PrescriptionId = id;

        //    await _prescriptionRepository.UpdatePrescriptionComposition(resultPrescription.Data);
        //}
        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("gethid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataQuery<List<Wcf_Result>>> GetPrescriptionHid([FromBody] List<int> ids)
    {
        //var result = new MyResultDataQuery<List<Wcf_Result>>();
        //result.Data = new List<Wcf_Result>();

        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);
        //var keyA3Binding = new BindingGetHID_WCF(_admissionRepository);
        //var hidOffline = string.Empty;
        //var onlineHid = new MyResultDataStatus<GetHID_Result>();
        //foreach (var id in ids)
        //{
        //    var companyId = UserClaims.GetCompanyId();
        //    var prescriptionHID = new UpdatePrescriptionHID();
        //    var admissionId = await _prescriptionRepository.GetAdmissionIdById(id, companyId);
        //    var admissionBinded = await keyA3Binding.BindGetHidUrgent(admissionId, companyId);
        //    prescriptionHID.Id = id;
        //    if (admissionBinded.GetOnline)
        //    {
        //        onlineHid = await keyA3.GetHIDUrgent(admissionBinded);

        //        if (onlineHid.Successfull)
        //        {

        //            prescriptionHID.HID = onlineHid.Data.Id;
        //            prescriptionHID.HIDOnline = true;
        //        }
        //        else
        //        {
        //            hidOffline = await _healthIDOrderRepository.GetHid(byte.Parse(admissionBinded.Insurer.Id));

        //            if (string.IsNullOrEmpty(hidOffline))
        //            {
        //                result.Data.Add(new Wcf_Result()
        //                {
        //                    Id = id,
        //                    AdmissionHid = admissionId.ToString(),
        //                    ErrorMessage = "به فرم انبار شباد مراجعه نمایید"
        //                });
        //                result.Successfull = false;
        //            }
        //            else
        //            {
        //                prescriptionHID.HID = hidOffline;
        //                prescriptionHID.HIDOnline = false;
        //            }

        //        }
        //    }
        //    else
        //    {
        //        hidOffline = await _healthIDOrderRepository.GetHid(byte.Parse(admissionBinded.InsurerCode));

        //        if (string.IsNullOrEmpty(hidOffline))
        //        {
        //            result.Data.Add(new Wcf_Result()
        //            {
        //                Id = id,
        //                AdmissionHid = admissionId.ToString(),
        //                ErrorMessage = "به فرم انبار شباد مراجعه نمایید"
        //            });
        //            result.Successfull = false;
        //        }
        //        else
        //        {
        //            prescriptionHID.HID = hidOffline;
        //            prescriptionHID.HIDOnline = false;
        //        }
        //    }

        //    var resultUpdateHid = _prescriptionRepository.UpdatePrescriptionHid(prescriptionHID);
        //}
        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("getprescriptiontypebyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<byte> GetPrescriptionTypeById([FromBody] int Id)
    {
        var result = await prescriptionRepository.GetPrescriptionTypeById(Id);
        return result;
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PrescriptionGetPage>>> GetPage([FromBody] NewGetPrescriptionPage model)
    {
        if (model.Form_KeyValue[0]?.ToString() == "myPr")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await prescriptionRepository.GetPage(model, userId);
    }

    [HttpPost]
    [Route("checkpermission")]
    [Authenticate(Operation.VIW, "")]
    public async Task<bool> CheckAttenderPrescription()
    {
        var userId = UserClaims.GetUserId();
        ;
        var CompanyId = UserClaims.GetCompanyId();
        var attenderIds = await attender_AssistantRepository.NewGetAttendersByUserId(userId, CompanyId);

        return attenderIds.Count() == 0;
    }

    [HttpPost]
    [Route("getprescriptionbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<GetPrescriptionByAdmissionId> GetPrescriptionByAdmissionId([FromBody] NextPrescriptionId model)
    {
        var prescriptionId = 0;
        var headerPagination = 0;
        var CompanyId = UserClaims.GetCompanyId();
        if (model != null)
        {
            prescriptionId = model.PrescriptionId;
            headerPagination = model.HeaderPagination;
        }

        return await prescriptionRepository.GetPrescriptionById(prescriptionId, headerPagination, CompanyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return prescriptionRepository.GetColumns();
    }

    [HttpPost]
    [Route("sendprescriptionfilteritems")]
    public GetColumnsViewModel GetWebServiceFilterParameters()
    {
        return prescriptionRepository.SendPrescriptionColumns();
    }

    [HttpPost]
    [Route("sendprescriptiongetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<SendPrescriptionGetPage>>> SendPrescriptionGetPage(
        [FromBody] GetPrescriptionPage model)
    {
        var userId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();
        model.AttenderId = 0; // await _attenderPrescriptionRepository.GetAttenderIdByUserId(userId,model.CompanyId);

        return await prescriptionRepository.SendPrescriptionGetPage(model);
    }

    [HttpGet]
    [Route("prescriptiontypedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> PrescriptionTypeDropDown()
    {
        return await prescriptionRepository.PrescriptionTypeDropDown();
    }


    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Save([FromBody] GetPrescription model)
    {
        var result = new MyResultDataStatus<Tuple<MyResultStatus, MyResultStatus, MyResultStatus, MyResultStatus>>();
        var userId = UserClaims.GetUserId();
        ;
        model.CreateUserId = userId;
        model.CompanyId = UserClaims.GetCompanyId();
        // T1:Drug,T2:Image,T3:Lab,T4:Diagnosis
        var tupleResult = await prescriptionRepository.SavePrescription(model);

        result.Data = tupleResult;

        return result;
    }

    [HttpPost]
    [Route("checksent")]
    [Authenticate(Operation.VIW, "")]
    public async Task<bool> CheckSent([FromBody] int id)
    {
        return await prescriptionRepository.CheckSent(id);
    }

    [HttpPost]
    [Route("checkhid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<bool> CheckHid([FromBody] int id)
    {
        return await prescriptionRepository.CheckHid(id);
    }

    [HttpPost]
    [Route("productid")]
    public async Task<IEnumerable<MyDropDownViewModel>> ProductId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.ProductId(model.Term);
    }

    [HttpPost]
    [Route("asneedid")]
    public async Task<IEnumerable<MyDropDownViewModel>> AsNeedId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.AsNeedId(model.Term);
    }

    [HttpPost]
    [Route("dosageunitid")]
    public async Task<IEnumerable<MyDropDownViewModel>> DosageUnitId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.DosageUnitId(model.Term);
    }

    [HttpGet]
    [Route("totalnumberunitid")]
    public async Task<IEnumerable<MyDropDownViewModel>> TotalNumberUnitId(string? term)
    {
        return await prescriptionRepository.DrugTotalNumberUnitId(term);
    }

    [HttpPost]
    [Route("frequencyid")]
    public async Task<IEnumerable<MyDropDownViewModel>> Frequencyid([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.FrequencyId(model.Term);
    }

    [HttpGet]
    [Route("intentid")]
    public async Task<IEnumerable<MyDropDownViewModel>> IntentId(string? term)
    {
        return await prescriptionRepository.IntentId(term);
    }

    [HttpPost]
    [Route("routeid")]
    public async Task<IEnumerable<MyDropDownViewModel>> RouteId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.RouteId(model.Term);
    }

    [HttpGet]
    [Route("lateralityId")]
    public async Task<IEnumerable<MyDropDownViewModel>> LateralityId()
    {
        return await prescriptionRepository.LateralityId();
    }


    [HttpPost]
    [Route("methodid")]
    public async Task<IEnumerable<MyDropDownViewModel>> MethodId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.MethodId(model.Term);
    }

    [HttpGet]
    [Route("prescriptionpriorityid")]
    public async Task<IEnumerable<MyDropDownViewModel>> PrescriptionPriorityId(string? term)
    {
        return await prescriptionRepository.PrescriptionPriorityId(term);
    }

    [HttpPost]
    [Route("priorityid")]
    public async Task<IEnumerable<MyDropDownViewModel>> PriorityId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.PriorityId(model.Term);
    }

    [HttpPost]
    [Route("reasonid")]
    public async Task<IEnumerable<MyDropDownViewModel>> ReasonId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.ReasonId(model.Term);
    }

    [HttpPost]
    [Route("bodysiteid")]
    public async Task<IEnumerable<MyDropDownViewModel>> BodySiteId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.BodySiteId(model.Term);
    }

    [HttpGet]
    [Route("roleid")]
    public async Task<IEnumerable<MyDropDownViewModel>> RoleId(string? term)
    {
        return await prescriptionRepository.RoleId(term);
    }


    [HttpPost]
    [Route("imageserviceid")]
    public async Task<IEnumerable<MyDropDownViewModel>> ImageServiceId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.ImageServiceId(model.Term);
    }


    [HttpGet]
    [Route("imagedetailserviceid")]
    public async Task<IEnumerable<MyDropDownViewModel>> ImageDetailServiceId(string? term)
    {
        return await prescriptionRepository.ImageDetailServiceId(term);
    }


    [HttpPost]
    [Route("labserviceid")]
    public async Task<IEnumerable<MyDropDownViewModel>> LabServiceId([FromBody] GetPrescriptionSelect2 model)
    {
        return await prescriptionRepository.LabServiceId(model.Term);
    }

    [HttpGet]
    [Route("diagnosisstatusid")]
    public async Task<IEnumerable<MyDropDownViewModel>> DiagnosisStatusId()
    {
        return await prescriptionRepository.DiagnosisStatusId();
    }

    [HttpGet]
    [Route("diagnosisreasonid")]
    public async Task<IEnumerable<MyDropDownViewModel>> DiagnosisReasonId(string? term)
    {
        return await prescriptionRepository.DiagnosisReasonId(term);
    }

    [HttpGet]
    [Route("reasonforencounterid")]
    public async Task<IEnumerable<MyDropDownViewModel>> ReasonForEncounter(string? term)
    {
        return await prescriptionRepository.ReasonForEncounterId(term);
    }

    [HttpGet]
    [Route("serverityid")]
    public async Task<IEnumerable<MyDropDownViewModel>> ServerityId()
    {
        return await prescriptionRepository.ServerityId();
    }

    [HttpGet]
    [Route("specimentissuetypeid")]
    public async Task<IEnumerable<MyDropDownViewModel>> SpecimenTissueTypeId()
    {
        return await prescriptionRepository.SpecimenTissueTypeId();
    }


    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> PrescriptionCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await prescriptionRepository.CheckExist(id, companyId);
    }


    //[HttpPost]
    //[Route("getmsctypeattender")]
    //[Authenticate(Operation.VIW, "")]
    //public async Task<int> GetMscTypeAttender()
    //{
    //    var userId = UserClaims.GetUserId();;
    //    var CompanyId = UserClaims.GetCompanyId();
    //    var attenderId = await _attenderPrescriptionRepository.GetAttenderIdByUserId(userId,CompanyId);
    //    var mscType = await _attenderRepository.GetAttenderMsc(attenderId, CompanyId);

    //    if (mscType == null)
    //        return 0;
    //    else
    //        return mscType.Id;
    //}
}

[Route("MC")]
[Authorize]
public class PrescriptionController : Controller
{
    [Route("[Controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.Prescription);
    }

    [Route("[controller]/form/{id?}")]
    [Authenticate(Operation.INS, "")]
    [HttpGet]
    public IActionResult Form(int? id)
    {
        return PartialView(Views.MC.PrescriptionForm);
    }

    [Route("[controller]/display/{id}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.PrescriptionDisplay);
    }
}