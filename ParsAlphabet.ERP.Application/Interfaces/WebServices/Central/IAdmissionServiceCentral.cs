using ParsAlphabet.Central.ObjectModel.Requests;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

public interface IAdmissionServiceCentral
{
    Task<HttpResult<ResultQuery>> AdmissionSrviceReturn(int admissionId);
}