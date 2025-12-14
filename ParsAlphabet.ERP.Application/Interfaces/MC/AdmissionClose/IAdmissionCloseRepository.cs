using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionClose;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionClose;

public interface IAdmissionCloseRepository
{
    GetColumnsViewModel GetColumns();
    Task<DateTime> GetCloseDate(int id);
    Task<MyResultQuery> AdmissionCloseInsert(GetAdmissionCloseWorkday model);

    Task<MyResultDataQuery<List<AdmissionCloseWorkDay>>> AdmissionCloseCalculate(GetAdmissionCloseWorkday model,
        int userId);

    Task<List<AdmissionCloseWorkDay>> AdmissionCloseLineDisplay(GetAdmissionCloseWorkday model, int userId);
    Task<IEnumerable<AnnouncementDetailCloseLine>> GetAnnouncementAdmissionCloseLine(GetCloseLine model);
    Task<IEnumerable<RealDetailCloseLine>> GetRealAdmissionCloseLine(GetRealAnnouncementDetail model);
    Task<SettlementResult> CheckSettlementSummary(GetSettlement model);
    Task<SettlementResult> CheckSettlementAnnouncement(GetSettlement model);
    Task<GetAdmissionClose> GetRecordById(int id);
    Task<decimal> GetSumAdmissionClose(int headerId);
    Task<long> GetTreasuryId(int closeId);
    Task<MyResultQuery> AdmissionCloseLineSave(AdmissionCloseLineSave model);
    Task<AdmissionCloseInsertResult> AdmissionCloseDocumentInsert(GetCloseLine model);
    Task<MyResultStatus> GetWorkDayStatus(string dayDatePersoan, short branchId);
    Task<MyResultStatus> RemoveRealLine(int id);
    Task<MyResultPage<List<AdmissionCloseGetPage>>> GetPage(NewGetPageViewModel model, int userId);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, int userId);
    Task<CSVViewModel<IEnumerable>> DifferenceCsv(GetAdmissionCloseWorkday model);
    Task<CSVViewModel<IEnumerable>> AdmissionCloseCSV(int id);
    Task<List<AdmissionCashDifference>> AdmissionCashDifference(GetAdmissionCloseWorkday model);
    Task<bool> CheckExistOpenCash(string dateTime, short branchId, int companyId);
    Task<MyResultPage<List<AdmissionCloseRequest>>> AdmissionCloseSearch(AdmissionCloseRequestSearchModel model);
    Task<bool> CheckExist(int id, int companyId, int userId);

    Task<MyResultStatus> Delete(int id);
}