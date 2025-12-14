namespace ParsAlphabet.ERP.Application.Dtos.SM.SalesPersonLine;

public class SalesPersonOrderLineGetPage
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short RowNumber { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
    public byte CurrencyId { get; set; }
    public byte PersonTypeId { get; set; }
    public int PersonId { get; set; }
    public short EmployeeId { get; set; }
    public DateTime? OrderDate { get; set; }
    public string OrderDatePersian { get; set; }
    public byte ReturnReasonId { get; set; }
    public string Note { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian { get; set; }
    public decimal GrossAmount { get; set; }
    public byte Status { get; set; }
    public bool OfficialInvoice { get; set; }
    public string JsonOrderLine { get; set; }
    public MyResultPage<List<PersonOrderLine>> JsonOrderLineList { get; set; }
}

public class DeliverOrderGetPage
{
    public string Opr { get; set; }
    public int HeaderId { get; set; }
    public int OrderTypeId { get; set; }
    public byte RowNumber { get; set; }
    public DateTime? RequestedReceiptDate { get; set; }

    public string RequestedReceiptDatePersian
    {
        get => RequestedReceiptDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();

            RequestedReceiptDate = str == null ? null : str.Value;
        }
    }

    public DateTime? ExpectedReceiptDate { get; set; }

    public string ExpectedReceiptDatePersian
    {
        get => ExpectedReceiptDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();

            ExpectedReceiptDate = str == null ? null : str.Value;
        }
    }
}

public class ShipMentOrderGetPage
{
    public string Opr { get; set; }
    public int HeaderId { get; set; }
    public int OrderTypeId { get; set; }
    public byte RowNumber { get; set; }
    public string ShipmentMethodId { get; set; }
    public string VendorId { get; set; }
}

public class SalesPersonOrderLineGetRecord
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte CurrencyId { get; set; }
    public short RowNumber { get; set; }
    public int ItemTypeName { get; set; }
    public int ItemTypeId { get; set; }
    public string ItemId { get; set; }
    public decimal Quantity { get; set; }
    public byte VATPer { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public decimal DiscountPer { get; set; }
    public decimal Price { get; set; }
    public decimal NetAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public bool AllowInvoicePrice { get; set; }
    public decimal GrossAmount { get; set; }
    public DateTime? OrderDate { get; set; }
    public string OrderDatePersian => OrderDate.ToPersianDateStringNull("{0}/{1}/{2}");
}

public class PersonOrderLine
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short RowNumber { get; set; }
    public short StageId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemId { get; set; }
    public DateTime? OrderDate { get; set; }
    public string OrderDatePersian { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public byte VATPer { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public bool AllowInvoiceDisc { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal DiscountPercent { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
    public decimal VatAmount { get; set; }
    public decimal NetAmountPlusVat { get; set; }
    public short Status { get; set; }
    public string StatusMessage { get; set; }
}

public class GetPersonOrderId
{
    public int Id { get; set; }
}

public class GetRecordByIds
{
    public int Id { get; set; }
    public int HeaderID { get; set; }
    public int OrderTypeID { get; set; }
    public int RowNumber { get; set; }
}

public class AllocatePersonOrderLine
{
    public int Id { get; set; }
    public byte OrderTypeId { get; set; }
    public short BranchId { get; set; }
    public byte ItemTypeId { get; set; }
    public int ItemId { get; set; }
}

public class AllocatePersonOrderLineList : CompanyViewModel
{
    public int HeaderId { get; set; }
    public List<AllocatePersonOrderLine> AllocatePersonOrderLines { get; set; }
}