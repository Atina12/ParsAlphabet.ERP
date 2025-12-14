namespace ParsAlphabet.ERP.Application.Dtos.SM.SalesPersonLine;

public class PersonInvoiceLineModel : CompanyViewModel
{
    public int HeaderId { get; set; }
    public short RowNumber { get; set; }
    public byte ItemTypeName { get; set; }
    public int ItemId { get; set; }
    public short Quantity { get; set; }
    public decimal Price { get; set; }
    public byte VatPer { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public float ExchangeRate { get; set; }
    public short DiscountPer { get; set; }
    public int DiscAmount { get; set; }
}