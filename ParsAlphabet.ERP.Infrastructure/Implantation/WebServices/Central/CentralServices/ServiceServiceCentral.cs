using System.Net;
using ERPCentral.Interface.App.Application.Medical.Service;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralServices;

public class ServiceServiceCentral : IServiceServiceCentral
{
    private readonly ICentralTokenService _centralTokenService;
    private readonly IService_Service _service_Service;
    private readonly ITokenRepository _tokenRepository;

    public ServiceServiceCentral(IService_Service service_Service, ICentralTokenService centralTokenService
        , ITokenRepository tokenRepository)
    {
        _service_Service = service_Service;
        _centralTokenService = centralTokenService;
        _tokenRepository = tokenRepository;
    }

    public async Task<HttpResult<ResultQuery>> ServiceCentral(CentralService model)
    {
        var result = new HttpResult<ResultQuery>();

        var validation = await ServiceValidation(model);

        if (validation.Count > 0)
        {
            result.ValidationErrors = validation;
            result.HttpStatus = HttpStatusCode.NotAcceptable;
            return result;
        }

        var tokenModel = await _centralTokenService.GetTokenModel();

        var token = await _centralTokenService.GetToken(tokenModel);

        if (!string.IsNullOrEmpty(token.Token))
        {
            result = await _service_Service.SendService(model, token.Token);

            if (result.HttpStatus == HttpStatusCode.Unauthorized || result.HttpStatus == HttpStatusCode.BadRequest)
            {
                await _tokenRepository.DeleteToken(token.Id);

                result.StatusMessage = "error";
                result.HttpStatus = HttpStatusCode.Unauthorized;
                result.Successfull = false;
                result.Data = null;
            }
            else if (result.HttpStatus == HttpStatusCode.Forbidden)
            {
                result.StatusMessage = "unauthorize";
                result.HttpStatus = HttpStatusCode.Unauthorized;
                result.Successfull = false;
                result.Data = null;
            }
        }
        else
        {
            result.StatusMessage = "error";
            result.HttpStatus = HttpStatusCode.Unauthorized;
            result.Successfull = false;
            result.Data = null;
        }

        return result;
    }

    private async Task<List<string>> ServiceValidation(CentralService model)
    {
        var errors = new List<string>();

        if (model == null)
        {
            errors.Add("موردی برای ارسال وجود ندارد");
            return errors;
        }

        await Task.Run(() =>
        {
            if (model.OnlineName.IsNullOrEmptyOrWhiteSpace())
                errors.Add("نام آنلاین خدمت الزامی است");

            if (model.ServiceTypeId == 0)
                errors.Add(" نوع خدمت الزامی است");
        });

        return errors;
    }
}