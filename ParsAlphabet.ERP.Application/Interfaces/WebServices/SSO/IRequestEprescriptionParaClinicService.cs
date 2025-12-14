using ParsAlphabet.WebService.Api.Model.Tamin.Public;
using ParsAlphabet.WebService.Api.Model.Tamin.RequestEprescription;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;

public interface IRequestEprescriptionParaClinicService
{
    Task<ResultRequest<GetOutPutSendEprescription>> SendERequestPrescription(GetNoteDetailEPrescription model,
        string token, int companyId);
}