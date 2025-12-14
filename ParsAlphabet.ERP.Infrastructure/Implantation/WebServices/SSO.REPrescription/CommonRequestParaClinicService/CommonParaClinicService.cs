using System.Net;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO.REPrescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Attender;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;
using ParsAlphabet.WebService.Api.Model.Tamin.Authentication;
using ParsAlphabet.WebService.Api.Model.Tamin.Common;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.SSO.REPrescription.CommonRequestParaClinicService;

public class CommonRequestParaClinicService : ICommonRequestParaClinicService
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly AttenderRepository _attenderRepository;
    private readonly IHttpClientFactory _clientFactory;
    private readonly ICompanyRepository _companyRepository;

    public CommonRequestParaClinicService(
        IHttpClientFactory clientFactory,
        ICompanyRepository companyRepository,
        AttenderRepository attenderRepository,
        IAdmissionsRepository admissionsRepository)
    {
        _clientFactory = clientFactory;
        _companyRepository = companyRepository;
        _attenderRepository = attenderRepository;
        _admissionsRepository = admissionsRepository;
    }

    public async Task<ResultRequest<SetDeserveInfoRequestEP>> GetPatientDeserveInfo(string nationalCode, string docId,
        string token, int companyId)
    {
        var result = new ResultRequest<SetDeserveInfoRequestEP>();

        var client = new HttpClientRequest(_clientFactory);

        var url = CallWebService.ApiSSOREPrescription.Common.deserveInfo;

        var company = await _companyRepository.GetCompanyInfo();

        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.RequestPrescription, "0");

        var attenderList = await _attenderRepository.GetAttenderMsc(Convert.ToInt32(docId), companyId);


        if (attenderList == null)
        {
            result.StatusDesc = "کد نظام پزشکی معتبر نمی باشد";
            return result;
        }

        url = url.Replace("@@siam_id@@", attenderList.Name.PadLeft(10, '0'))
            .Replace("@@docId@@", attenderList.Name.PadLeft(10, '0'))
            .Replace("@@patientId@@", nationalCode);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var responseRequest =
            await client.OnGet(setupClientTamin.ServiceFullUrl, url, "application/json", listHeaderRequest);

        //var responseRequest = await client.OnGet(setupClientTamin.CIS_WCF_Url, url, "application/json", listHeaderRequest);

        if (responseRequest.StatusCode == HttpStatusCode.OK)
        {
            var jsonSettings = new JsonSerializerSettings();
            jsonSettings.Formatting = Formatting.Indented;

            jsonSettings.ContractResolver = new OriginalNameContractResolver();
            jsonSettings.NullValueHandling = NullValueHandling.Include;
            result = JsonConvert.DeserializeObject<ResultRequest<SetDeserveInfoRequestEP>>(
                responseRequest.ResponseContent, jsonSettings);
        }
        else
        {
            result.Status = (int)responseRequest.StatusCode;
        }


        return result;
    }
}