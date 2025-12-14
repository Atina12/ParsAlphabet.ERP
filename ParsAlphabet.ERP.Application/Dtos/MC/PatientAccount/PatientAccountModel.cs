namespace ParsAlphabet.ERP.Application.Dtos.MC.PatientAccount;

public class PatientAccountModel : CompanyViewModel
{
    public int? PatientId { get; set; }
    public short? BankId { get; set; }
    public string BankAccountNo { get; set; }
    public string BankShebaNo { get; set; }
    public string BankCardNo { get; set; }
    public DateTime CreateDateTime { get; set; }
}