using System.Net;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.ManageParaclinicTamin;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ManageParaclinicTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;
using ParsAlphabet.WebService.Api.Model.Tamin.Authentication;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParseAlphabet.ERP.Web.WebServices.SSO.AuthorizationParaClinicService;

public class AuthorizationParaClinicService : IAuthorizationParaClinicService
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IHttpClientFactory _clientFactory;
    private readonly ManageTaminTokenRepository _manageTaminTokenRepository;

    public AuthorizationParaClinicService(
        IHttpClientFactory clientFactory,
        ManageTaminTokenRepository manageTaminTokenRepository,
        IAdmissionsRepository admissionsRepository)
    {
        _clientFactory = clientFactory;
        _manageTaminTokenRepository = manageTaminTokenRepository;
        _admissionsRepository = admissionsRepository;
    }

    public async Task<ResultRequest<string>> ParaclinicAutorization(int companyId, string paraClinicTypeId)
    {
        var result = new ResultRequest<string>();

        var client = new HttpClientRequest(_clientFactory);

        var url = CallWebService.ApiSSO.ParaClinic.Authorization.getToken;

        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.Eprescription,
                paraClinicTypeId);

        var content = JsonConvert.SerializeObject(setupClientTamin);

        var responseRequest =
            await client.OnPost(setupClientTamin.ServiceFullUrl, url, content, "application/json", null);

        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<ResultRequest<string>>(responseRequest.ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }

    public async Task<ResultRequest<string>> DeleteParaclinicAutorization(string tokenId, int companyId)
    {
        var result = new ResultRequest<string>();

        var client = new HttpClientRequest(_clientFactory);

        var url = CallWebService.ApiSSO.ParaClinic.Authorization.deleteToken;

        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.Eprescription, "03");

        var content = JsonConvert.SerializeObject(new Token { TokenId = tokenId });

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
        var token = await _manageTaminTokenRepository.GetTokenByParaClinicType(companyId, paraClinicTypeId);

        if (string.IsNullOrEmpty(token))
        {
            var resultToken = await ParaclinicAutorization(companyId, paraClinicTypeId);

            if (resultToken.Status == (int)HttpStatusCode.NotAcceptable)
            {
                var resultSignOut = await DeleteParaclinicAutorization(token, companyId);


                // Status=> 200 "Logged out ..."
                // Status=> 401 "Session attached to this token, no longer exists."
                if (resultSignOut.Status == (int)HttpStatusCode.Unauthorized)
                {
                    // حذف توکن قدیمی با خطا مواجه شد
                    // به ادمین سیستم اطلاع دهید
                }

                resultToken = await ParaclinicAutorization(companyId, paraClinicTypeId);
            }

            if (resultToken.Status != (int)HttpStatusCode.OK) return "error";


            token = JsonConvert.DeserializeObject<string>(resultToken.Data);

            var taminToken = new TaminTokenViewModel
            {
                CompanyId = companyId,
                TokenDateTime = resultToken.DateTime,
                TokenId = token,
                TokenType = (byte)TaminTokenType.Eprescription,
                ParaClinicTypeId = paraClinicTypeId
            };

            await _manageTaminTokenRepository.Save(taminToken);
        }

        return token;
    }
}