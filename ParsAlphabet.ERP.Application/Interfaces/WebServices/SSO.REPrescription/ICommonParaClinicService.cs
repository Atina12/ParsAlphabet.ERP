using ParsAlphabet.WebService.Api.Model.Tamin.Common;
using ParsAlphabet.WebService.Api.Model.Tamin.Public;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.SSO.REPrescription;

public interface ICommonRequestParaClinicService
{
    Task<ResultRequest<SetDeserveInfoRequestEP>> GetPatientDeserveInfo(string nationalCode, string docId, string token,
        int companyId);
}