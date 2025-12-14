namespace ParsAlphabet.ERP.Application.Dtos.MC.PatientAccount;

public class PatientAccountViewModel
{
    public class PatientAccountGetPage
    {
        public int PatientId { get; set; }
        public string FullName { get; set; }
        public string NationalCode { get; set; }
        public short BankId { get; set; }
        public string BankName { get; set; }
        public string Bank => IdAndTitle(BankId, BankName);
        public string BankAccountNo { get; set; }
        public string BankShebaNo { get; set; }
        public string BankCardNo { get; set; }
    }

    public class PatientAccountGetRecord
    {
        public int PatientId { get; set; }
        public string FullName { get; set; }
        public string NationalCode { get; set; }
        public short BankId { get; set; }
        public string BankAccountNo { get; set; }
        public string BankShebaNo { get; set; }
        public string BankCardNo { get; set; }
    }
}