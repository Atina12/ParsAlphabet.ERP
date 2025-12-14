using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.AdmissionService;

public interface IAdmissionService
{
    Task<HttpResult<ResultQuery>> AdmissionReturnService(int admissionId, string token);
}