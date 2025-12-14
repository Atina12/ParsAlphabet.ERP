namespace ParsAlphabet.ERP.Application.Dtos.MC.ReportPrescription;

public class GetPrescriptionReportViewModel : PaginationReport
{
    public int? Id { get; set; }
    public string FormDatePersian { get; set; }
    public DateTime? FromDate => FormDatePersian.ToMiladiDateTime();
    public string ToDatePersian { get; set; }
    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();
    public int? PatientId { get; set; }
    public int? BasicInsurerId { get; set; }
    public int? BasicInsuranceBoxId { get; set; }
    public int? CompInsuranceBoxId { get; set; }
    public int? ThirdPartyId { get; set; }
    public bool? ShabadStatus { get; set; }
    public int? UserId { get; set; }
    public int? AttenderId { get; set; }
    public short? ServiceCenterId { get; set; }
    public short? SpecialityId { get; set; }
    public short? ProductId { get; set; }
    public bool? IsCompounded { get; set; }
    public int? ImageServiceId { get; set; }
    public short? LabServiceId { get; set; }
    public short? StatusId { get; set; }
    public int? DiagnosisResonId { get; set; }
}