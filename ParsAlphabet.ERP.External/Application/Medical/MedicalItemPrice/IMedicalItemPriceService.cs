using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.MedicalItemPrice;

public interface IMedicalItemPriceService
{
    Task<HttpResult<ResultQuery>> SendMedicalItemPriceService(CentralMedicalItemPrice model, string token);

    Task<HttpResult<List<ResultBulkSaveMedicalItemPrice>>> SendMedicalItemPriceBulkService(
        List<CentralMedicalItemPrice> model, string token);
}