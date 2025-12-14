using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportControl;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.ReportControl;

public interface IReportControlRepository
{
    GetColumnsViewModel ServiceControlGetColumns();
    Task<ReportViewModel<List<ServiceControl>>> ServiceControlGetPage(GetServiceControl model);
    Task<CSVViewModel<IEnumerable>> ServiceControlCsv(GetServiceControl model);
    GetColumnsViewModel InsurerControlGetColumns(byte isnurerTypeId);
    Task<ReportViewModel<List<InsurerControl>>> InsurerControlGetPage(GetServiceControl model);
    Task<CSVViewModel<IEnumerable>> InsurerControlCsv(GetServiceControl model);
    GetColumnsViewModel AttenderControlGetColumns(byte type);
    Task<ReportViewModel<List<AttenderControl>>> AttenderControlGetPage(GetAttenderControl model);
    Task<CSVViewModel<IEnumerable>> AttenderControlCsv(GetAttenderControl model);
}