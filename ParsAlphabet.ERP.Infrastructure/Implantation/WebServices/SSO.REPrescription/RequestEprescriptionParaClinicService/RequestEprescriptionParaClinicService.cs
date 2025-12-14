using System.Net;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO.REPrescription;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;
using ParsAlphabet.WebService.Api.Model.Tamin.Authentication;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;
using ParsAlphabet.WebService.Api.Model.Tamin.RequestEprescription;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.SSO.REPrescription.
    RequestEprescriptionParaClinicService;

public class RequestEprescriptionParaClinicService : IRequestEprescriptionParaClinicService
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IHttpClientFactory _clientFactory;
    private readonly ISetupRepository _setupRepository;

    public RequestEprescriptionParaClinicService(IHttpClientFactory clientFactory, ISetupRepository setupRepository,
        IAdmissionsRepository admissionsRepository)
    {
        _clientFactory = clientFactory;
        _setupRepository = setupRepository;
        _admissionsRepository = admissionsRepository;
    }


    public async Task<ResultRequestRequestEPrescription<GetOutPutSendEprescription>> SendERequestPrescription(
        SetNoteDetailEPrescription model, string token, int companyId)
    {
        var result = new ResultRequestRequestEPrescription<GetOutPutSendEprescription>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();


        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.ApiSSOREPrescription.RequestEprescription.RequestePrescriptionSend;

        var content = JsonConvert.SerializeObject(model);
        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.RequestPrescription, "0");


        var responseRequest = await client.OnPost(setupClientTamin.ServiceFullUrl, url, content, "application/json",
            listHeaderRequest);
        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result =
                JsonConvert.DeserializeObject<ResultRequestRequestEPrescription<GetOutPutSendEprescription>>(
                    responseRequest.ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }

    public async Task<ResultRequestEditPrescription> GetEPrescription(string headerID, string docId, string token,
        int companyId)
    {
        var result = new ResultRequestEditPrescription();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();


        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.ApiSSOREPrescription.RequestEprescription.RequestePrescriptionGet;
        url = url.Replace("@@headerID@@", headerID);
        url = url.Replace("@@docId@@", docId.PadLeft(10, '0'));

        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.RequestPrescription, "0");

        var responseRequest =
            await client.OnGet(setupClientTamin.ServiceFullUrl, url, "application/json", listHeaderRequest);
        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<ResultRequestEditPrescription>(responseRequest.ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }

    public async Task<ResultRequestEditPrescriptionOutPut> EditEPrescription(List<GetNoteDetailsEprsc> model,
        string headerID, string docId, string otpCode, string token, int companyId)
    {
        var result = new ResultRequestEditPrescriptionOutPut();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();

        var content = JsonConvert.SerializeObject(model);


        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.ApiSSOREPrescription.RequestEprescription.RequestePrescriptionEdit;
        url = url.Replace("@@headerID@@", headerID);
        url = url.Replace("@@docId@@", docId.PadLeft(10, '0'));
        url = url.Replace("@@otpCode@@", otpCode);

        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.RequestPrescription, "0");


        var responseRequest = await client.OnPost(setupClientTamin.ServiceFullUrl, url, content, "application/json",
            listHeaderRequest);
        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<ResultRequestEditPrescriptionOutPut>(responseRequest
                .ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }

    public async Task<ResultRequestRemoveEPrescription> DeleteEPrescription(string headerID, string docId,
        string otpCode, string token, int companyId)
    {
        var result = new ResultRequestRemoveEPrescription();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();


        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = "Bearer " + token });

        var url = CallWebService.ApiSSOREPrescription.RequestEprescription.RequestePrescriptionDelete;
        url = url.Replace("@@headerID@@", headerID);
        url = url.Replace("@@docId@@", docId.PadLeft(10, '0'));
        url = url.Replace("@@otpCode@@", otpCode);

        var setupClientTamin =
            await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.RequestPrescription, "0");


        var responseRequest = await client.OnPost(setupClientTamin.ServiceFullUrl, url, "", "application/json",
            listHeaderRequest);
        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<ResultRequestRemoveEPrescription>(responseRequest.ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }
}