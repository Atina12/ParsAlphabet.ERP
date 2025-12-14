using ParsAlphabet.WebService.Api.Model.Tamin.Public;
using ParsAlphabet.WebService.Api.Model.Tamin.RequestEprescription;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO.REPrescription;

public interface IRequestEprescriptionParaClinicService
{
    Task<ResultRequestRequestEPrescription<GetOutPutSendEprescription>> SendERequestPrescription(
        SetNoteDetailEPrescription model, string token, int companyId);

    Task<ResultRequestRemoveEPrescription> DeleteEPrescription(string headerID, string docId, string otpCode,
        string token, int companyId);

    Task<ResultRequestEditPrescription> GetEPrescription(string headerID, string docId, string token, int companyId);

    Task<ResultRequestEditPrescriptionOutPut> EditEPrescription(List<GetNoteDetailsEprsc> model, string headerID,
        string docId, string otpCode, string token, int companyId);
}