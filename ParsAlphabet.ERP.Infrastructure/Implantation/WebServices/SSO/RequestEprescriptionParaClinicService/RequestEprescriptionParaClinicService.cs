using System.Net;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;
using ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CallRequest;
using ParsAlphabet.WebService.Api.Model.Tamin.Authentication;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;
using ParsAlphabet.WebService.Api.Model.Tamin.RequestEprescription;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.SSO.RequestEprescriptionParaClinicService;

public class RequestEprescriptionParaClinicService : IRequestEprescriptionParaClinicService
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IHttpClientFactory _clientFactory;

    public RequestEprescriptionParaClinicService(IHttpClientFactory clientFactory,
        IAdmissionsRepository admissionsRepository)
    {
        _clientFactory = clientFactory;
        _admissionsRepository = admissionsRepository;
    }


    public async Task<ResultRequest<GetOutPutSendEprescription>> SendERequestPrescription(
        GetNoteDetailEPrescription model, string token, int companyId)
    {
        var result = new ResultRequest<GetOutPutSendEprescription>();

        var client = new HttpClientRequest(_clientFactory);

        var listHeaderRequest = new List<RequestHeader>();

        token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InBhcnRlc3QiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zaWQiOiIxNzQiLCJwcmltYXJ5c2lkIjoiMDExZTZjMmQtMzgxYi00NWQ2LWEzOTQtNzIwZWM2ZDNmZGFmIiwibmJmIjoxNjYxMjMzMjkwLCJleHAiOjE2NjEyNDA0OTAsImlhdCI6MTY2MTIzMzI5MH0.m7NYL3XHYpFBaV_oae6t38E3tjv-j9a1eX_09OBqiTU";

        listHeaderRequest.Add(new RequestHeader { Key = "Authorization", Value = token });

        var url = $"{CallWebService.ApiSSO.ParaClinic.EPrescription.ePrescriptionSend}";

        var content = JsonConvert.SerializeObject(model);
        //var setupClientTamin = await _admissionsRepository.GetSetupClientTamin(companyId, (byte)TaminTokenType.ParaClinic, "03");


        var setupClientTamin = new
        {
            UserName = "partest",
            password = "123",
            SoftwareClientID = "174",
            SoftwareClientSecret =
                "h8QwH84Rk5QEh2X1nn/Gvp9ccPU6vARrQ9pxzF8KGxRHBkr53TwR47cc2GwCoFf1kuD93JOJB3kTa9gYGVeqJA==",
            ServiceFullUrl = "http://localhost:3686"
        };

        var responseRequest = await client.OnPut(setupClientTamin.ServiceFullUrl, url, content, "application/json",
            listHeaderRequest);
        if (responseRequest.StatusCode == HttpStatusCode.OK)
            result = JsonConvert.DeserializeObject<ResultRequest<GetOutPutSendEprescription>>(responseRequest
                .ResponseContent);
        else
            result.Status = (int)responseRequest.StatusCode;

        return result;
    }
}