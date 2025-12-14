using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceTamin;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionServiceTamin;

public interface IAdmissionServiceTaminRepository
{
    Task<PrescriptionTaminInfo> PrescriptionTaminInfo(int id);
    Task<AdmissionServiceTaminDisplay> AdmissionServiceTaminDisplay(int id);
    Task<List<InsurerAttenderServiceTamin>> GetInsurerAttenderService(GetInsurerAttenderServiceTamin model);
    Task<MyResultDataStatus<List<CalAdmissionTaminPrice>>> CalAdmissionTaminPrice(GetCalAdmissionTaminPrice model);
    Task<int> GetRequestEPrescriptionId(string eprescriptionId, int taminId, int companyId);
    Task<TaminRegisterIdParaclinic> GetRegisterPrescriptionId(int admissionTaminId, int companyId);
    Task<bool> CheckParaclinicTypeIsAcceptable(string paraclinicTypeCodes);
}