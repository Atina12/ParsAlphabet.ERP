using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos._History;
using ParsAlphabet.ERP.Application.Dtos._PcPos;
using ParsAlphabet.ERP.Application.Dtos.FM.PosPayment;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;
using ParsAlphabet.ERP.Infrastructure.Implantation._History;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Cashier;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.PosPayment;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParseAlphabet.ERP.Web.Modules._PcPos;

[Route("api/FM/PCPOS/Behpardakht/[controller]")]
[ApiController]
[EnableCors("PosBehpardakht")]
public class PcPosBehpardakhtApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IAdmissionCounterRepository _admissionCounterRepository;
    private readonly CashierRepository _cashierRepository;
    private readonly IErrorLogRepository _errorLogRepository;
    private readonly HistoryRepository _history;
    private readonly IHttpClientFactory _httpClient;
    private readonly PosPaymentRepository _posPaymentRepository;

    public PcPosBehpardakhtApiController(IHttpClientFactory httpClient, CashierRepository cashierRepository,
        IAdmissionCounterRepository admissionCounterRepository,
        HistoryRepository history, IHttpContextAccessor accessor,
        PosPaymentRepository posPaymentRepository,
        IErrorLogRepository errorLogRepository)
    {
        _httpClient = httpClient;

        _cashierRepository = cashierRepository;
        _admissionCounterRepository = admissionCounterRepository;
        _history = history;
        _errorLogRepository = errorLogRepository;
        _accessor = accessor;
        _posPaymentRepository = posPaymentRepository;
    }


    [HttpPost]
    [Route("payment")]
    [AllowAnonymous]
    public async Task<MyResultDataStatus<ResultPcPos>> PaymentWithPcPos([FromBody] PcPosModel posModel)
    {
        try
        {
            var userAgent = new UserAgent(Request.Headers["User-Agent"]);
            var beh = new CallBehPardakht();
            var resultPcPos = new ResultPcPos();
            short branchId = 0;


            if (!ModelState.IsValid)
                return ModelState.ToMyResultDataStatus<ResultPcPos>();

            var companyId = 1;
            if (posModel.PosId > 0)
            {
                var userId = UserClaims.GetUserId();
                ;

                var counter = await _admissionCounterRepository.GetRecordByUserId(userId, companyId);

                if (!counter.Data.NotNull())
                    return new MyResultDataStatus<ResultPcPos>
                    {
                        Successfull = false,
                        ValidationErrors = new List<string> { $"غرفه با IP : {MyClaim.IpAddress} در سیستم تعریف نشده" }
                    };

                branchId = counter.Data.BranchId;
                beh.baseUrl = MyClaim.IpAddress;
                //beh.baseUrl = "localhost";
            }
            else
            {
                var cashier = await _cashierRepository.GetRecordByIpAddress(MyClaim.IpAddress, companyId);

                if (cashier.Data.NotNull() && cashier.Data.Id > 0)
                {
                    branchId = cashier.Data.BranchId;

                    posModel.PosId = cashier.Data.PosList.ListHasRow() ? cashier.Data.PosList[0].Id : 0;
                    if (posModel.PosId == 0)
                        return new MyResultDataStatus<ResultPcPos>
                        {
                            Successfull = false,
                            ValidationErrors = new List<string>
                            {
                                $"کیوسک با IP : {MyClaim.IpAddress} اطلاعات پوز ثبت نشده است ، مجاز به ثبت نمی باشید ، به مدیر سیستم اطلاع دهید"
                            }
                        };

                    beh.baseUrl = MyClaim.IpAddress;
                    //beh.baseUrl = "localhost";
                }
                else
                {
                    return new MyResultDataStatus<ResultPcPos>
                    {
                        Successfull = false,
                        ValidationErrors = new List<string>
                        {
                            $"کیوسک با IP : {MyClaim.IpAddress} در سیستم تعریف نشده ، مجاز به ثبت نمی باشید ، به مدیر سیستم اطلاع دهید"
                        }
                    };
                }
            }

            var client = new HttpClientRequest(_httpClient);

            var payment = new Payment();
            payment.ServiceCode = "1";
            payment.Amount = posModel.Amount.ToString();
            payment.PayerId = posModel.PayerId;
            payment.PcId = posModel.PcId;
            payment.MerchantMsg = "";
            payment.MerchantadditionalData = "";

            var resultRequest = string.Empty;
            MyClaim.Init(_accessor);

            if (!string.IsNullOrEmpty(beh.baseUrl))
            {
                var responseResult = new ResponseResult();

                responseResult = await client.OnPost(beh.baseUrl, beh.apiUrl, JsonConvert.SerializeObject(payment),
                    "application/json", null);

                if (responseResult.StatusCode == HttpStatusCode.BadRequest)
                {
                    var historyModel = new HistoryModel
                    {
                        ControllerName = nameof(PcPosBehpardakhtApiController),
                        ActionName = nameof(PaymentWithPcPos),
                        Browser = userAgent.Browser.NameAndVersion,
                        CompanyId = companyId,
                        Description = $"baseurl:{beh.baseUrl + beh.apiUrl},catch:{responseResult.ResponseContent}",
                        UserId = 1,
                        IpAddress = MyClaim.IpAddress,
                        OperatingSystem = userAgent.OS.NameAndVersion
                    };

                    await _history.Insert(historyModel);

                    return new MyResultDataStatus<ResultPcPos>
                    {
                        Successfull = false,
                        ValidationErrors = new List<string>
                        {
                            "درخواست ارسال به پوز معتبر نمی باشد، سرویس را اجرا نمایید"
                        }
                    };
                }

                var historyModel1 = new HistoryModel
                {
                    ControllerName = nameof(PcPosBehpardakhtApiController),
                    ActionName = nameof(PaymentWithPcPos),
                    Browser = userAgent.Browser.NameAndVersion,
                    CompanyId = companyId,
                    Description = $"baseurl:{beh.baseUrl},answerpos:{JsonConvert.SerializeObject(responseResult)}",
                    UserId = 1,
                    IpAddress = MyClaim.IpAddress,
                    OperatingSystem = userAgent.OS.NameAndVersion
                };

                await _history.Insert(historyModel1);

                resultRequest = responseResult.ResponseContent;
            }
            else
            {
                return new MyResultDataStatus<ResultPcPos>
                {
                    Successfull = false,
                    ValidationErrors = new List<string>
                    {
                        "تنظیمات پوز به درستی انجام نشده، لطفا به مدیر سیستم اطلاع دهید"
                    }
                };
            }


            var status = 0;

            if (string.IsNullOrEmpty(resultRequest))
                status = 500;
            else
                status = 200;


            resultPcPos = JsonConvert.DeserializeObject<ResultPcPos>(resultRequest);
            resultPcPos.PosId = posModel.PosId;
            resultPcPos.BranchId = branchId;
            if (!string.IsNullOrEmpty(resultRequest) && !string.IsNullOrEmpty(resultPcPos.TraceNumber) &&
                resultPcPos.TraceNumber != "0")
            {
                var posPayment = new PosPaymentModel();

                posPayment.RefNo = resultPcPos.TraceNumber;
                posPayment.CardNo = "";
                posPayment.AccountNo = resultPcPos.AccountNo;
                posPayment.Amount = resultPcPos.TotalAmount;
                posPayment.PosId = posModel.PosId;
                posPayment.TerminalNo = resultPcPos.TerminalNo;
                posPayment.PaymentId = posModel.PayerId;
                await _posPaymentRepository.Insert(posPayment);
            }

            return new MyResultDataStatus<ResultPcPos>
            {
                Successfull = status == 200,
                ValidationErrors = new List<string>
                    { status == 200 ? "عملیات با موفقیت انجام شد" : "عملیات با خطا مواجه شد" },
                Status = status,
                Data = resultPcPos
            };
        }
        catch (Exception ex)
        {
            await _errorLogRepository.Insert(ex.ToString(), 1, MyClaim.IpAddress, "PcPosBehpardakhtApi/payment");

            return new MyResultDataStatus<ResultPcPos>
            {
                Successfull = false,
                ValidationErrors = new List<string> { "ارتباط با پی سی پوز برقرار نمی باشد، سرویس را اجرا نمایید" }
            };
        }
    }
}