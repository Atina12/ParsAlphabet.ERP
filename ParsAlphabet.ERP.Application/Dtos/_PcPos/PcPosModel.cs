using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos._PcPos;

public class PcPosModel
{
    [Display(Name = "شناسه پوز")] public int PosId { get; set; }

    public string PayerId { get; set; }
    public string PcId { get; set; }

    [Display(Name = "مبلغ")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int Amount { get; set; }

    public string Ip { get; set; }
}

public class Payment
{
    public string ServiceCode { get; set; }
    public string PcId { get; set; }
    public string Amount { get; set; }
    public string PayerId { get; set; }
    public string MerchantMsg { get; set; }
    public string MerchantadditionalData { get; set; }
    public string CommunicationType { get; set; }
    public int SocketTimeout { get; set; }
    public int Port { get; set; }
    public string IP { get; set; }
}

public class ResultPcPos
{
    public string ReqID { get; set; }
    public string SerialTransaction { get; set; }

    public string TraceNumber { get; set; }
    public string TerminalNo { get; set; }
    public string TransactionDate { get; set; }
    public string TransactionTime { get; set; }
    public string PAN { get; set; }
    public string AccountNo { get; set; }
    public string ReasonCode { get; set; }
    public string ReturnCode { get; set; }
    public string PcID { get; set; }
    public string TotalAmount { get; set; }
    public int PosId { get; set; }
    public short BranchId { get; set; }
    public int Status { get; set; }
    public string StatusMessage { get; set; }
}