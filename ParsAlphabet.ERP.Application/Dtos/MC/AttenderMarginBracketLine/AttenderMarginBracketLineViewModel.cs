namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderMarginBracketLine;

public class AttenderMarginBracketLineGetPage : CompanyViewModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public int RowNumber { get; set; }
    public decimal StartAmount { get; set; }
    public decimal EndAmount { get; set; }
    public byte PriceTypeId { get; set; }
    public string PriceTypeName { get; set; }
    public string PriceType => IdAndTitle(PriceTypeId, PriceTypeName);
    public decimal AttenderCommissionValue { get; set; }

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
}

public class AttenderMarginBracketLineGetRecord
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public int RowNumber { get; set; }
    public decimal StartAmount { get; set; }
    public decimal EndAmount { get; set; }
    public byte PriceTypeId { get; set; }
    public decimal AttenderCommissionValue { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
}