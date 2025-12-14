using System.Net;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;
using ParsAlphabet.WebService.Api.Model.Tamin.Authentication;
using ParsAlphabet.WebService.Api.Model.Tamin.Common;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParseAlphabet.ERP.Web.WebServices.SSO.CommonParaClinicService;

public class CommonParaClinicService : ICommonParaClinicService
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IHttpClientFactory _clientFactory;

    public CommonParaClinicService(IHttpClientFactory clientFactory, IAdmissionsRepository admissionsRepository)
    {
        _clientFactory = clientFactory;
        _admissionsRepository = admissionsRepository;
    }

    public async Task<ResultRequest<SetDeserveInfo>> GetPatientDeserveInfo(string nationalCode, string token,
        int companyId)
    {
        var result = new ResultRequest<SetDeserveInfo>();

        var client = new HttpClientRequest(_clientFactory);

        var url = CallWebService.ApiSSO.ParaClinic.Common.deserveInfo;
        url = url.Replace("@@nationalcode@@", nationalCode);

        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.Eprescription, "03");

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = token });

        var responseRequest =
            await client.OnGet(setupClientTamin.ServiceFullUrl, url, "application/json", listHeaderRequest);

        if (responseRequest.StatusCode == HttpStatusCode.OK)
        {
            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Formatting = Formatting.Indented;

            jsonSettings.ContractResolver = new OriginalNameContractResolver();
            jsonSettings.NullValueHandling = NullValueHandling.Include;
            result = JsonConvert.DeserializeObject<ResultRequest<SetDeserveInfo>>(responseRequest.ResponseContent,
                jsonSettings);
        }
        else
        {
            result.Status = (int)responseRequest.StatusCode;
        }

        return result;
    }
}