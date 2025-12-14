using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequest;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequest;

public interface ITreasuryRequestRepository
{
    Task<MyResultPage<List<TreasuryRequestGetPage>>> GetPage(NewGetPageViewModel model, int userId, byte roleId);
    Task<MyResultPage<TreasuryRequestGetRecord>> GetRecordById(int id, int companyId, byte roleId);
    Task<TreasuryRequestResult> Insert(TreasuryRequestModel model, byte roleId);
    Task<TreasuryRequestResult> Update(TreasuryRequestModel model);
    Task<TreasuryRequestResult> Delete(int id, int companyId, byte roleId);
    Task<bool> CheckExist(int id, int companyId, int userId, byte roleId);
    Task<string> GetTransactionDatePersian(int id, int companyId);
    GetColumnsViewModel GetColumns(int companyId);
    Task<TreasuryRequestResult> UpdateInLine(TreasuryRequestModelUpdateInline model);

    Task<TreasuryRequestResultStatus> UpdateTreasuryRequestStep(UpdateAction model, OperationType operationType,
        byte roleId);

    Task<MyResultDataQuery<List<TreasuryRequestStepLogList>>> GetTreasuryStepList(int treasuryId, int companyId);
    Task<List<string>> ValidateUpdateStep(UpdateAction model, OperationType operationType, byte roleId);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, int userId, byte roleId);
    Task<TreasuryRequestInfo> GetTreasuryRequestInfo(int id, int companyId);
}