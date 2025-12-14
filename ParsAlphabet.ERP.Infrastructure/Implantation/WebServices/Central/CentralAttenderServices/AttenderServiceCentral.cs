using System.Net;
using ERPCentral.Interface.App.Application.Medical.Attender;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralAttenderServices;

public class AttenderServiceCentral : IAttenderServiceCentral
{
    private readonly IAttenderService _attenderService;
    private readonly ICentralTokenService _centralTokenService;
    private readonly ITokenRepository _tokenRepository;

    public AttenderServiceCentral(IAttenderService attenderService, ICentralTokenService centralTokenService
        , ITokenRepository tokenRepository)
    {
        _attenderService = attenderService;
        _centralTokenService = centralTokenService;
        _tokenRepository = tokenRepository;
    }

    public async Task<HttpResult<ResultQuery>> AttenderCentral(CentralAttender model)
    {
        var result = new HttpResult<ResultQuery>();

        var tokenModel = await _centralTokenService.GetTokenModel();

        var token = await _centralTokenService.GetToken(tokenModel);

        if (!string.IsNullOrEmpty(token.Token))
        {
            result = await _attenderService.SendAttender(model, token.Token);

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
}