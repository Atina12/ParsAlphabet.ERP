using ParsAlphabet.Central.ObjectModel.MedicalCare.InsurerPrice;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.InsurerPrice;

public interface IInsurerPriceService
{
    Task<HttpResult<ResultQuery>> SendInsurerPriceService(CentralInsurerPriceModel model, string token);

    Task<HttpResult<List<ResultBulkSaveInsurerPrice>>> SendInsurerPriceBulkService(List<CentralInsurerPriceModel> model,
        string token);
}