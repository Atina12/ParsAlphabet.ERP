using System.Net;
using ERPCentral.Interface.App.CallRequest;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Public;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.MedicalItemPrice;

public class MedicalItemPriceService : IMedicalItemPriceService
{
    private readonly IHttpClientFactory _clientFactory;

    public MedicalItemPriceService(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    public async Task<HttpResult<ResultQuery>> SendMedicalItemPriceService(CentralMedicalItemPrice model, string token)
    {
        var result = new HttpResult<ResultQuery>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.CentralApiUrl.ErpNode.MedicalItemPrice.SendMedicalItemPriceUrl;

        var content = JsonConvert.SerializeObject(model);

        var responseRequest = await client.OnPost(CallWebService.CentralApiUrl.baseUrl, url, content,
            "application/json", listHeaderRequest);

        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<HttpResult<ResultQuery>>(responseRequest.ResponseContent);
        else
            result.HttpStatus = responseRequest.StatusCode;

        return result;
    }

    public async Task<HttpResult<List<ResultBulkSaveMedicalItemPrice>>> SendMedicalItemPriceBulkService(
        List<CentralMedicalItemPrice> model, string token)
    {
        var result = new HttpResult<List<ResultBulkSaveMedicalItemPrice>>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.CentralApiUrl.ErpNode.MedicalItemPrice.SendMedicalItemPriceBulkUrl;
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
            result = JsonConvert.DeserializeObject<HttpResult<List<ResultBulkSaveMedicalItemPrice>>>(responseRequest
                .ResponseContent);
        }

        return result;
    }
}