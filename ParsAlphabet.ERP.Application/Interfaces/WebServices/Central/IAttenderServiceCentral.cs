using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

public interface IAttenderServiceCentral
{
    Task<HttpResult<ResultQuery>> AttenderCentral(CentralAttender model);
}