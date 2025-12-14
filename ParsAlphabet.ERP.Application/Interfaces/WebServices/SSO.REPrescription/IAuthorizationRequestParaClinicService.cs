using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO.REPrescription;

public interface IAuthorizationRequestParaClinicService
{
    Task<ResultRequest<string>> ParaclinicAutorization(int companyId, string paraClinicTypeId);
    Task<string> GetTokenParaClinic(int companyId, string paraClinicTypeId);
}