using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrder;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLog;

namespace ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrderLog;

public interface ISaleOrderLogRepository
{
    Task<MyResultDataQuery<List<SaleOrderStepLogList>>> GetSaleOrderStepList(int personOrderId, int companyId);

    Task<List<string>> ValidateDeleteStep(SaleOrderViewModel model, int companyId, OperationType operationType);
}