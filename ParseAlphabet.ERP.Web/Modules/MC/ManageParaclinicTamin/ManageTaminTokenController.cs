using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionTaminWebService;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionServiceTamin;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionTaminWebService;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ManageRequestPrescriptionTamin;
using ParsAlphabet.WebService.Api.Model.Tamin.Common;
using ParsAlphabet.WebService.Api.Model.Tamin.EPrescription;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;
using static ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.MC.ManageParaclinicTamin;

[Route("api/MC/tamin")]
[ApiController]
[Authorize]
public class ManageTaminTokenApiController(
    ManageRequestPrescriptionTaminRepository manageTaminTokenRepository
  )
    : ControllerBase
{
    [HttpGet]
    [Route("deserveinfo/{nationalcode}")]
    public async Task<ResultRequest<SetDeserveInfo>> GetDeservePatientInfo(string nationalcode)
    {
        return await manageTaminTokenRepository.GetDeservePatientInfo(nationalcode);
    }

    [Route("geteprescriptionbynationalcode/{nationalCode}/{trackingCode}")]
    [HttpGet]
    public async Task<ResultRequest<List<SetEPrescriptionHeader>>> GetEprescriptionListByNationalCode(
        string nationalCode, string trackingCode)
    {
        return await manageTaminTokenRepository.GetEprescriptionListByNationalCode(nationalCode, trackingCode);
    }

    [Route("geteprescriptiondetail")]
    [HttpPost]
    public async Task<ResultRequest<SetEPrescriptionHeaderViewModel>> GetEprescriptionDetailList(
        [FromBody] GetEPrescriptionDetails model)
    {
        return await manageTaminTokenRepository.GetEprescriptionDetailList(model);
    }

    [Route("sendeprescription")]
    [HttpPut]
    public async Task<MyResultDataStatus<List<Tuple<int, ResultRequest<SetResultSendEprescription>>>>>
        SendEprescription([FromBody] List<int> taminIds)
    {
        return await manageTaminTokenRepository.SendEprescription(taminIds);
    }

    [Route("deleteprescription")]
    [HttpPost]
    public async Task<MyResultDataStatus<List<Tuple<int, ResultRequest<string>>>>> DeleteEPrescription(
        [FromBody] List<int> taminIds)
    {
        return await manageTaminTokenRepository.DeleteEPrescription(taminIds);
    }
}