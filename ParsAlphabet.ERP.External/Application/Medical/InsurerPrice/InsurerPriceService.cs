using System.Net;
using ERPCentral.Interface.App.CallRequest;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.MedicalCare.InsurerPrice;
using ParsAlphabet.Central.ObjectModel.Public;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.InsurerPrice;

public class InsurerPriceService : IInsurerPriceService
{
    private readonly IHttpClientFactory _clientFactory;

    public InsurerPriceService(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    public async Task<HttpResult<ResultQuery>> SendInsurerPriceService(CentralInsurerPriceModel model, string token)
    {
        var result = new HttpResult<ResultQuery>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.CentralApiUrl.ErpNode.InsurerPrice.SendInsurerPriceUrl;

        var content = JsonConvert.SerializeObject(model);

        var responseRequest = await client.OnPost(CallWebService.CentralApiUrl.baseUrl, url, content,
            "application/json", listHeaderRequest);

        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<HttpResult<ResultQuery>>(responseRequest.ResponseContent);
        else
            result.HttpStatus = responseRequest.StatusCode;

        return result;
    }

    public async Task<HttpResult<List<ResultBulkSaveInsurerPrice>>> SendInsurerPriceBulkService(
        List<CentralInsurerPriceModel> model, string token)
    {
        var result = new HttpResult<List<ResultBulkSaveInsurerPrice>>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.CentralApiUrl.ErpNode.InsurerPrice.SendInsurerPriceBulkUrl;
        var content = JsonConvert.SerializeObject(model);

        var responseRequest = await client.OnPost(CallWebService.CentralApiUrl.baseUrl, url, content,
            "application/json", listHeaderRequest);


        if (!responseRequest.NotNull())
        {
            result.HttpStatus = HttpStatusCode.BadRequest;
            result.Successfull = false;
            result.StatusMessage = "httperror";
            result.Data = null;
        }
        else if (responseRequest.StatusCode != HttpStatusCode.OK)
        {
            result.HttpStatus = responseRequest.StatusCode;
            result.Successfull = false;
            result.StatusMessage = "httperror";
            result.Data = null;
        }
        else
        {
            result = JsonConvert.DeserializeObject<HttpResult<List<ResultBulkSaveInsurerPrice>>>(responseRequest
                .ResponseContent);
        }

        return result;
    }
}