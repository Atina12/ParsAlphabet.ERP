namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCash;

public class AdmissionReuestAndPayment
{
    public AdmissionReuestAndPayment()
    {
        Requests = new List<AdmissionCashRequest>();
        Payments = new List<AdmissionCashPayment>();
    }

    public List<AdmissionCashRequest> Requests { get; set; }
    public List<AdmissionCashPayment> Payments { get; set; }
}

public class AdmissionCashPayment
{
    public short RowNumber { get; set; }
    public short InOut { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string AccountNo { get; set; }
    public string RefNo { get; set; }
    public string CardNo { get; set; }
    public int DetailAccountId { get; set; }
    public string DetailAccountName { get; set; }
    public decimal Amount { get; set; }
    public decimal ExchangeRate { get; set; }
    public int AdmissionMasterId { get; set; }
    public int AdmissionTypeId { get; set; }
    public int Id { get; set; }
    public string CashierName { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull();
    public string UserFullName { get; set; }
    public int UserId { get; set; }
    public bool IsAccess { get; set; }
    public int PosId { get; set; }
    public string PosName { get; set; }
}

public class AdmissionCashRequestSearchModel : PaginationReport
{
    public int? AdmissionMasterId { get; set; }
    public short? StageId { get; set; }
    public int? WorkflowId { get; set; }
    public string PatientNationalCode { get; set; }
    public string PatientFullName { get; set; }
}