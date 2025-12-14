using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportDental;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.ReportDental;

public interface IDentalReportRepository
{
    Task<ReportViewModel<List<object>>> DentalReportPreview(GetDentalReportViewModel model);
    GetColumnsViewModel DentalReportGetColumns();
    Task<CSVViewModel<IEnumerable>> DentalReportCSV(GetDentalReportViewModel model);
}