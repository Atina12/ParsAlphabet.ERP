using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCashStand;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCashStand;

public interface IAdmissionCashStandRepository
{
    Task<AdmissionStandPatientInfo> GetServicePatientInfo(long admissionId);
    Task<AdmissionStandPatientInfo> GetSalePatientInfo(long admissionId);

    Task<MyResultStatus> SaveAdmissionCashStand(AdmissionCashStandModel model, int defaultCurrencyId, int userId,
        int companyId, string ipAddress);
}