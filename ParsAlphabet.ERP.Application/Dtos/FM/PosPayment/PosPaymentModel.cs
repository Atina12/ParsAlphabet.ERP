namespace ParsAlphabet.ERP.Application.Dtos.FM.PosPayment;

public class PosPaymentModel
{
    public string RefNo { get; set; }
    public string CardNo { get; set; }
    public string TerminalNo { get; set; }
    public string AccountNo { get; set; }
    public string Amount { get; set; }
    public int PosId { get; set; }
    public string PaymentId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}