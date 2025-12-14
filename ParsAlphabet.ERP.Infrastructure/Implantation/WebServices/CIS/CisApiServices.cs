using System.Security.Claims;
using ERPCentral.Interface.App.CallRequest;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.WebService.Api.Model.CIS;
using ParsAlphabet.WebService.Api.Model.LIS.LaboratoryModel;
using static ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest.CallWebService;

namespace ParseAlphabet.ERP.Web.WebServices.CIS;

public class CisApiServices
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IHttpClientFactory _clientFactory;
    private readonly IConfiguration _configuration;

    private readonly IErrorLogRepository _errorLogRepository;

    public CisApiServices(
        IErrorLogRepository errorLogRepository,
        IHttpContextAccessor accessor,
        IConfiguration configuration,
        IHttpClientFactory clientFactory)
    {
        _errorLogRepository = errorLogRepository;
        _accessor = accessor;
        _configuration = configuration;
        _clientFactory = clientFactory;
    }

    public async Task<MyResultDataStatus<ReferPatientRecord_Result>> SendReferralPatientRecord(
        SendReferralPatientRecordInputModel model)
    {
        var result = new MyResultDataStatus<ReferPatientRecord_Result>
        {
            Data = new ReferPatientRecord_Result()
        };


        try
        {
            var client = new HttpClientRequest(_clientFactory);

            var stringContent = JsonConvert.SerializeObject(model);
            var resultModel = await client.OnPost(ApiCIS.baseUrl, ApiCIS.Referral.SendReferralUrl, stringContent,
                "application/json", null);

            result.Data = JsonConvert.DeserializeObject<ReferPatientRecord_Result>(resultModel.ResponseContent);
            result.Status = (int)resultModel.StatusCode;


            if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) &&
                !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
            {
                result.Successfull = true;
                result.Status = 100;
                result.StatusMessage = "عملیات با موفقیت انجام شد";
            }
            else
            {
                result.Status = result.Data.ErrorStatus;
                result.StatusMessage = result.Data.ErrorMessage;
                result.Successfull = false;
            }
        }
        catch (Exception ex)
        {
            MyClaim.Init(_accessor);

            var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
            var userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

            string messageError;

            if (bool.Parse(errorLogIsComplete))
                messageError = ex.ToString();
            else
                messageError = ex.Message;

            if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -103;
            }
            else
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -102;
            }

            result.Successfull = false;

            await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress,
                "/wcf/WebService/SendReferralPatientRecord");
        }

        return result;
    }

    public async Task<MyResultDataStatus<GetReferralPatientRecord_Result>> GetReferralPatientRecord(HID hidInfo)
    {
        var result = new MyResultDataStatus<GetReferralPatientRecord_Result>
        {
            Data = new GetReferralPatientRecord_Result()
        };

        try
        {
            var hid = new HID
            {
                Id = hidInfo.Id,
                AssignerCode = hidInfo.AssignerCode
            };

            var client = new HttpClientRequest(_clientFactory);

            var stringContent = JsonConvert.SerializeObject(hidInfo);
            var resultModel = await client.OnPost(ApiCIS.baseUrl, ApiCIS.Referral.GetReferralUrl, stringContent,
                "application/json", null);

            result.Data = JsonConvert.DeserializeObject<GetReferralPatientRecord_Result>(resultModel.ResponseContent);

            if (result == null)
            {
                result.Data.ErrorMessage = "پاسخ وب سرویس حاوی اطلاعات نمی باشد .";
                result.Data.ErrorStatus = -100;
            }
            else
            {
                result.Successfull = true;
                result.Status = 100;
                result.StatusMessage = "عملیات با موفقیت انجام شد";
            }
        }
        catch (Exception ex)
        {
            MyClaim.Init(_accessor);

            var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
            var userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

            string messageError;

            if (bool.Parse(errorLogIsComplete))
                messageError = ex.ToString();
            else
                messageError = ex.Message;

            if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -103;
            }
            else
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -102;
            }

            result.Successfull = false;

            await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress,
                "/wcf/WebService/GetReferralPatientRecord");
        }

        return result;
    }

    public async Task<MyResultDataStatus<SendFeedbackPatientRecord_Result>> SendFeedbackPatientRecord(
        SendFeedbackPatientRecordInputModel model)
    {
        var result = new MyResultDataStatus<SendFeedbackPatientRecord_Result>
        {
            Data = new SendFeedbackPatientRecord_Result()
        };

        try
        {
            var client = new HttpClientRequest(_clientFactory);

            var stringContent = JsonConvert.SerializeObject(model);
            var ResultModel = await client.OnPost(ApiCIS.baseUrl, ApiCIS.FeedBack.SendFeedbackUrl, stringContent,
                "application/json", null);

            result.Data = JsonConvert.DeserializeObject<SendFeedbackPatientRecord_Result>(ResultModel.ResponseContent);
            result.Status = (int)ResultModel.StatusCode;


            if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) &&
                !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
            {
                result.Successfull = true;
                result.Status = 100;
                result.StatusMessage = "عملیات با موفقیت انجام شد";
            }
            else
            {
                result.Status = result.Data.ErrorStatus;
                result.StatusMessage = result.Data.ErrorMessage;
                result.Successfull = false;
            }
        }
        catch (Exception ex)
        {
            MyClaim.Init(_accessor);

            var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
            var userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

            string messageError;

            if (bool.Parse(errorLogIsComplete))
                messageError = ex.ToString();
            else
                messageError = ex.Message;

            if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -103;
            }
            else
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -102;
            }

            result.Successfull = false;

            await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress,
                "/wcf/WebService/SendFeedBackPatientRecord");
        }

        return result;
    }

    public async Task<MyResultDataStatus<GetFeedbackPatientRecord_Result>> GetFeedbackPatientRecord(HID hid)
    {
        var result = new MyResultDataStatus<GetFeedbackPatientRecord_Result>
        {
            Data = new GetFeedbackPatientRecord_Result()
        };

        try
        {
            var client = new HttpClientRequest(_clientFactory);

            var stringContent = JsonConvert.SerializeObject(hid);
            var ResultModel = await client.OnPost(ApiCIS.baseUrl, ApiCIS.FeedBack.GetFeedbackUrl, stringContent,
                "application/json", null);

            result.Data = JsonConvert.DeserializeObject<GetFeedbackPatientRecord_Result>(ResultModel.ResponseContent);
            result.Status = (int)ResultModel.StatusCode;


            if (string.IsNullOrEmpty(result.Data.ErrorMessage))
            {
                result.Successfull = true;
                result.Status = 100;
                result.StatusMessage = "عملیات با موفقیت انجام شد";
            }
            else
            {
                result.Status = result.Data.ErrorStatus;
                result.StatusMessage = result.Data.ErrorMessage;
                result.Successfull = false;
            }
        }
        catch (Exception ex)
        {
            MyClaim.Init(_accessor);

            var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
            var userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

            string messageError;

            if (bool.Parse(errorLogIsComplete))
                messageError = ex.ToString();
            else
                messageError = ex.Message;

            if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -103;
            }
            else
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -102;
            }

            result.Successfull = false;

            await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress,
                "/wcf/WebService/GetFeedbackPatientRecord");
        }

        //ws.Abort();
        return result;
    }

    public async Task<MyResultDataStatus<SaveDentalCase_Result>> SaveDentalCase(SaveDentalCaseInputModel model)
    {
        var result = new MyResultDataStatus<SaveDentalCase_Result>
        {
            Data = new SaveDentalCase_Result()
        };

        try
        {
            var client = new HttpClientRequest(_clientFactory);

            var stringContent = JsonConvert.SerializeObject(model);
            var ResultModel = await client.OnPost(ApiCIS.baseUrl, ApiCIS.Dental.SaveDentalCaseUrl, stringContent,
                "application/json", null);

            result.Data = JsonConvert.DeserializeObject<SaveDentalCase_Result>(ResultModel.ResponseContent);
            result.Status = (int)ResultModel.StatusCode;


            if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) &&
                !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
            {
                result.Successfull = true;
                result.Status = 100;
                result.StatusMessage = "عملیات با موفقیت انجام شد";
            }
            else
            {
                result.Status = result.Data.ErrorStatus;
                result.StatusMessage = result.Data.ErrorMessage;
                result.Successfull = false;
            }
        }
        catch (Exception ex)
        {
            MyClaim.Init(_accessor);

            var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
            var userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

            string messageError;

            if (bool.Parse(errorLogIsComplete))
                messageError = ex.ToString();
            else
                messageError = ex.Message;

            if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -103;
            }
            else
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -102;
            }

            result.Successfull = false;

            await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/SaveDentalCase");
        }

        return result;
    }

    public async Task<MyResultDataStatus<SaveDeathCertificate_Result>> SaveDeathCetificateRecord(
        SaveDeathCertificateInputModel model)
    {
        var result = new MyResultDataStatus<SaveDeathCertificate_Result>
        {
            Data = new SaveDeathCertificate_Result()
        };

        try
        {
            var client = new HttpClientRequest(_clientFactory);

            var stringContent = JsonConvert.SerializeObject(model);
            var ResultModel = await client.OnPost(ApiCIS.baseUrl, ApiCIS.Death.SaveDeathCaseUrl, stringContent,
                "application/json", null);

            result.Data = JsonConvert.DeserializeObject<SaveDeathCertificate_Result>(ResultModel.ResponseContent);
            result.Status = (int)ResultModel.StatusCode;


            if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) &&
                !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
            {
                result.Successfull = true;
                result.Status = 100;
                result.StatusMessage = "عملیات با موفقیت انجام شد";
            }
            else
            {
                result.Status = result.Data.ErrorStatus;
                result.StatusMessage = result.Data.ErrorMessage;
                result.Successfull = false;
            }
        }
        catch (Exception ex)
        {
            MyClaim.Init(_accessor);

            var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
            var userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

            string messageError;

            if (bool.Parse(errorLogIsComplete))
                messageError = ex.ToString();
            else
                messageError = ex.Message;

            if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -103;
            }
            else
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -102;
            }

            result.Successfull = false;

            await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress,
                "/wcf/WebService/SendReferralPatientRecord");
        }

        //ws.Abort();
        return result;
    }

    public async Task<MyResultDataStatus<SaveLaboratory_Result>> SendLaboratory(LaboratoryModel laboratory)
    {
        var result = new MyResultDataStatus<SaveLaboratory_Result>
        {
            Data = new SaveLaboratory_Result()
        };

        try
        {
            var client = new HttpClientRequest(_clientFactory);

            var stringContent = JsonConvert.SerializeObject(laboratory);
            var labSaveUrl = $"{ApiLIS.LabApiUrl}/{ApiLIS.saveLabApi}";

            var resultModel = await client.OnPost(ApiLIS.baseUrl, labSaveUrl, stringContent, "application/json", null);

            result.Data = JsonConvert.DeserializeObject<SaveLaboratory_Result>(resultModel.ResponseContent);
            result.Status = (int)resultModel.StatusCode;


            if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) &&
                !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
            {
                result.Successfull = true;
                result.Status = 100;
                result.StatusMessage = "عملیات با موفقیت انجام شد";
            }
            else
            {
                result.Status = result.Data.ErrorStatus;
                result.StatusMessage = result.Data.ErrorMessage;
                result.Successfull = false;
            }
        }
        catch (Exception ex)
        {
            MyClaim.Init(_accessor);

            var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
            var userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

            string messageError;

            if (bool.Parse(errorLogIsComplete))
                messageError = ex.ToString();
            else
                messageError = ex.Message;

            if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -103;
            }
            else
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -102;
            }

            result.Successfull = false;

            await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/SendLaboratory");
        }

        //ws.Abort();
        return result;
    }

    public async Task<MyResultDataStatus<SaveLaboratory_Result>> SendPathology(PathologyModel laboratory)
    {
        var result = new MyResultDataStatus<SaveLaboratory_Result>
        {
            Data = new SaveLaboratory_Result()
        };

        try
        {
            var client = new HttpClientRequest(_clientFactory);

            var stringContent = JsonConvert.SerializeObject(laboratory);
            var labSaveUrl = $"{ApiLIS.LabApiUrl}/{ApiLIS.saveLabApi}";

            var resultModel = await client.OnPost(ApiLIS.baseUrl, labSaveUrl, stringContent, "application/json", null);

            result.Data = JsonConvert.DeserializeObject<SaveLaboratory_Result>(resultModel.ResponseContent);
            result.Status = (int)resultModel.StatusCode;


            if (string.IsNullOrEmpty(result.Data.ErrorMessage) && !string.IsNullOrEmpty(result.Data.MessageUID) &&
                !string.IsNullOrEmpty(result.Data.CompositionUID) && !string.IsNullOrEmpty(result.Data.patientUID))
            {
                result.Successfull = true;
                result.Status = 100;
                result.StatusMessage = "عملیات با موفقیت انجام شد";
            }
            else
            {
                result.Status = result.Data.ErrorStatus;
                result.StatusMessage = result.Data.ErrorMessage;
                result.Successfull = false;
            }
        }
        catch (Exception ex)
        {
            MyClaim.Init(_accessor);

            var errorLogIsComplete = _configuration.GetValue<string>("ErrorLogs:IsComplete");
            var userId = int.Parse(_accessor.HttpContext.User.FindFirstValue("UserId"));

            string messageError;

            if (bool.Parse(errorLogIsComplete))
                messageError = ex.ToString();
            else
                messageError = ex.Message;

            if (ex.Message.ToLower().StartsWith("the request channel timed out attempting to "))
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -103;
            }
            else
            {
                result.StatusMessage = "خطا در ارتباط با وب سرویس";
                result.Status = -102;
            }

            result.Successfull = false;

            await _errorLogRepository.Insert(messageError, userId, MyClaim.IpAddress, "/wcf/WebService/SendPathology");
        }

        //ws.Abort();
        return result;
    }
}