using System.Net;
using ERPCentral.Interface.App.Application.Medical.AdmissionService;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.Central.CentralAdmissionService;

public class AdmissionServiceCentral : IAdmissionServiceCentral
{
    private readonly IAdmissionService _admissionService;
    private readonly ICentralTokenService _centralTokenService;
    private readonly ITokenRepository _tokenRepository;

    public AdmissionServiceCentral(IAdmissionService admissionService, ICentralTokenService centralTokenService
        , ITokenRepository tokenRepository)
    {
        _admissionService = admissionService;
        _centralTokenService = centralTokenService;
        _tokenRepository = tokenRepository;
    }

    public async Task<HttpResult<ResultQuery>> AdmissionSrviceReturn(int admissionId)
    {
        var result = new HttpResult<ResultQuery>();

        var tokenModel = await _centralTokenService.GetTokenModel();

        var token = await _centralTokenService.GetToken(tokenModel);

        if (!string.IsNullOrEmpty(token.Token))
        {
            result = await _admissionService.AdmissionReturnService(admissionId, token.Token);

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