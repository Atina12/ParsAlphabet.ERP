namespace ParsAlphabet.ERP.Application.Dtos.GN.CurrencyExchange;

public class CurrencyExchangeGetPage
{
    public int Id { get; set; }
    public string CurrencyName { get; set; }
    public string UpdateDatePersian { get; set; }
    public decimal PurchaseRate { get; set; }
    public decimal SalesRate { get; set; }
}

public class CurrencyExchangeGetRecord
{
    public int Id { get; set; }
    public byte? CurrencyId { get; set; }
    public DateTime? UpdateDate { get; set; }

    public string UpdateDatePersian
    {
        get => UpdateDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            UpdateDate = str == null ? null : str.Value;
        }
    }

    public decimal PurchaseRate { get; set; }
    public decimal SalesRate { get; set; }
}

public class GetExchangeRate : CompanyViewModel
{
    public DateTime CreateDate { get; set; } = DateTime.Now;
    public byte InOut { get; set; }
    public byte CurrencyId { get; set; }
}