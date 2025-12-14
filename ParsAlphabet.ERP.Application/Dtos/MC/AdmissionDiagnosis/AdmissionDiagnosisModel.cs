using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;

public class AdmissionDiagnosisModel
{
    public int AdmissionId { get; set; }
    public byte RowNumber { get; set; }
    public byte StatusId { get; set; }
    public int DiagnosisResonId { get; set; }
    public byte ServerityId { get; set; }
    public string Comment { get; set; }
    public DateTime? DiagnosisDateTime { get; set; }

    [NotMapped]
    public string DiagnosisDateTimePersian
    {
        get => DiagnosisDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
        set
        {
            var str = value.ToMiladiDateTime();
            DiagnosisDateTime = str == null ? null : str.Value;
        }
    }
}