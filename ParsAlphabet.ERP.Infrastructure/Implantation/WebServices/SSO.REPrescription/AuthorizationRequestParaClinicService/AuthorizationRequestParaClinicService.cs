using System.Net;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.ManageRequestPrescriptionTamin;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO.REPrescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ManageRequestPrescriptionTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;
using ParsAlphabet.WebService.Api.Model.Tamin.RequestEPrescription;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.SSO.REPrescription.
    AuthorizationRequestParaClinicService;

public class AuthorizationRequestParaClinicService : IAuthorizationRequestParaClinicService
{
    private readonly IAdmissionsRepository _admissionsRepository;

    private readonly IHttpClientFactory _clientFactory;
    private readonly ManageRequestPrescriptionTaminRepository _manageTaminTokenRepository;

    public AuthorizationRequestParaClinicService(
        IHttpClientFactory clientFactory,
        ManageRequestPrescriptionTaminRepository manageTaminTokenRepository,
        IAdmissionsRepository admissionsRepository, IMemoryCache cache)
    {
        _clientFactory = clientFactory;
        _manageTaminTokenRepository = manageTaminTokenRepository;
        _admissionsRepository = admissionsRepository;
    }

    public async Task<ResultRequest<string>> ParaclinicAutorization(int companyId, string paraClinicTypeId)
    {
        var result = new ResultRequest<string>();

        var client = new HttpClientRequest(_clientFactory);

        var url = CallWebService.ApiSSOREPrescription.Authorization.getToken;

        var setupInfo =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.RequestPrescription, "0");

        var setupClientTamin = new
        {
            client_id = setupInfo.SoftwareClientId,
            secret = setupInfo.SoftwareClientSecret,
            setupInfo.ServiceFullUrl
        };

        var content = JsonConvert.SerializeObject(setupClientTamin);

        var responseRequest =
            await client.OnPost(setupClientTamin.ServiceFullUrl, url, content, "application/json", null);

        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<ResultRequest<string>>(responseRequest.ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }


    public async Task<string> GetTokenParaClinic(int companyId, string paraClinicTypeId)
    {
        var token = await _manageTaminTokenRepository.GetToken(companyId, (byte)TaminTokenType.RequestPrescription);

        if (string.IsNullOrEmpty(token))
        {
            var resultToken = await ParaclinicAutorization(companyId, paraClinicTypeId);

            var tokenData = JsonConvert.DeserializeObject<AuthorizationOutPutToken>(resultToken.Data);

            var taminToken = new ManageRequestPrescriptionTaminModel
            {
                CompanyId = companyId,
                TokenDateTime = resultToken.DateTime,
                TokenId = tokenData.Data,
                TokenType = (byte)TaminTokenType.RequestPrescription,
                ParaClinicTypeId = paraClinicTypeId
            };

            await _manageTaminTokenRepository.Save(taminToken);

            token = tokenData.Data;
        }

        return token;
    }
}