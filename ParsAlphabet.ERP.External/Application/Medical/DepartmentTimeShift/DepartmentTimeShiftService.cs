namespace ERPCentral.Interface.App.Application.Medical.DepartmentTimeShift;

public class DepartmentTimeShiftService : IDepartmentTimeShiftService
{
    private readonly IHttpClientFactory _clientFactory;

    public DepartmentTimeShiftService(IHttpClientFactory clientFactory)
    {
        _clientFactory = clientFactory;
    }
    //public async Task<HttpResult<ResultQuery>> AttenderScheduleBlockUpdateShiftNameService(List<UpdateShiftNameInputModel> model, string token, int companyId)
    //{
    //    var result = new HttpResult<ResultQuery>();

    //    var client = new HttpClientRequest(_clientFactory);

    //    var listHeaderRequest = new List<RequestHeader>();
    //    listHeaderRequest.Add(new RequestHeader() { Key = "Authorization", Value = "Bearer " + token });

    //    var url = CallWebService.CentralApiUrl.ErpNode.AttenderScheduleBlock.SendAttenderScheduleBlockUpdateShiftNameUrl;
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
}