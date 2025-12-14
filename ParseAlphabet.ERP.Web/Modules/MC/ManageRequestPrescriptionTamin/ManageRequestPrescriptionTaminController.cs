using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.PrescriptionTamin;
using ParsAlphabet.ERP.Application.Dtos.WF.StageAction;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionServiceTamin;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO.REPrescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionTaminWebService;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ManageRequestPrescriptionTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.PrescriptionTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;
using ParsAlphabet.WebService.Api.Model.Tamin.Common;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;
using ParsAlphabet.WebService.Api.Model.Tamin.RequestEprescription;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;


namespace ParseAlphabet.ERP.Web.Modules.MC.ManageRequestPrescriptionTamin;

[Route("api/MC/requestPrescriptionTamin")]
[ApiController]
[Authorize]
public class ManageRequestPrescriptionTaminController : ControllerBase
{
    private readonly IAdmissionServiceTaminRepository _admissionServiceTaminRepository;
    private readonly AdmissionTaminWebServiceRepository _admissionTaminWebServiceRepository;
    private readonly IAuthorizationRequestParaClinicService _authorizationParaClinicService;
    private readonly ICommonRequestParaClinicService _commonParaClinicService;
    private readonly ManageRequestPrescriptionTaminRepository _manageTaminTokenRepository;
    private readonly PrescriptionTaminRepository _prescriptionTaminRepository;
    private readonly IRequestEprescriptionParaClinicService _requestEprescriptionParaClinicService;
    private readonly StageActionLogRepository _stageActionLogRepository;
    private readonly StageActionRepository _stageActionRepository;

    public ManageRequestPrescriptionTaminController(
        IAuthorizationRequestParaClinicService authorizationParaClinicService,
        ICommonRequestParaClinicService commonParaClinicService,
        ManageRequestPrescriptionTaminRepository manageTaminTokenRepository,
        IAdmissionServiceTaminRepository admissionServiceTaminRepository,
        AdmissionTaminWebServiceRepository admissionTaminWebServiceRepository,
        PrescriptionTaminRepository prescriptionTaminRepository,
        IRequestEprescriptionParaClinicService requestEprescriptionParaClinicService,
        StageActionRepository stageActionRepository, StageActionLogRepository stageActionLogRepository)
    {
        _authorizationParaClinicService = authorizationParaClinicService;
        _commonParaClinicService = commonParaClinicService;
        _manageTaminTokenRepository = manageTaminTokenRepository;
        _admissionServiceTaminRepository = admissionServiceTaminRepository;
        _admissionTaminWebServiceRepository = admissionTaminWebServiceRepository;
        _prescriptionTaminRepository = prescriptionTaminRepository;
        _requestEprescriptionParaClinicService = requestEprescriptionParaClinicService;
        _stageActionRepository = stageActionRepository;
        _stageActionLogRepository = stageActionLogRepository;
    }

    [Route("deserveinfo/{nationalcode}/{docId}")]
    [HttpGet]
    public async Task<ResultRequest<SetDeserveInfoRequestEP>> GetDeservePatientInfo(string nationalcode, string docId)
    {
        var companyId = UserClaims.GetCompanyId();

        var token = await _authorizationParaClinicService.GetTokenParaClinic(companyId, "0");

        var responseDeserveInfo =
            await _commonParaClinicService.GetPatientDeserveInfo(nationalcode, docId, token, companyId);

        if (responseDeserveInfo.Status == (int)HttpStatusCode.Unauthorized)
        {
            var deleteTokenResult =
                _manageTaminTokenRepository.DeleteToken((byte)Enum.TaminTokenType.RequestPrescription, companyId, "0");
            if (responseDeserveInfo.Status != 200)
                responseDeserveInfo.StatusDesc = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید";
        }

        else if (responseDeserveInfo.Status != (int)HttpStatusCode.OK)
        {
            if (responseDeserveInfo.Status == (int)HttpStatusCode.InternalServerError)
                responseDeserveInfo.StatusDesc = "خطای ناشناخته وب سرویس تامین اجتماعی ، به مدیر سیستم اطلاع دهید";
            else
                responseDeserveInfo.StatusDesc =
                    responseDeserveInfo.StatusDesc != "" && responseDeserveInfo.StatusDesc != null
                        ? responseDeserveInfo.StatusDesc
                        : "پاسخی از وب سرویس دریافت نشد دوباره تلاش نمایید";
        }

        return responseDeserveInfo;
    }


    // [Route("sendrequestprescription")]
    // [HttpPost]
    // public async Task<MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>> SendRequestPrescription([FromBody] List<int> prescriptionIds)
    // {
    //     var finalResult = new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>();
    //     finalResult.Data = new List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>();

    //     byte? actionId = null;
    //     string actionName = null;

    //     if (!prescriptionIds.ListHasRow())
    //         return new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>()
    //         {
    //             Data = null,
    //             Successfull = false,
    //             Status = -100,
    //             StatusMessage = "موردی برای ارسال یافت نشد"
    //         };

    //     var companyId = UserClaims.GetCompanyId();
    //     var userId = UserClaims.GetUserId();;
    //     var details = new List<SetNoteDetailPrescription>();


    //     foreach (var id in prescriptionIds)
    //     {
    //         var resultAdmissionTamin = await _admissionServiceTaminRepository.PrescriptionTaminInfo(id);

    //         // Get Token By ParaclinicTypeCode
    //         var token = await _authorizationParaClinicService.GetTokenParaClinic(companyId, "0");

    //         if (resultAdmissionTamin.RequestEPrescriptionId == null)
    //         {

    //             if (resultAdmissionTamin.TaminPrescriptionCategoryId == "1")
    //             {

    //                 details = resultAdmissionTamin.PrescriptionServiceLineTamin.Select(t => new SetNoteDetailPrescription()
    //                 {
    //                     ServiceId = new SetService()
    //                     {
    //                         ServiceCode = t.ServiceCode,
    //                         ServiceType = new SetServiceType()
    //                         {
    //                             ServiceTypeId = t.TaminPrescriptionTypeId
    //                         }
    //                     },

    //                     ServiceQuantity = t.ServiceQuantity,

    //                     DrugAmount = new SetDrugAmount()
    //                     {
    //                         DrugAmountId = t.DrugAmountId
    //                     },
    //                     Repeat = t.Repeat.ToString(),
    //                     DrugInstruction = new SetDrugInstruction()
    //                     {
    //                         DrugInstructionId = t.DrugInstructionId
    //                     },
    //                     Dose = t.Dose,
    //                     DateDo = PersianDateTime.GetShamsiDate(t.DoDate.ToShortDateString()).Replace("/", "")


    //                 }).ToList();

    //             }

    //             else if (resultAdmissionTamin.TaminPrescriptionCategoryId == "3")
    //             {
    //                 details = new List<SetNoteDetailPrescription>();
    //             }
    //             else if ((resultAdmissionTamin.TaminPrescriptionCategoryId != "1") && (resultAdmissionTamin.TaminPrescriptionCategoryId != "3"))
    //             {
    //                 if (resultAdmissionTamin.PrescriptionServiceLineTamin.FirstOrDefault().TaminPrescriptionTypeId == "2")
    //                 {
    //                     details = resultAdmissionTamin.PrescriptionServiceLineTamin.Select(t => new SetNoteDetailPrescription()
    //                     {
    //                         ServiceId = new SetService()
    //                         {
    //                             ServiceType = new SetServiceType()
    //                             {
    //                                 ServiceTypeId = t.TaminPrescriptionTypeId
    //                             },
    //                             ServiceCode = t.ServiceCode,
    //                             ParaTarefGroup = new SetParTarefGroup()
    //                             {
    //                                 ParGroupCode = t.ParaclinicTareffGroupId
    //                             },
    //                         },
    //                         ServiceQuantity = t.ServiceQuantity
    //                     }).ToList();
    //                 }
    //                 else if (resultAdmissionTamin.PrescriptionServiceLineTamin.FirstOrDefault().TaminPrescriptionTypeId == "13")
    //                 {
    //                     details = resultAdmissionTamin.PrescriptionServiceLineTamin.Select(t => new SetNoteDetailPrescription()
    //                     {
    //                         ServiceId = new SetService()
    //                         {
    //                             ServiceType = new SetServiceType()
    //                             {
    //                                 ServiceTypeId = t.TaminPrescriptionTypeId
    //                             },
    //                             ServiceCode = t.ServiceCode,
    //                         },
    //                         ServiceQuantity = t.ServiceQuantity,
    //                         illnessId = t.illnessId,
    //                         planId = t.planId
    //                     }).ToList();
    //                 }
    //                 else
    //                 {
    //                     details = resultAdmissionTamin.PrescriptionServiceLineTamin.Select(t => new SetNoteDetailPrescription()
    //                     {
    //                         ServiceId = new SetService()
    //                         {
    //                             ServiceType = new SetServiceType()
    //                             {
    //                                 ServiceTypeId = t.TaminPrescriptionTypeId
    //                             },
    //                             ServiceCode = t.ServiceCode,
    //                         },
    //                         ServiceQuantity = t.ServiceQuantity
    //                     }).ToList();
    //                 }

    //             }

    //             var responseSendEprescription = new ResultRequestRequestEPrescription<GetOutPutSendEprescription>();
    //             var sendEPrescription = new SetNoteDetailEPrescription()
    //             {
    //                 PatientNationalCode = resultAdmissionTamin.PatientNationalCode,
    //                 PatientMobile = resultAdmissionTamin.PatientMobile,
    //                 PrescriptionType = new SetEPrescriptionType()
    //                 {
    //                     PrescriptionTypeId = int.Parse(resultAdmissionTamin.TaminPrescriptionCategoryId)
    //                 },
    //                 PrescriptionDate = !string.IsNullOrEmpty(resultAdmissionTamin.PrescriptionDatePersian) ? resultAdmissionTamin.PrescriptionDatePersian.Replace("/", "") : "",
    //                 AttenderMSC = resultAdmissionTamin.AttenderMSC,
    //                 AttenderMobileNo = resultAdmissionTamin.AttenderMobileNo,
    //                 AttenderNationalCode = resultAdmissionTamin.AttenderNationalCode,
    //                 Comments = resultAdmissionTamin.Comment,
    //                 CodingTermin = "",
    //                 ExpireDate = !string.IsNullOrEmpty(resultAdmissionTamin.ExpireDatePersian) ? resultAdmissionTamin.ExpireDatePersian.Replace("/", "") : "",
    //                 NoteDetailEprescription = details
    //             };

    //             responseSendEprescription = await _requestEprescriptionParaClinicService.SendERequestPrescription(sendEPrescription, token, companyId);

    //             var TaminPrescriptionUpdate = new TaminPrescriptionUpdate();
    //             TaminPrescriptionUpdate.PrescriptionId = id;

    //             if (responseSendEprescription.Status == 401)
    //             {
    //                 TaminPrescriptionUpdate.SendResult = 2;
    //                 TaminPrescriptionUpdate.SendDateTime = DateTime.Now;

    //                 var deleteTokenResult = _manageTaminTokenRepository.DeleteToken((byte)TaminTokenType.RequestPrescription, companyId, "0");

    //                 return new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>()
    //                 {
    //                     Data = null,
    //                     Successfull = false,
    //                     Status = 401,
    //                     StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
    //                 };
    //             }
    //             else
    //             {
    //                 if (responseSendEprescription.Status == 200 && responseSendEprescription.Data.NotNull())
    //                 {
    //                     if (responseSendEprescription.Result.Data != null)
    //                     {
    //                         if (responseSendEprescription.Result.Data.Data.ResultOut.HeaderEprescriptionId != null)
    //                         {
    //                             TaminPrescriptionUpdate.RequestEPrescriptionId = responseSendEprescription.Result.Data.Data.ResultOut.HeaderEprescriptionId;
    //                         }

    //                         if (responseSendEprescription.Result.Data.Data.ResultOut.TrackingCode != null)
    //                         {
    //                             TaminPrescriptionUpdate.TrackingCode = responseSendEprescription.Result.Data.Data.ResultOut.TrackingCode.ToString();
    //                         }


    //                     }
    //                     if (responseSendEprescription.Result.Data.Data.ResultOut.ErrorMesssage == null)
    //                     {
    //                         TaminPrescriptionUpdate.SendResult = 1;
    //                         TaminPrescriptionUpdate.SendDateTime = DateTime.Now;

    //                         var getAction = new GetAction();
    //                         var stageAction = new ActionModel();

    //                         getAction.CompanyId = companyId;
    //                         getAction.StageId = resultAdmissionTamin.StageId;
    //                         getAction.WorkflowId = resultAdmissionTamin.WorkflowId;
    //                         getAction.Priority = 2;
    //                         stageAction = await _stageActionRepository.GetAction(getAction);


    //                         actionId = stageAction.ActionId;
    //                         actionName = stageAction.ActionName;

    //                         var updateStepModel = new UpdateAction()
    //                         {
    //                             RequestActionId = stageAction.ActionId,
    //                             WorkflowCategoryId = 10,
    //                             IdentityId = resultAdmissionTamin.PrescriptionId,
    //                             StageId = resultAdmissionTamin.StageId,
    //                             WorkflowId = resultAdmissionTamin.WorkflowId,
    //                             CompanyId = companyId,
    //                             UserId = userId
    //                         };

    //                         var resultLog = await _stageActionLogRepository.StageActionLogInsert(updateStepModel);

    //                         var updateResult = await _prescriptionTaminRepository.UpdateLastAction(resultAdmissionTamin.PrescriptionId, stageAction.ActionId);


    //	var servicePrescriptionMyResultStatusViewModel = new ServicePrescriptionMyResultStatusViewModel()
    //	{
    //		Successfull = true,
    //		Status = 100,
    //		StatusMessage = "ارسال نسخه با موقثیت انجام شد",
    //		CreateDateTime = TaminPrescriptionUpdate.SendDateTime,
    //		RequestEPrescriptionId = TaminPrescriptionUpdate.RequestEPrescriptionId,
    //		Id = TaminPrescriptionUpdate.PrescriptionId,
    //		ActionId = actionId,
    //		ActionName = actionName

    //	};
    //	//var tuple = new Tuple<int, ServicePrescriptionMyResultStatusViewModel>(id, servicePrescriptionMyResultStatusViewModel);
    //	//finalResult.Data.Add(tuple);

    //	//var resultUpdateSend = await _admissionTaminWebServiceRepository.UpdateResultSendPrescriptionTamin(TaminPrescriptionUpdate);
    //	//return new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>()
    //	//{
    //	//    Data = finalResult.Data,
    //	//    Successfull = servicePrescriptionMyResultStatusViewModel.Successfull,
    //	//    Status = servicePrescriptionMyResultStatusViewModel.Status,
    //	//    StatusMessage = servicePrescriptionMyResultStatusViewModel.StatusMessage
    //	//};
    //}
    //                     else
    //                     {
    //                         TaminPrescriptionUpdate.SendResult = 2;
    //                         TaminPrescriptionUpdate.SendDateTime = DateTime.Now;

    //                         var errStr = new List<string>();

    //                         errStr.Add(responseSendEprescription.Result.Data.Data.ResultOut.ErrorMesssage);
    //                         var MyResultStatus = new ServicePrescriptionMyResultStatusViewModel
    //                         {
    //                             Status = Convert.ToInt32(responseSendEprescription.Result.Data.Data.ResultOut.ErrorCode),
    //                             ValidationErrors = errStr

    //                         };
    //                         var tuple = new Tuple<int, ServicePrescriptionMyResultStatusViewModel>(id, MyResultStatus);
    //                         finalResult.Data.Add(tuple);
    //                     }
    //                 }
    //                 else
    //                 {
    //                     TaminPrescriptionUpdate.SendResult = 2;
    //                     TaminPrescriptionUpdate.SendDateTime = DateTime.Now;

    //                     var errStr = new List<string>();

    //                     errStr.Add(responseSendEprescription.Reason);
    //                     var MyResultStatus = new ServicePrescriptionMyResultStatusViewModel
    //                     {
    //                         Status = responseSendEprescription.Status,
    //                         ValidationErrors = errStr

    //                     };
    //                     var tuple = new Tuple<int, ServicePrescriptionMyResultStatusViewModel>(id, MyResultStatus);
    //                     finalResult.Data.Add(tuple);
    //                 }

    //                 var resultUpdate = await _admissionTaminWebServiceRepository.UpdateResultSendPrescriptionTamin(TaminPrescriptionUpdate);
    //             }
    //         }
    //         else
    //         {
    //             return new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>()
    //             {
    //                 Data = null,
    //                 Successfull = false,
    //                 Status = 500,
    //                 StatusMessage = "این نسخه ارسال شده است مجدد ارسال نفرمایید"
    //             };
    //         }
    //     }


    //     finalResult.Successfull = finalResult.Data.Count == 0;
    //     return finalResult;
    // }


    [Route("sendrequestprescription")]
    [HttpPost]
    public async Task<MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>>
        SendRequestPrescription([FromBody] int prescriptionId)
    {
        var finalResult = new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>();
        finalResult.Data = new List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>();

        byte? actionId = null;
        string actionName = null;

        if (prescriptionId == 0)
            return new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>
            {
                Data = null,
                Successfull = false,
                Status = -100,
                StatusMessage = "موردی برای ارسال یافت نشد"
            };

        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var details = new List<SetNoteDetailPrescription>();


        var resultAdmissionTamin = await _admissionServiceTaminRepository.PrescriptionTaminInfo(prescriptionId);

        // Get Token By ParaclinicTypeCode
        var token = await _authorizationParaClinicService.GetTokenParaClinic(companyId, "0");

        if (resultAdmissionTamin.RequestEPrescriptionId == null)
        {
            if (resultAdmissionTamin.TaminPrescriptionCategoryId == "1")
            {
                details = resultAdmissionTamin.PrescriptionServiceLineTamin.Select(t => new SetNoteDetailPrescription
                {
                    ServiceId = new SetService
                    {
                        ServiceCode = t.ServiceCode,
                        ServiceType = new SetServiceType
                        {
                            ServiceTypeId = t.TaminPrescriptionTypeId
                        }
                    },

                    ServiceQuantity = t.ServiceQuantity,

                    DrugAmount = new SetDrugAmount
                    {
                        DrugAmountId = t.DrugAmountId
                    },
                    Repeat = t.Repeat.ToString(),
                    DrugInstruction = new SetDrugInstruction
                    {
                        DrugInstructionId = t.DrugInstructionId
                    },
                    Dose = t.Dose,
                    DateDo = PersianDateTime.GetShamsiDate(t.DoDate.ToShortDateString()).Replace("/", "")
                }).ToList();
            }

            else if (resultAdmissionTamin.TaminPrescriptionCategoryId == "3")
            {
                details = new List<SetNoteDetailPrescription>();
            }
            else if (resultAdmissionTamin.TaminPrescriptionCategoryId != "1" &&
                     resultAdmissionTamin.TaminPrescriptionCategoryId != "3")
            {
                if (resultAdmissionTamin.PrescriptionServiceLineTamin.FirstOrDefault().TaminPrescriptionTypeId == "2")
                    details = resultAdmissionTamin.PrescriptionServiceLineTamin.Select(t =>
                        new SetNoteDetailPrescription
                        {
                            ServiceId = new SetService
                            {
                                ServiceType = new SetServiceType
                                {
                                    ServiceTypeId = t.TaminPrescriptionTypeId
                                },
                                ServiceCode = t.ServiceCode,
                                ParaTarefGroup = new SetParTarefGroup
                                {
                                    ParGroupCode = t.ParaclinicTareffGroupId
                                }
                            },
                            ServiceQuantity = t.ServiceQuantity
                        }).ToList();
                else if (resultAdmissionTamin.PrescriptionServiceLineTamin.FirstOrDefault().TaminPrescriptionTypeId ==
                         "13")
                    details = resultAdmissionTamin.PrescriptionServiceLineTamin.Select(t =>
                        new SetNoteDetailPrescription
                        {
                            ServiceId = new SetService
                            {
                                ServiceType = new SetServiceType
                                {
                                    ServiceTypeId = t.TaminPrescriptionTypeId
                                },
                                ServiceCode = t.ServiceCode
                            },
                            ServiceQuantity = t.ServiceQuantity,
                            illnessId = t.illnessId,
                            planId = t.planId
                        }).ToList();
                else
                    details = resultAdmissionTamin.PrescriptionServiceLineTamin.Select(t =>
                        new SetNoteDetailPrescription
                        {
                            ServiceId = new SetService
                            {
                                ServiceType = new SetServiceType
                                {
                                    ServiceTypeId = t.TaminPrescriptionTypeId
                                },
                                ServiceCode = t.ServiceCode
                            },
                            ServiceQuantity = t.ServiceQuantity
                        }).ToList();
            }

            var responseSendEprescription = new ResultRequestRequestEPrescription<GetOutPutSendEprescription>();
            var sendEPrescription = new SetNoteDetailEPrescription
            {
                PatientNationalCode = resultAdmissionTamin.PatientNationalCode,
                PatientMobile = resultAdmissionTamin.PatientMobile,
                PrescriptionType = new SetEPrescriptionType
                {
                    PrescriptionTypeId = int.Parse(resultAdmissionTamin.TaminPrescriptionCategoryId)
                },
                PrescriptionDate = !string.IsNullOrEmpty(resultAdmissionTamin.PrescriptionDatePersian)
                    ? resultAdmissionTamin.PrescriptionDatePersian.Replace("/", "")
                    : "",
                AttenderMSC = resultAdmissionTamin.AttenderMSC,
                AttenderMobileNo = resultAdmissionTamin.AttenderMobileNo,
                AttenderNationalCode = resultAdmissionTamin.AttenderNationalCode,
                Comments = resultAdmissionTamin.Comment,
                CodingTermin = "",
                ExpireDate = !string.IsNullOrEmpty(resultAdmissionTamin.ExpireDatePersian)
                    ? resultAdmissionTamin.ExpireDatePersian.Replace("/", "")
                    : "",
                NoteDetailEprescription = details
            };

            responseSendEprescription =
                await _requestEprescriptionParaClinicService.SendERequestPrescription(sendEPrescription, token,
                    companyId);

            var TaminPrescriptionUpdate = new TaminPrescriptionUpdate();
            TaminPrescriptionUpdate.PrescriptionId = prescriptionId;

            if (responseSendEprescription.Status == 401)
            {
                TaminPrescriptionUpdate.SendResult = 2;
                TaminPrescriptionUpdate.SendDateTime = DateTime.Now;

                var deleteTokenResult =
                    _manageTaminTokenRepository.DeleteToken((byte)Enum.TaminTokenType.RequestPrescription, companyId,
                        "0");

                return new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>
                {
                    Data = null,
                    Successfull = false,
                    Status = 401,
                    StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                };
            }

            if (responseSendEprescription.Status == 200 && responseSendEprescription.Data.NotNull())
            {
                if (responseSendEprescription.Result.Data != null)
                {
                    if (responseSendEprescription.Result.Data.Data.ResultOut.HeaderEprescriptionId != null)
                        TaminPrescriptionUpdate.RequestEPrescriptionId = responseSendEprescription.Result.Data.Data
                            .ResultOut.HeaderEprescriptionId;

                    if (responseSendEprescription.Result.Data.Data.ResultOut.TrackingCode != null)
                        TaminPrescriptionUpdate.TrackingCode =
                            responseSendEprescription.Result.Data.Data.ResultOut.TrackingCode.ToString();
                }

                if (responseSendEprescription.Result.Data.Data.ResultOut.ErrorMesssage == null)
                {
                    TaminPrescriptionUpdate.SendResult = 1;
                    TaminPrescriptionUpdate.SendDateTime = DateTime.Now;

                    var getAction = new GetAction();
                    var stageAction = new ActionModel();

                    getAction.CompanyId = companyId;
                    getAction.StageId = resultAdmissionTamin.StageId;
                    getAction.WorkflowId = resultAdmissionTamin.WorkflowId;
                    getAction.Priority = 2;
                    stageAction = await _stageActionRepository.GetAction(getAction);


                    actionId = stageAction.ActionId;
                    actionName = stageAction.ActionName;

                    var updateStepModel = new UpdateAction
                    {
                        RequestActionId = stageAction.ActionId,
                        WorkflowCategoryId = 10,
                        IdentityId = resultAdmissionTamin.PrescriptionId,
                        StageId = resultAdmissionTamin.StageId,
                        WorkflowId = resultAdmissionTamin.WorkflowId,
                        CompanyId = companyId,
                        UserId = userId
                    };

                    var resultLog = await _stageActionLogRepository.StageActionLogInsert(updateStepModel);

                    var updateResult =
                        await _prescriptionTaminRepository.UpdateLastAction(resultAdmissionTamin.PrescriptionId,
                            stageAction.ActionId);


                    var servicePrescriptionMyResultStatusViewModel = new ServicePrescriptionMyResultStatusViewModel
                    {
                        Successfull = true,
                        Status = 100,
                        StatusMessage = "ارسال نسخه با موقثیت انجام شد",
                        CreateDateTime = TaminPrescriptionUpdate.SendDateTime,
                        RequestEPrescriptionId = TaminPrescriptionUpdate.RequestEPrescriptionId,
                        Id = TaminPrescriptionUpdate.PrescriptionId,
                        ActionId = actionId,
                        ActionName = actionName
                    };
                    var tuple = new Tuple<int, ServicePrescriptionMyResultStatusViewModel>(prescriptionId,
                        servicePrescriptionMyResultStatusViewModel);
                    finalResult.Data.Add(tuple);

                    var resultUpdateSend =
                        await _admissionTaminWebServiceRepository.UpdateResultSendPrescriptionTamin(
                            TaminPrescriptionUpdate);
                    return new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>
                    {
                        Data = finalResult.Data,
                        Successfull = servicePrescriptionMyResultStatusViewModel.Successfull,
                        Status = servicePrescriptionMyResultStatusViewModel.Status,
                        StatusMessage = servicePrescriptionMyResultStatusViewModel.StatusMessage
                    };
                }
                else
                {
                    TaminPrescriptionUpdate.SendResult = 2;
                    TaminPrescriptionUpdate.SendDateTime = DateTime.Now;

                    var errStr = new List<string>();

                    errStr.Add(responseSendEprescription.Result.Data.Data.ResultOut.ErrorMesssage);
                    var MyResultStatus = new ServicePrescriptionMyResultStatusViewModel
                    {
                        Status = Convert.ToInt32(responseSendEprescription.Result.Data.Data.ResultOut.ErrorCode),
                        ValidationErrors = errStr
                    };
                    var tuple = new Tuple<int, ServicePrescriptionMyResultStatusViewModel>(prescriptionId,
                        MyResultStatus);
                    finalResult.Data.Add(tuple);
                }
            }
            else
            {
                TaminPrescriptionUpdate.SendResult = 2;
                TaminPrescriptionUpdate.SendDateTime = DateTime.Now;

                var errStr = new List<string>();

                errStr.Add(responseSendEprescription.Reason);
                var MyResultStatus = new ServicePrescriptionMyResultStatusViewModel
                {
                    Status = responseSendEprescription.Status,
                    ValidationErrors = errStr
                };
                var tuple = new Tuple<int, ServicePrescriptionMyResultStatusViewModel>(prescriptionId, MyResultStatus);
                finalResult.Data.Add(tuple);
            }

            var resultUpdate =
                await _admissionTaminWebServiceRepository.UpdateResultSendPrescriptionTamin(TaminPrescriptionUpdate);
        }
        else
        {
            return new MyResultDataStatus<List<Tuple<int, ServicePrescriptionMyResultStatusViewModel>>>
            {
                Data = null,
                Successfull = false,
                Status = 500,
                StatusMessage = "این نسخه ارسال شده است مجدد ارسال نفرمایید"
            };
        }


        finalResult.Successfull = finalResult.Data.Count == 0;
        return finalResult;
    }


    [Route("getrequestprescription")]
    [HttpGet]
    public async Task<ResultRequestEditPrescription> GetRequestPrescription(string id, string opr = null)
    {
        var result = await _prescriptionTaminRepository.getPrescriptionTaminInfo(id);

        var responseSendEprescription = new ResultRequestEditPrescription();


        if (opr == "DEL")
            if (result.SendDateTime.Date != DateTime.Now.Date)
            {
                responseSendEprescription.Status = -101;
                responseSendEprescription.Reason = "امکان حذف نسخه فقط برای روز جاری امکانپذیر است";
                return responseSendEprescription;
            }

        long headerId1 = 0;
        if (result.RequestEPrescriptionId != "" || result.RequestEPrescriptionId != null)
            headerId1 = Convert.ToInt64(result.RequestEPrescriptionId);
        var companyId = UserClaims.GetCompanyId();

        var token = await _authorizationParaClinicService.GetTokenParaClinic(companyId, "0");

        responseSendEprescription =
            await _requestEprescriptionParaClinicService.GetEPrescription(result.RequestEPrescriptionId, result.MSC,
                token, companyId);

        if (responseSendEprescription.Status == 401)
        {
            var deleteTokenResult =
                _manageTaminTokenRepository.DeleteToken((byte)Enum.TaminTokenType.RequestPrescription, companyId, "0");

            return responseSendEprescription;
        }

        if (responseSendEprescription.Status == 200)
        {
            //if (opr != "DEL")
            //{
            //    foreach (var item in responseSendEprescription.Data)
            //    {
            //        var updateResult = await _prescriptionTaminRepository.SaveNoteDetailsEprscId(Convert.ToInt32(id), item.SrvId.SrvType.SrvType, item.SrvId.WsSrvCode, item.NoteDetailsEprscId.ToString());
            //    }
            //}
            var data1 = JsonConvert.SerializeObject(responseSendEprescription.Data);
            var result1 = await _prescriptionTaminRepository.SavePrescriptionTaminEdit(headerId1, data1);
        }

        return responseSendEprescription;
    }

    [Route("editrequestprescription")]
    [HttpPost]
    public async Task<ResultRequestEditPrescriptionOutPut> EditEPrescription([FromBody] List<int> prescriptionIds)
    {
        var model = new ResultRequestEditPrescription();

        var responseSendEprescription = new ResultRequestEditPrescriptionOutPut();

        var TaminPrescriptionUpdate = new TaminPrescriptionUpdate();
        var noteDetailEprescIds = "";

        foreach (var id in prescriptionIds)
        {
            var result = await _prescriptionTaminRepository.getPrescriptionTaminInfo(id.ToString());
            var resultAdmissionTamin =
                await _admissionServiceTaminRepository.PrescriptionTaminInfo(id); //  دیتای ویرایش شده در دیتابیس

            var JsonStrEdit =
                await _prescriptionTaminRepository.GetTaminPrescriptionEdit(result
                    .RequestEPrescriptionId); //  دیتای واکشی نسخه از تامین
            if (JsonStrEdit != null && JsonStrEdit != "")
            {
                model.Data = JsonConvert.DeserializeObject<List<GetNoteDetailsEprsc>>(JsonStrEdit);


                foreach (var item in resultAdmissionTamin.PrescriptionServiceLineTamin) // edit
                {
                    noteDetailEprescIds += "," + item.NoteDetailsEprscId;
                    foreach (var modelItem in model.Data)
                        if (Convert.ToInt64(item.NoteDetailsEprscId) == modelItem.NoteDetailsEprscId &&
                            item.SendResult == 1) // این ریزنسخه قبلا ارسال شده
                        {
                            if (resultAdmissionTamin.TaminPrescriptionCategoryId == "1")
                            {
                                if (modelItem.SrvId.WsSrvCode != item.ServiceCode)
                                    modelItem.SrvId.WsSrvCode = item.ServiceCode;


                                if (modelItem.SrvId.SrvCode != item.ServiceCode)
                                    modelItem.SrvId.SrvCode = item.ServiceCode;


                                if (modelItem.DrugInstruction.DrugInstId != item.DrugInstructionId)
                                    modelItem.DrugInstruction.DrugInstId = item.DrugInstructionId;

                                if (modelItem.timesAday.DrugAmntId != item.DrugAmountId)
                                    modelItem.timesAday.DrugAmntId = item.DrugAmountId;

                                if (modelItem.Repeat != item.Repeat.ToString())
                                    modelItem.Repeat = item.Repeat.ToString();

                                if (modelItem.DateDo != PersianDateTime.GetShamsiDate(item.DoDate.ToShortDateString())
                                        .Replace("/", ""))
                                    modelItem.DateDo = PersianDateTime.GetShamsiDate(item.DoDate.ToShortDateString())
                                        .Replace("/", "");

                                if (modelItem.SrvQty != item.ServiceQuantity)
                                    modelItem.SrvQty = item.ServiceQuantity;

                                if (modelItem.Dose != item.Dose)
                                    modelItem.Dose = item.Dose;
                            }
                            else if (resultAdmissionTamin.TaminPrescriptionCategoryId != "1" &&
                                     resultAdmissionTamin.TaminPrescriptionCategoryId != "3")
                            {
                                if (item.TaminPrescriptionTypeId == "2")
                                {
                                    if (modelItem.SrvId.WsSrvCode != item.ServiceCode)
                                        modelItem.SrvId.WsSrvCode = item.ServiceCode;


                                    if (modelItem.SrvId.SrvCode != item.ServiceCode)
                                        modelItem.SrvId.SrvCode = item.ServiceCode;


                                    if (modelItem.SrvId.ParTarefGrp.ParGrpCode != item.ParaclinicTareffGroupId)
                                        modelItem.SrvId.ParTarefGrp.ParGrpCode = item.ParaclinicTareffGroupId;

                                    if (modelItem.SrvQty != item.ServiceQuantity)
                                        modelItem.SrvQty = item.ServiceQuantity;
                                }
                                else if (item.TaminPrescriptionTypeId == "13")
                                {
                                    if (modelItem.SrvId.WsSrvCode != item.ServiceCode)
                                        modelItem.SrvId.WsSrvCode = item.ServiceCode;

                                    if (modelItem.SrvId.SrvCode != item.ServiceCode)
                                        modelItem.SrvId.SrvCode = item.ServiceCode;

                                    if (modelItem.SrvQty != item.ServiceQuantity)
                                        modelItem.SrvQty = item.ServiceQuantity;

                                    if (modelItem.IllnessId != item.illnessId)
                                        modelItem.IllnessId = item.illnessId;

                                    if (modelItem.PlanId != item.planId)
                                        modelItem.PlanId = item.planId;
                                }
                                else
                                {
                                    if (modelItem.SrvId.WsSrvCode != item.ServiceCode)
                                        modelItem.SrvId.WsSrvCode = item.ServiceCode;

                                    if (modelItem.SrvId.SrvCode != item.ServiceCode)
                                        modelItem.SrvId.SrvCode = item.ServiceCode;

                                    if (modelItem.SrvQty != item.ServiceQuantity)
                                        modelItem.SrvQty = item.ServiceQuantity;
                                }
                            }
                        }
                }

                var addDetails = new GetNoteDetailsEprsc();

                if (resultAdmissionTamin.PrescriptionServiceLineTamin.Count >= model.Data.Count) // new
                    foreach (var item in resultAdmissionTamin.PrescriptionServiceLineTamin)
                        if (item.NoteDetailsEprscId == null)
                        {
                            var srv = new GetSrvIdInfo();
                            var srvType = new GetSrvType();
                            var drugInstructionInfo = new GetDrugInstructionInfo();
                            var gettimesAday = new GettimesAdayInfo();
                            var getParTaref = new GetParTarefGrp();
                            srvType.SrvType = item.TaminPrescriptionTypeId;
                            srv.SrvType = srvType;
                            srv.WsSrvCode = item.ServiceCode;
                            srv.SrvCode = item.ServiceCode;
                            srv.SrvId = item.ServiceId;
                            getParTaref.ParGrpCode = item.ParaclinicTareffGroupId;

                            if (resultAdmissionTamin.TaminPrescriptionCategoryId == "1")
                            {
                                drugInstructionInfo.DrugInstId = item.DrugInstructionId;
                                gettimesAday.DrugAmntId = item.DrugAmountId;

                                addDetails.SrvId = srv;
                                addDetails.DrugInstruction = drugInstructionInfo;
                                addDetails.timesAday = gettimesAday;
                                addDetails.Repeat = item.Repeat.ToString();
                                addDetails.DateDo = PersianDateTime.GetShamsiDate(item.DoDate.ToShortDateString())
                                    .Replace("/", "");
                                addDetails.SrvQty = item.ServiceQuantity;
                                addDetails.Dose = item.Dose;
                                addDetails.NoteDetailsEprscId = null;
                            }

                            else if (resultAdmissionTamin.TaminPrescriptionCategoryId != "1" &&
                                     resultAdmissionTamin.TaminPrescriptionCategoryId != "3")
                            {
                                if (resultAdmissionTamin.PrescriptionServiceLineTamin.FirstOrDefault()
                                        .TaminPrescriptionTypeId == "2")
                                {
                                    srv.ParTarefGrp = getParTaref;
                                    addDetails.SrvId = srv;
                                    addDetails.SrvQty = item.ServiceQuantity;
                                    addDetails.NoteDetailsEprscId = null;
                                }

                                else if (resultAdmissionTamin.PrescriptionServiceLineTamin.FirstOrDefault()
                                             .TaminPrescriptionTypeId == "13")
                                {
                                    addDetails.SrvId = srv;
                                    addDetails.SrvQty = item.ServiceQuantity;
                                    addDetails.IllnessId = item.illnessId;
                                    addDetails.PlanId = item.planId;
                                    addDetails.NoteDetailsEprscId = null;
                                }

                                else
                                {
                                    addDetails.SrvId = srv;
                                    addDetails.SrvQty = item.ServiceQuantity;
                                    addDetails.NoteDetailsEprscId = null;
                                }
                            }
                        }

                //delete
                //  List<string> noteDetailEprescIdsArr =new List<string>();
                if (resultAdmissionTamin.PrescriptionServiceLineTamin.Count <= model.Data.Count)
                    foreach (var mItem in model.Data.ToList())
                        if (!noteDetailEprescIds.Contains(mItem.NoteDetailsEprscId.ToString()))
                            //noteDetailEprescIdsArr.Add(mItem.NoteDetailsEprscId.ToString());
                            model.Data.Remove(mItem);
                model.Data.Add(addDetails);

                var companyId = UserClaims.GetCompanyId();
                var token = await _authorizationParaClinicService.GetTokenParaClinic(companyId, "0");

                responseSendEprescription = await _requestEprescriptionParaClinicService.EditEPrescription(model.Data,
                    result.RequestEPrescriptionId, result.MSC, result.OTPCode, token, companyId);
                if (responseSendEprescription.Status == 401)
                {
                    var deleteTokenResult =
                        _manageTaminTokenRepository.DeleteToken((byte)Enum.TaminTokenType.RequestPrescription,
                            companyId, "0");

                    return responseSendEprescription;
                }

                if (responseSendEprescription.Status == 200 && responseSendEprescription.Data != null
                                                            && (responseSendEprescription.Data.ErrMessage == null ||
                                                                responseSendEprescription.Data.ErrMessage == ""))
                {
                    TaminPrescriptionUpdate.PrescriptionId = Convert.ToInt32(id);
                    TaminPrescriptionUpdate.OTPCode = result.OTPCode;
                    TaminPrescriptionUpdate.RequestEPrescriptionId = result.RequestEPrescriptionId;
                    TaminPrescriptionUpdate.TrackingCode = result.TrackingCode;
                    TaminPrescriptionUpdate.SendResult = 3;
                    TaminPrescriptionUpdate.SendDateTime = DateTime.Now;
                    var resultUpdate =
                        await _admissionTaminWebServiceRepository.UpdateResultSendPrescriptionTamin(
                            TaminPrescriptionUpdate);
                    return responseSendEprescription;
                }
            }
        }

        return responseSendEprescription;
    }

    [Route("deleterequestprescription")]
    [HttpPost]
    public async Task<ResultRequestRemoveEPrescription> DeleteEPrescription(
        [FromBody] TaminDeleteEPrescriptionModel model)
    {
        var responseSendEprescription = new ResultRequestRemoveEPrescription();
        var TaminPrescriptionUpdate = new TaminPrescriptionUpdate();


        var companyId = UserClaims.GetCompanyId();
        var token = await _authorizationParaClinicService.GetTokenParaClinic(companyId, "0");

        foreach (var id in model.Ids)
        {
            var result = await _prescriptionTaminRepository.getPrescriptionTaminInfo(id);
            responseSendEprescription = await _requestEprescriptionParaClinicService.DeleteEPrescription(
                result.RequestEPrescriptionId, result.MSC
                , model.OtpCode == null || model.OtpCode == "" ? result.OTPCode : model.OtpCode, token, companyId);

            if (responseSendEprescription.Status == 401)
            {
                var deleteTokenResult =
                    _manageTaminTokenRepository.DeleteToken((byte)Enum.TaminTokenType.RequestPrescription, companyId,
                        "0");

                return responseSendEprescription;
            }

            if (responseSendEprescription.Status == 200 && (responseSendEprescription.Data.ErrMessage == null ||
                                                            responseSendEprescription.Data.ErrMessage == ""))
            {
                TaminPrescriptionUpdate.PrescriptionId = Convert.ToInt32(id);
                TaminPrescriptionUpdate.OTPCode =
                    model.OtpCode == null || model.OtpCode == "" ? result.OTPCode : model.OtpCode;
                TaminPrescriptionUpdate.SendResult = 4;
                TaminPrescriptionUpdate.SendDateTime = DateTime.Now;
                var resultUpdate =
                    await _admissionTaminWebServiceRepository
                        .UpdateResultSendPrescriptionTamin(TaminPrescriptionUpdate);
            }
        }

        return responseSendEprescription;
    }
}