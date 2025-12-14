using ParsAlphabet.WebService.Api.Model.Tamin.Common;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO;

public interface ICommonParaClinicService
{
    Task<ResultRequest<SetDeserveInfo>> GetPatientDeserveInfo(string nationalCode, string token, int companyId);
}