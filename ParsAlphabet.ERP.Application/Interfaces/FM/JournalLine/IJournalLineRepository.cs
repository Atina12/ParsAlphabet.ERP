using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.JournalLine;

public interface IJournalLineRepository
{
    GetColumnsViewModel GetHeaderColumns(int companyId);
    GetColumnsViewModel GetJournalLineSimpleColumns();
    GetColumnsViewModel GetJournalLineAdvanceColumns();
    GetColumnsViewModel GetJournalLineImportExcelColumns();
    Task<MyResultPage<JournalLineGetPage>> Display(GetPageViewModel model, int userId);
    Task<MyResultPage<JournalLineGetPage>> DisplayHeader(GetPageViewModel model);
    Task<MyResultPage<List<JournalLines>>> GetJournalLinePage(NewGetPageViewModel model);
    Task<JournalLineSum> GetJournalLineSum(NewGetPageViewModel model);
    Task<MyResultPage<JournalLineGetRecord>> GetRecordByIds(int id);
    Task<JournalLineFooter> GetJournalLineFooter(int companyId,int? id);
    Task<MyResultQuery> Insert(JournalLineSingleSave model);
    Task<MyResultQuery> Update(JournalLineSingleSave model);
    Task<MyResultStatus> DeleteJournalLine(GetJournalLine model, int companyId, int userId);
    Task<List<int>> GetIdentitiesJournal(GetJournalPostGroup model);
    Task<List<MyDropDownViewModel>> GetAccountDetail(GetAccountDetail model);
    Task<List<JournalPostGroupResultStatus>> PostGroupJournal(AddDocumentPostingGroup model);
    Task<MyResultStatus> UndoJournalPostGroupLine(List<GetJournalPostGroup> model);

    Task<MyResultDataQuery<MyResultStatus>> ImportExcellJournalLine(ExcelJournalLineModel model, int userId,
        int currencyId, int companyId);

    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    bool BulkInsertJournalLine(List<JournalLineModel> model);
    Task UpdateAmountCreditDebit(int journalId, int companyId, decimal amountDebit, decimal amountCredit);
}