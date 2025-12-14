namespace ParsAlphabet.ERP.Application.Dtos.MC.Admission;

public class AdmissionByAdmissionCashLine
{
    public AdmissionCashLineModel AdmissionCashLine { get; set; }
    public AdmissionModel Admission { get; set; }
    public bool UpdateAdmission { get; set; } = false;
    public bool Reimburesment { get; set; }
}