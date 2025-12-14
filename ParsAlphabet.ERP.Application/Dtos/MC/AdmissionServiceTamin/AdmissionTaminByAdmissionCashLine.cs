namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceTamin;

public class AdmissionTaminByAdmissionCashLine
{
    public AdmissionTamin AdmissionTamin { get; set; }
    public AdmissionTaminCashLineModel AdmissionCashLine { get; set; }
    public bool UpdateAdmission { get; set; } = false;
    public bool Reimburesment { get; set; }
}