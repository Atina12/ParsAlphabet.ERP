using System.Net;
using ERPCentral.Interface.App.Application.Medical.AttenderService;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralAttenderServiceService;

public class AttenderServiceServiceCentral : IAttenderServiceServiceCentral
{
    private readonly IAttenderServiceService _attenderServiceService;
    private readonly ICentralTokenService _centralTokenService;
    private readonly ITokenRepository _tokenRepository;

    public AttenderServiceServiceCentral(IAttenderServiceService attenderServiceService,
        ICentralTokenService centralTokenService
        , ITokenRepository tokenRepository)
    {
        _attenderServiceService = attenderServiceService;
        _centralTokenService = centralTokenService;
        _tokenRepository = tokenRepository;
    }

    public async Task<HttpResult<ResultQuery>> AttenderServiceCentral(CentralAttenderService model)
    {
        var result = new HttpResult<ResultQuery>();

        var validation = await ValidationAttenderService(model);

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
            result = await _attenderServiceService.SendAttenderService(model, token.Token);
            if (result.HttpStatus == HttpStatusCode.Unauthorized)
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

    private async Task<List<string>> ValidationAttenderService(CentralAttenderService model)
    {
        var errors = new List<string>();

        if (!model.NotNull())
        {
            errors.Add("موردی برای ارسال وجود ندارد");
            return errors;
        }

        await Task.Run(() =>
        {
            if (model.CompanyId == 0)
                errors.Add(" شناسه مرکز الزامی است");

            if (model.ServiceId == 0)
                errors.Add(" شناسه خدمت الزامی است");

            if (model.MedicalSubjectId == 0)
                errors.Add("موضوع درمان الزامی است");

            if (model.AttenderId == 0)
                errors.Add("طبیب الزامی است");
        });
        return errors;
    }
}