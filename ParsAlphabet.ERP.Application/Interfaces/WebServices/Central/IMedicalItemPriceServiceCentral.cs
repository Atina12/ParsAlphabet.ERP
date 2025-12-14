using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

public interface IMedicalItemPriceServiceCentral
{
    Task<HttpResult<ResultQuery>> MedicalItemPriceCentral(CentralMedicalItemPrice model);

    Task<HttpResult<List<ResultBulkSaveMedicalItemPrice>>> MedicalItemPriceBulkCentral(
        List<CentralMedicalItemPrice> model);
}