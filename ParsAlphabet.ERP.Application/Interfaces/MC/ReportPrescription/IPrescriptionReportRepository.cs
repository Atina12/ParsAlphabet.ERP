using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportPrescription;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.ReportPrescription;

public interface IPrescriptionReportRepository
{
    GetColumnsViewModel RepPrescriptionServiceGetColumn();
    Task<ReportViewModel<List<object>>> PrescriptionReportPreview(GetPrescriptionReportViewModel model);
    Task<CSVViewModel<IEnumerable>> PrescriptionReportCSV(GetPrescriptionReportViewModel model);
}