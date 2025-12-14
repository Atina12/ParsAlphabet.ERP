using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasuryLine;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasuryLine;

public interface INewTreasuryLineRepository
{
    GetColumnsViewModel GetTreasuryHeaderColumns(short stageId);
    Task<GetStageStepConfigColumnsViewModel> GetTreasuryLineByFundTypeSimpleColumns(short stageId, int workflowId);
    Task<GetStageStepConfigColumnsViewModel> GetTreasuryLineByFundTypeAdvanceColumns(short stageId, int workflowId);
    Task<MyResultPage<NewTreasuryLineDisplay>> Display(GetPageViewModel model, int userId, byte roleId);
    Task<MyResultPage<NewTreasuryLineDisplay>> GetHeader(GetPageViewModel model);
    Task<MyResultStageStepConfigPage<List<NewTreasuryLines>>> GetPage(NewGetPageViewModel model);
    Task<NewTreasuryLineSum> GetTreasuryLineSum(NewGetPageViewModel model);
    Task<MyResultPage<NewTreasuryLineGetReccord>> GetRecordById(GetTreasuryLine model);
    Task<MyResultStatus> Save(NewTreasuryLineModel model, int CompanyId);

    Task<MyResultStatus> InsertPreviousStageLinests(List<TreasuryLineGetRecord> modelList, int companyId,
        int createUserId, bool isDefaultCurrency);

    Task<MyResultStatus> Delete(GetTreasuryLine model, int companyId);
    Task<List<MyDropDownViewModel>> GetAccountDetail(GetAccountDetail model);
    Task<NewTreasuryLines> GetTreasuryCheckBankInfo(int id);
    GetStageStepConfigColumnsViewModel GetRequestSimpleColumns(int companyId, byte fundtypeId);
    GetStageStepConfigColumnsViewModel GetRequestAdvanceColumns(int companyId, byte fundtypeId);

    Task<MyResultStageStepConfigPage<Dtos.FM.NewTreasuryLine.TreasuryRequest>> GetTreasuryLineRequest(
        GetPageViewModel model, int companyId);

    Task<List<TreasuryLinePostingGroup>> GetTreasuryLineListForPost(List<ID> treasuryIds, int companyId, int typeId);

    Task<long> ExistCheckInfo(long checkIdentityId, string sayadNumber, long BankIssuerId, long CheckSerial,
        long DocumentNo);

    Task<CSVViewModel<IEnumerable>> TreasuryLineCSV(NewGetPageViewModel model);
    Task<int> ExistTreasuryLine(int id);

    Task<MyResultStatus> ValidationBeforeSave(NewTreasuryLineModel model, int companyId);
}