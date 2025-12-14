using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;

public interface IAuthorizationParaClinicService
{
    Task<ResultRequest<string>> ParaclinicAutorization(int companyId, string paraClinicTypeId);
    Task<string> GetTokenParaClinic(int companyId, string paraClinicTypeId);
    Task<ResultRequest<string>> DeleteParaclinicAutorization(string tokenId, int companyId);
}