namespace ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLine;

public class SaleOrderLineModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public int HeaderAccountDetailId { get; set; }
    public short BranchId { get; set; }
    public byte ItemTypeId { get; set; }
    public byte InOut { get; set; }
    public int ItemId { get; set; }
    public short CategoryId { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public short VatId { get; set; }
    public short VatNoSeriesId { get; set; }
    public int VatAccountDetailId { get; set; }
    public byte VatPer { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal VATAmount { get; set; }
    public bool AllowInvoiceDiscount { get; set; }
    public decimal DiscountValue { get; set; }
    public byte Discount { get; set; }
    public byte DiscountType { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
    public decimal NetAmountPlusVAT { get; set; }
    public short StageId { get; set; }
    public byte CurrencyId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public DateTime? OrderDate { get; set; }

    public string OrderDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            OrderDate = str == null ? null : str.Value;
        }
    }

    public bool IsQuantity { get; set; }
    public List<SaleOrderPostingGroupModel> SaleOrderPostingGroup { get; set; }
    public short UnitId { get; set; }
    public short? SubUnitId { get; set; }
    public decimal Ratio { get; set; }
    public decimal TotalQuantity { get; set; }
    public string AttributeIds { get; set; }
    public short? IdSubUnit { get; set; }
}

public class SaleOrderPostingGroupModel
{
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int AccountDetailId { get; set; }
    public short NoSeriesId { get; set; }
    public byte PostingGroupTypeLineId { get; set; }
    public byte PostingGroupTypeId { get; set; }
    public string CategoryName { get; set; }
    public string PostingGroupTypeLineName { get; set; }
}

public class SaleOrderLineDetailModel
{
    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public string SubUnitName { get; set; }
    public string UnitNames => UnitId > 0 ? UnitName + '_' + SubUnitName : "";
    public string Ratio { get; set; }
    public string AttributeName { get; set; }
    public string ItemName { get; set; }
    public int PersonOrderLineId { get; set; }
    public int ItemId { get; set; }
    public string ItemNameIds => ItemId > 0 ? IdAndTitle(ItemId, ItemName) : "";
}