using System.Net;
using ERPCentral.Interface.App.CallRequest;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.General.Token;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.General.Token;

public class TokenService : ITokenService
{
    private readonly IHttpClientFactory _clientFactory;

    public TokenService(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    public async Task<HttpResult<string>> GetErpToken(TokenInputModel model)
    {
        var result = new HttpResult<string>();

        var client = new HttpClientRequest(_clientFactory);

        var content = JsonConvert.SerializeObject(model);

        var url = CallWebService.CentralApiUrl.ErpNode.Token.GetTokenUrl;

        var resultRequest =
            await client.OnPost(CallWebService.CentralApiUrl.baseUrl, url, content, "application/json", null);

        if (resultRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<HttpResult<string>>(resultRequest.ResponseContent);

        return result;
    }

    public async Task<bool> CheckErpToken(string token)
    {
        var client = new HttpClientRequest(_clientFactory);

        var url = CallWebService.CentralApiUrl.ErpNode.Token.CheckTokenUrl;

        var listHeaderRequest = new List<RequestHeader>
        {
            new() { Key = "Authorization", Value = "Bearer " + token }
        };

        var resultRequest = await client.OnGet(CallWebService.CentralApiUrl.baseUrl, url, "application/json",
            listHeaderRequest);

        return resultRequest.StatusCode == HttpStatusCode.OK;
    }
}