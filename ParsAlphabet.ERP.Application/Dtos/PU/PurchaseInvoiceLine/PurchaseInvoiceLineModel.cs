using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;

namespace ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoiceLine;

public class PurchaseInvoiceLineModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public int HeaderAccountDetailId { get; set; }
    public short HeaderNoSeriesId { get; set; }

    public short BranchId { get; set; }
    public short RowNumber { get; set; }
    public byte ItemTypeId { get; set; }
    public byte InOut { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public short CategoryId { get; set; }
    public string CategoryName { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public short? VatId { get; set; }
    public short VatNoSeriesId { get; set; }
    public int VatAccountDetailId { get; set; }
    public byte? VatPer { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal VATAmount { get; set; }
    public bool AllowInvoiceDiscount { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal DiscountAmount { get; set; }
    public byte Discount { get; set; }
    public byte DiscountType { get; set; }
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

    public List<PostingGroupbyTypeLineModel> PersonInvoicePostingGroup { get; set; }

    public short? UnitId { get; set; }
    public short? SubUnitId { get; set; }
    public decimal? Ratio { get; set; }
    public decimal TotalQuantity { get; set; }
    public string AttributeIds { get; set; }
    public short? IdSubUnit { get; set; }

    public int WorkflowId { get; set; }
    public byte StageClassId { get; set; }
    public int AccountDetailId { get; set; }
}

public class PurchaseOrderLineDetailViewModel
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