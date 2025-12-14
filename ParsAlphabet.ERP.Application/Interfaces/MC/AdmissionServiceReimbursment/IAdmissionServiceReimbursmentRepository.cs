using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceReimbursment;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionServiceReimbursment;

public interface IAdmissionServiceReimbursmentRepository
{
    Task<MyResultPage<List<AdmissionServiceLineReimbursementGetPage>>> GetPage(
        NewGetAdmissionServiceReimbursmentGetPage model);

    GetColumnsViewModel GetColumns();
    Task<MyResultStatus> Save(List<AdmissionServiceLineReimbursementModel> model, int CompanyId);
    Task<MyResultPage<ReimburesmentInsurerInfo>> GetInsuranceByAdmissionId(int admissionId, int CompanyId);
    Task<MyResultStatus> DeleteLine(DeleteAdmissionServiceLineReimbursement model);
}