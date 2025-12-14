using System.Net;
using ERPCentral.Interface.App.CallRequest;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Public;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.AttenderScheduleBlock;

public class AttenderScheduleBlockService : IAttenderScheduleBlockService
{
    private readonly IHttpClientFactory _clientFactory;

    public AttenderScheduleBlockService(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }

    public async Task<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>> AttenderScheduleBlockSaveService(
        List<AttenderScheduleModel> model, string token, int companyId)
    {
        var result = new HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>
        {
            new() { Key = "Authorization", Value = "Bearer " + token }
        };

        var url = CallWebService.CentralApiUrl.ErpNode.AttenderScheduleBlock.SendAttenderScheduleBlockSaveUrl;
        url = url.Replace("@@companyId@@", companyId.ToString());


        var content = JsonConvert.SerializeObject(model);

        var responseRequest = await client.OnPost(CallWebService.CentralApiUrl.baseUrl, url, content,
            "application/json", listHeaderRequest, 180);

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
            result = JsonConvert.DeserializeObject<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>>(
                responseRequest.ResponseContent);
        }

        return result;
    }

    public async Task<HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>> AttenderScheduleBlockDeleteService(
        string centralIds, string token)
    {
        var result = new HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>
        {
            new() { Key = "Authorization", Value = "Bearer " + token }
        };

        var url = CallWebService.CentralApiUrl.ErpNode.AttenderScheduleBlock.SendAttenderScheduleBlockDeleteUrl;

        var content = JsonConvert.SerializeObject(centralIds);

        var responseRequest = await client.OnPost(CallWebService.CentralApiUrl.baseUrl, url, content,
            "application/json", listHeaderRequest, 180);

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
            result =
                JsonConvert.DeserializeObject<HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>>(
                    responseRequest.ResponseContent);
        }

        return result;
    }

    public async Task<HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>>
        AttenderScheduleBlockValidationService(string centralIds, string token)
    {
        var result = new HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.CentralApiUrl.ErpNode.AttenderScheduleBlock.SendAttenderScheduleBlockValidateUrl;

        var content = JsonConvert.SerializeObject(centralIds);

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
            result =
                JsonConvert.DeserializeObject<HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>>(
                    responseRequest.ResponseContent);
        }

        return result;
    }

    public async Task<HttpResult<ResultQuery>> AttenderScheduleBlockUpdateRangeTimeService(
        List<UpdateRangeTimeScheduleBlock> model, string token, int companyId)
    {
        var result = new HttpResult<ResultQuery>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>
        {
            new() { Key = "Authorization", Value = "Bearer " + token }
        };

        var url = CallWebService.CentralApiUrl.ErpNode.AttenderScheduleBlock
            .SendAttenderScheduleBlockUpdateRangeTimeUrl;
        url = url.Replace("@@companyId@@", companyId.ToString());

        var content = JsonConvert.SerializeObject(model);

        var responseRequest = await client.OnPut(CallWebService.CentralApiUrl.baseUrl, url, content, "application/json",
            listHeaderRequest);

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
            result = JsonConvert.DeserializeObject<HttpResult<ResultQuery>>(responseRequest.ResponseContent);
        }

        return result;
    }

    //public async Task<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>> AttenderScheduleBlockUpdateMedicalShiftService(List<AttenderScheduleModel> model, string token, int companyId)
    //{
    //    var result = new HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>();

    //    var client = new HttpClientRequest(_clientFactory);

    //    var listHeaderRequest = new List<RequestHeader>();
    //    listHeaderRequest.Add(new RequestHeader() { Key = "Authorization", Value = "Bearer " + token });

    //    var url = CallWebService.CentralApiUrl.ErpNode.AttenderScheduleBlock.SendAttenderScheduleBlockUpdateMedicalShiftUrl;
    //    url = url.Replace("@@companyId@@", companyId.ToString());

    //    var content = JsonConvert.SerializeObject(model);

    //    var responseRequest = await client.OnPut(CallWebService.CentralApiUrl.baseUrl, url, content, "application/json", listHeaderRequest);

    //    if (!responseRequest.NotNull())
    //    {
    //        result.HttpStatus = HttpStatusCode.BadRequest;
    //        result.Successfull = false;
    //        result.StatusMessage = "httperror";
    //        result.Data = null;
    //    }
    //    else if (responseRequest.StatusCode != HttpStatusCode.OK)
    //    {
    //        result.HttpStatus = responseRequest.StatusCode;
    //        result.Successfull = false;
    //        result.StatusMessage = "httperror";
    //        result.Data = null;
    //    }
    //    else
    //        result = JsonConvert.DeserializeObject<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>>(responseRequest.ResponseContent);

    //    return result;
    //}

    //public async Task<HttpResult<ResultQuery>> AttenderScheduleBlockUpdateShiftNameService(List<UpdateShiftNameInputModel> model, string token, int companyId)
    //{
    //    var result = new HttpResult<ResultQuery>();

    //    var client = new HttpClientRequest(_clientFactory);

    //    var listHeaderRequest = new List<RequestHeader>();
    //    listHeaderRequest.Add(new RequestHeader() { Key = "Authorization", Value = "Bearer " + token });

    //    var url = $"{CallWebService.CentralApiUrl.ErpNode.AttenderScheduleBlock.SendAttenderScheduleBlockUpdateShiftNameUrl}";
    //    url = url.Replace("@@companyId@@", companyId.ToString());

    //    var content = JsonConvert.SerializeObject(model);

    //    var responseRequest = await client.OnPut(CallWebService.CentralApiUrl.baseUrl, url, content, "application/json", listHeaderRequest);


    //    if (!responseRequest.NotNull())
    //    {
    //        result.HttpStatus = HttpStatusCode.BadRequest;
    //        result.Successfull = false;
    //        result.StatusMessage = "httperror";
    //        result.Data = null;
    //    }
    //    else if (responseRequest.StatusCode != HttpStatusCode.OK)
    //    {
    //        result.HttpStatus = responseRequest.StatusCode;
    //        result.Successfull = false;
    //        result.StatusMessage = "httperror";
    //        result.Data = null;
    //    }
    //    else
    //        result = JsonConvert.DeserializeObject<HttpResult<ResultQuery>>(responseRequest.ResponseContent);

    //    return result;
    //}

    public async Task<HttpResult<ResultQuery>> AttenderScheduleBlockcChangeLock(ChangeLockScheduleBlock model,
        string token)
    {
        var result = new HttpResult<ResultQuery>();
        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.CentralApiUrl.ErpNode.AttenderScheduleBlock.SendAttenderScheduleBlockChangeLockUrl;

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
            result = JsonConvert.DeserializeObject<HttpResult<ResultQuery>>(responseRequest.ResponseContent);
        }

        return result;
    }
}