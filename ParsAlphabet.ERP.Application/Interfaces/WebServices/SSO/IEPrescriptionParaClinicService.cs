using ParsAlphabet.WebService.Api.Model.Tamin.EPrescription;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;

public interface IEPrescriptionParaClinicService
{
    Task<ResultRequest<List<SetEPrescriptionHeader>>> GetEPrescriptionHeaderList(string nationalCode,
        string trackingCode, string token, int companyId);

    Task<ResultRequest<SetEPrescriptionHeaderViewModel>> GetEPrescriptionDetailList(GetEPrescriptionDetails model,
        string token, int companyId);

    Task<ResultRequest<SetResultSendEprescription>> SendEPrescription(SetSendEPrescription model, string token,
        int companyId);

    Task<ResultRequest<SetResultSendEprescription>> SendLaboratoryEPrescription(SetSendEPrescription model,
        string token, int companyId);

    Task<ResultRequest<string>> DeleteEPrescriptionId(string token, string registerId, int companyId);
}