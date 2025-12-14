using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FM.Report;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.Report;

public interface IJournalReportRepository
{
    GetColumnsViewModel JournalSearchReportGetColumns();
    GetColumnsViewModel LevelGlGetColumns(bool displayRemaining);
    GetColumnsViewModel LevelSGlGetColumns(bool displayRemaining, bool displayCsv);
    GetColumnsViewModel LevelAccountDetailGetColumns(bool displayRemaining, bool displayCsv);
    Tuple<DateTime?, DateTime?> GenerateDateRange(DateTime fromDate2);
    Task<CSVViewModel<IEnumerable>> JournalSearchReportCsv(GetJournalSearchReport model);
    Task<ReportViewModel<List<JournalSearchReport>>> JournalSearchReportPreview(GetJournalSearchReport model);
    Task<JournalSearchReportSum> JournalSearchReportPreviewSum(GetJournalSearchReport model);
    Task<JournalSearchReportSum> JournalTrialSearchReportPreviewSum(GetJournaltrialSearchReport model);

    Task<ReportViewModel<List<JournalDetailReport>>> JournalDetailReportPreview(GetJournaltrialSearchReport model,
        bool displayCsv = false);

    Task<List<GetJournalHeaderTreeViewModel>> GetJournalTrialReportJsonForTree(GetJournalTreeReport model);
    Task<MemoryStream> LevelGlCsv(GetJournaltrialSearchReport model);
    Task<MemoryStream> LevelSglCsv(GetJournaltrialSearchReport model);
    Task<MemoryStream> LevelAccountDetailCsv(GetJournaltrialSearchReport model);
    Task<MemoryStream> NoteGlCsv(GetJournaltrialSearchReport model);
    Task<MemoryStream> NoteSglCsv(GetJournaltrialSearchReport model);
    Task<MemoryStream> NoteAccountDetailCsv(GetJournaltrialSearchReport model);
    Task<MemoryStream> NoteNewsPaperCsv(GetJournaltrialSearchReport model);
}