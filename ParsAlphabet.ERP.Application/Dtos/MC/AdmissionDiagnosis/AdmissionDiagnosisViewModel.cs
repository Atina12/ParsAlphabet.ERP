namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;

public class AdmissionDiagnosisLineList
{
    public int AdmissionId { get; set; }
    public byte RowNumber { get; set; }
    public byte StatusId { get; set; }
    public string StatusName { get; set; }
    public int DiagnosisReasonId { get; set; }
    public string DiagnosisReasonCode { get; set; }
    public string DiagnosisReasonName { get; set; }
    public byte ServerityId { get; set; }
    public string ServerityName { get; set; }
    public string Comment { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDatePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
    public string CreateTime => CreateDateTime.ToPersianDateString("{3}:{4}:{5}");
}