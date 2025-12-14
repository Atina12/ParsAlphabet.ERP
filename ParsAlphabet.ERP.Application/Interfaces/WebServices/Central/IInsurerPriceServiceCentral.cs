using ParsAlphabet.Central.ObjectModel.MedicalCare.InsurerPrice;
using ParsAlphabet.Central.ObjectModel.Requests;
using OperationType = ParsAlphabet.ERP.Application.Enums.Enum.OperationType;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

public interface IInsurerPriceServiceCentral
{
    Task<HttpResult<ResultQuery>> InsurerPriceCentral(CentralInsurerPriceModel model);

    Task<HttpResult<List<ResultBulkSaveInsurerPrice>>> InsurerPriceBulkCentral(List<CentralInsurerPriceModel> model,
        OperationType operation);
}