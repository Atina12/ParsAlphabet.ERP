namespace ParsAlphabet.ERP.Application.Dtos.SM.SalesPersonLine;

public class SalesPersonOrderLineModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short RowNumber { get; set; }
    public byte ItemTypeName { get; set; }
    public int ItemId { get; set; }
    public decimal Quantity { get; set; }
    public bool AllowInvoicePrice { get; set; }
    public decimal Price { get; set; }
    public byte VATPer { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public decimal ExchangeRate { get; set; }
    public bool AllowInvoiceDisc { get; set; }
    public byte DiscountPercent { get; set; }
    public decimal DiscountAmount { get; set; }
    public short StageId { get; set; }
    public byte CurrencyId { get; set; }

    public DateTime? OrderDate { get; set; }

    public string OrderDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            OrderDate = str == null ? null : str.Value;
        }
    }
}