namespace ParsAlphabet.ERP.Application.Dtos.SM.SalesPerson;

public class PersonInvoiceGetPage
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public byte InvoiceTypeId { get; set; }
    public short BranchId { get; set; }

    public string BranchName { get; set; }

    // public int OrderNo { get; set; }
    public byte? CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string PersonGroupTypeName { get; set; }
    public int? PersonId { get; set; }
    public string PersonName { get; set; }
    public short? EmployeeId { get; set; }
    public string EmployeeName { get; set; }
    public string UserFullName { get; set; }
    public string ReturnReasonName { get; set; }
    public string CreateDatePersian { get; set; }

    public string InvoiceDatePersian { get; set; }

    //public string OrderDatePersian { get; set; }
    public string Status { get; set; }

    // public byte? ReturnReasonId { get; set; }
    public bool OfficialInvoice { get; set; }
}

public class PersonInvoiceGetRecord
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public byte InvoiceTypeId { get; set; }
    public short BranchId { get; set; }
    public byte? CurrencyId { get; set; }
    public DateTime? InvoiceDate { get; set; }
    public string InvoiceDatePersian => InvoiceDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public byte? PersonTypeId { get; set; }
    public int? PersonId { get; set; }
    public short? EmployeeId { get; set; }
    public byte? ReturnReasonId { get; set; }
    public string Note { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDatePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
    public int UserId { get; set; }
    public byte Status { get; set; }
    public bool OfficialInvoice { get; set; }
}