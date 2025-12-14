namespace ParsAlphabet.ERP.Application.Dtos.MC.InsurerPatient;

public class InsurerPatientModel : CompanyViewModel
{
    public int InsurerId { get; set; }
    public byte InsurerTypeId { get; set; }
    public int PatientId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public bool IsActive { get; set; }
}