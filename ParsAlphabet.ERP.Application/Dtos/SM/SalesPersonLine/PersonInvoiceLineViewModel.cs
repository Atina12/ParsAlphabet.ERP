using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.SM.SalesPersonLine;

public class PersonInvoiceLineGetPage
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public byte InvoiceTypeId { get; set; }
    public short BranchId { get; set; }

    public string BranchName { get; set; }

    //public byte ItemTypeId { get; set; }
    //public int OrderNo { get; set; }
    public byte? CurrencyId { get; set; }
    public byte? PersonTypeId { get; set; }
    public int? PersonId { get; set; }
    public short? EmployeeId { get; set; }
    public DateTime? InvoiceDate { get; set; }
    public string InvoiceDatePersian { get; set; }
    public byte? ReturnReasonId { get; set; }
    public string Note { get; set; }
    public int UserId { get; set; }

    public string UserFullName { get; set; }

    //public short Quantity { get; set; }
    public DateTime CreateDateTime { get; set; }
    public bool OfficialInvoice { get; set; }
    public byte Status { get; set; }
    public decimal DiscAmount { get; set; }
    public MyResultPage<List<InvoiceLines>> JsonInvoiceLineList { get; set; }
    public string JsonInvoiceLine { get; internal set; }
}

public class PersonInvoiceLineGetRecord
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public int HeaderId { get; set; }

    public int RowNumber { get; set; }

    // public short BranchId { get; set; }
    public int ItemTypeName { get; set; }
    public int ItemTypeId { get; set; }
    public int ItemId { get; set; }
    public short Quantity { get; set; }
    public float Price { get; set; }
    public byte VATPer { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public float ExchangeRate { get; set; }
    public float DiscountPer { get; set; }
    public float NetAmount { get; set; }
    public float VatAmount { get; set; }
    public float DiscAmount { get; set; }
    public float NetAmountPlusVAT { get; set; }
    public float GrossAmount { get; set; }
}

public class InvoiceLines
{
    public int HeaderId { get; set; }
    public int InvoiceId { get; set; }
    public byte InvoiceTypeId { get; set; }
    public int RowNumber { get; set; }
    public short BranchId { get; set; }
    public string ItemId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemName { get; set; }
    public short Quantity { get; set; }
    public float Price { get; set; }
    public byte VatPer { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public float DiscPercent { get; set; }
    public byte PricingModelId { get; set; }
    public float MinPrice { get; set; }
    public float MaxPrice { get; set; }
    public short CustomerDiscGroupId { get; set; }
    public bool AllowInvoiceDisc { get; set; }
    public float NetAmount { get; set; }
    public float VatAmount { get; set; }
    public float DiscAmount { get; set; }
    public float NetAmountPlusVAT { get; set; }
    public float GrossAmount { get; set; }
    public short Status { get; set; }
    public decimal ExchangeRate { get; set; }
    public string StatusMsg { get; set; }
}

public class GetPersonInvoiceLine
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short RowNumber { get; set; }
}

public class PersonOrderList
{
    public int Id { get; set; }
    public int OrderTypeId { get; set; }
    public string BranchName { get; set; }
    public short BranchId { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string PersonGroupTypeName { get; set; }
    public int PersonId { get; set; }
    public string PersonName { get; set; }
    public short? EmployeeId { get; set; }
    public string EmployeeName { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public string ReturnReasonName { get; set; }
    public string OrderDatePersian { get; set; }
    public string CreateDatePersian { get; set; }
    public string StatusName { get; set; }
    public byte Status { get; set; }
}

public class GetPersonOrderList : CompanyViewModel
{
    [Display(Name = "کد شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short BranchId { get; set; }

    [Display(Name = "شناسه سفارش")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int OrderTypeId { get; set; }

    [Display(Name = "شناسه گروه اشخاص")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte PersonGroupTypeId { get; set; }

    [Display(Name = "شناسه شخص")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int PersonId { get; set; }

    public byte CurrencyId { get; set; }

    public bool OfficialInvoice { get; set; }
}

public class PersonOrderLineList
{
    public int HeaderId { get; set; }
    public byte OrderTypeId { get; set; }
    public short BranchId { get; set; }
    public int RowNumber { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public int ItmId { get; set; }
    public string ItmName { get; set; }
    public short QuantityToOrder { get; set; }
    public short QuantityOrdered { get; set; }
    public short QuantityBalance { get; set; }
}

public class GetPersonOrderLine
{
    [Display(Name = "شناسه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int Id { get; set; }

    [Display(Name = "شناسه سفارش")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte OrderTypeId { get; set; }

    [Display(Name = "کد شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short BranchId { get; set; }
}

public class GetPersonOrderLineList : CompanyViewModel
{
    public List<GetPersonOrderLine> GetPersonOrderLines { get; set; }
}