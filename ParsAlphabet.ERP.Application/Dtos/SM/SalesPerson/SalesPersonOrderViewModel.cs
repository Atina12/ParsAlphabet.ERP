namespace ParsAlphabet.ERP.Application.Dtos.SM.SalesPerson;

public class SalesPersonOrderGetPage
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string UserFullName { get; set; }
    public string ReturnReasonName { get; set; }
    public string OrderDatePersian { get; set; }
    public string CreateDateTimePersian { get; set; }
    public string Status { get; set; }
    public bool OfficialInvoice { get; set; }
}

public class GetSalesPersonOrder : CompanyViewModel
{
    public int Id { get; set; }
    public byte OrderTypeId { get; set; }
    public short BranchId { get; set; }
}

public class SalesPersonOrderGetRecord
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
    public byte CurrencyId { get; set; }
    public int OrderNo { get; set; }
    public DateTime OrderDate { get; set; }
    public string OrderDatePersian => OrderDate.ToPersianDateString("{0}/{1}/{2}");
    public byte ReturnReasonId { get; set; }
    public bool OfficialInvoice { get; set; }
    public byte Status { get; set; }
}