using System.Net;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;
using ParsAlphabet.WebService.Api.Model.Tamin.Authentication;
using ParsAlphabet.WebService.Api.Model.Tamin.EPrescription;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParseAlphabet.ERP.Web.WebServices.SSO.EPrescriptionParaClinicService;

public class EPrescriptionParaClinicService : IEPrescriptionParaClinicService
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IHttpClientFactory _clientFactory;

    public EPrescriptionParaClinicService(IHttpClientFactory clientFactory, IAdmissionsRepository admissionsRepository)
    {
        _clientFactory = clientFactory;
        _admissionsRepository = admissionsRepository;
    }

    public async Task<ResultRequest<List<SetEPrescriptionHeader>>> GetEPrescriptionHeaderList(string nationalCode,
        string trackingCode, string token, int companyId)
    {
        var result = new ResultRequest<List<SetEPrescriptionHeader>>();

        var client = new HttpClientRequest(_clientFactory);

        var url = CallWebService.ApiSSO.ParaClinic.EPrescription.ePrescriptionList;
        url = url.Replace("@@nationalcode@@", nationalCode);
        url = url.Replace("@@trackingcode@@", trackingCode);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = token });

        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.Eprescription, "03");

        var responseRequest =
            await client.OnGet(setupClientTamin.ServiceFullUrl, url, "application/json", listHeaderRequest);

        if (responseRequest.StatusCode == HttpStatusCode.OK)
        {
            var settings = new JsonSerializerSettings();
            settings.Formatting = Formatting.Indented;

            settings.ContractResolver = new OriginalNameContractResolver();

            result = JsonConvert.DeserializeObject<ResultRequest<List<SetEPrescriptionHeader>>>(
                responseRequest.ResponseContent, settings);
        }
        else
        {
            result.Status = (int)responseRequest.StatusCode;
        }

        return result;
    }

    public async Task<ResultRequest<SetEPrescriptionHeaderViewModel>> GetEPrescriptionDetailList(
        GetEPrescriptionDetails model, string token, int companyId)
    {
        var result = new ResultRequest<SetEPrescriptionHeaderViewModel>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = token });

        var url = CallWebService.ApiSSO.ParaClinic.EPrescription.ePrescriptiondetailList;

        var content = JsonConvert.SerializeObject(model);
        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.Eprescription, "03");

        var responseRequest = await client.OnPost(setupClientTamin.ServiceFullUrl, url, content, "application/json",
            listHeaderRequest);

        if (responseRequest.StatusCode == HttpStatusCode.OK)
        {
            var settings = new JsonSerializerSettings();
            settings.Formatting = Formatting.Indented;

            settings.ContractResolver = new OriginalNameContractResolver();


            result = JsonConvert.DeserializeObject<ResultRequest<SetEPrescriptionHeaderViewModel>>(
                responseRequest.ResponseContent, settings);
        }
        else
        {
            result.Status = (int)responseRequest.StatusCode;
        }

        return result;
    }

    public async Task<ResultRequest<SetResultSendEprescription>> SendEPrescription(SetSendEPrescription model,
        string token, int companyId)
    {
        var result = new ResultRequest<SetResultSendEprescription>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();

        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = token });

        var url = CallWebService.ApiSSO.ParaClinic.EPrescription.ePrescriptionSend;

        var content = JsonConvert.SerializeObject(model);
        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.Eprescription, "03");


        //var setupClientTamin = new
        //{
        //    UserName = "partest",
        //    password = "123",
        //    SoftwareClientID = "174",
        //    SoftwareClientSecret = "h8QwH84Rk5QEh2X1nn/Gvp9ccPU6vARrQ9pxzF8KGxRHBkr53TwR47cc2GwCoFf1kuD93JOJB3kTa9gYGVeqJA==",
        //    ServiceFullUrl = "http://localhost:3686"
        //};

        var responseRequest = await client.OnPut(setupClientTamin.ServiceFullUrl, url, content, "application/json",
            listHeaderRequest);
        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<ResultRequest<SetResultSendEprescription>>(responseRequest
                .ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }

    public async Task<ResultRequest<SetResultSendEprescription>> SendLaboratoryEPrescription(SetSendEPrescription model,
        string token, int companyId)
    {
        var result = new ResultRequest<SetResultSendEprescription>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = token });

        var url = CallWebService.ApiSSO.ParaClinic.EPrescription.ePrescriptionSendLaboratory;
        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.Eprescription, "03");

        var content = JsonConvert.SerializeObject(model);

        var responseRequest = await client.OnPut(setupClientTamin.ServiceFullUrl, url, content, "application/json",
            listHeaderRequest);
        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<ResultRequest<SetResultSendEprescription>>(responseRequest
                .ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }

    public async Task<ResultRequest<string>> DeleteEPrescriptionId(string token, string registerId, int companyId)
    {
        var result = new ResultRequest<string>();

        var client = new HttpClientRequest(_clientFactory);

        var url = CallWebService.ApiSSO.ParaClinic.EPrescription.ePrescriptionDelete;
        url = url.Replace("@@registerId@@", registerId);
        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.Eprescription, "03");

        var listHeaderRequest = new List<RequestHeader>();
        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = token });

        var responseRequest =
            await client.OnGet(setupClientTamin.ServiceFullUrl, url, "application/json", listHeaderRequest);

        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<ResultRequest<string>>(responseRequest.ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }
}