namespace ParsAlphabet.ERP.Application.Dtos.MC.ReportDental;

public class GetDentalReportViewModel : PaginationReport
{
    public DateTime? FromDate => FromDatePersian.ToMiladiDateTime();
    public string FromDatePersian { get; set; }
    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();
    public string ToDatePersian { get; set; }
    public int PatientId { get; set; }
    public int BasicInsurerId { get; set; }
    public int BasicInsuranceBoxId { get; set; }
    public int CompInsuranceBoxId { get; set; }
    public int ThirdPartyId { get; set; }
    public byte ShabadStatus { get; set; }
    public int UserId { get; set; }
    public int AttenderId { get; set; }
    public int ServiceCenterId { get; set; }
    public int SpecialityId { get; set; }
    public byte IsMissing { get; set; }
    public short ToothId { get; set; }
    public int PartId { get; set; }
    public int SegmentId { get; set; }
}