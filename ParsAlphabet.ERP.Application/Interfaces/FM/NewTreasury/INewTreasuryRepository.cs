using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;

public interface INewTreasuryRepository
{
    Task<MyResultPage<List<NewTreasuryGetPage>>> GetPage(NewGetPageViewModel model, int userId, byte roleId);
    Task<MyResultPage<NewTreasuryGetRecord>> GetRecordById(long id, int companyId);
    GetColumnsViewModel GetColumns(int companyId);
    Task<NewTreasuryResult> Insert(NewTreasuryModel model, byte roleId);
    Task<NewTreasuryResult> Update(NewTreasuryModel model);
    Task<NewTreasuryResult> UpdateInLine(NewTreasuryModelUpdateInline model);
    Task<NewTreasuryResult> Delete(int id, int companyId, byte roleId);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, int userId, byte roleId);

    Task<List<MyDropDownViewModel>> RequestFundType_GetDropDown(long treasuryId, int workflowId, long requestId,
        int listType, int companyId);

    Task<List<ParentIdMyDropdownViewModel>> TreasuryRequest_GetDropDown(short branchId, short workflowId, int companyId,
        short stageId, long? requestId, long? treasuryId);

    Task<NewTreasuryResultStatus> UpdateTreasuryStep(UpdateAction model, OperationType operationType);
    Task<TreasuryRequestViewModel> GetRequest(int id, int companyId);

    Task<List<CurrentTreasuryStageAction>> GetCurrentTreasuryAction(long id, byte ParentWorkflowCategoryId,
        int companyId, byte getType);

    Task<MyResultDataQuery<List<NewTreasuryStepLogList>>> GetTreasuryStepList(int treasuryId, int companyId);

    Task<bool> CheckExist(TreasuryExistViewModel model, int userId, byte roleId);


    Task<List<MyDropDownViewModel>> TreasuryStageDropDown();
    Task<int> GetJournalIdByTreasuryId(long treasuryId, short stageId);
    Task<List<HeaderTreasuryPostingGroup>> GetHeaderTreasuryPostingGroup(List<ID> Ids, int companyId);
    Task<bool> CheckRequestIsLastConfirmHeader(int requestId);
    Task<MyDropDownViewModel> GetTreasuryRequestTreasurySubject(int id);
    Task UpdateActionId(long treasuryId, byte actionId);
    Task<List<string>> ValidateDeleteStep(long id, int companyId, OperationType operationType, byte roleId);
    Task<List<string>> ValidateUpdateStep(UpdateAction model, OperationType operationType);
}