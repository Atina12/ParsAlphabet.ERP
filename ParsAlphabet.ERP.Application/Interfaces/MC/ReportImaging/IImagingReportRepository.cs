using ParsAlphabet.ERP.Application.Dtos.MC.ReportImaging;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.ReportImaging;

public interface IImagingReportRepository
{
    GetColumnsViewModel ImagingReportGetColumns();
    Task<ReportViewModel<List<ImagingReport>>> ImagingReportPreview(ImagingReportInputModel model);
    Task<SumImagingReport> ImagingReportSumTotal(ImagingReportInputModel model);
    Task<MemoryStream> ImagingReportCSV(ImagingReportInputModel model);
    Task<byte[]> GenerateImagePDF(ImagingReportInputModel model, int userId);
}