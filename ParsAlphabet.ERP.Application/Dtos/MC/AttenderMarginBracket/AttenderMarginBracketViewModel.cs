namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderMarginBracket;

public class AttenderMarginBracketGetPage : CompanyViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string NameEng { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
}

public class AttenderMarginBracketGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string NameEng { get; set; }
    public bool IsActive { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }

    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
}

public class AttenderMarginBracketDropDown : AttenderMarginBracketLine
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Text => $"{Id} - {Name}";
}

public class AttenderMarginBracketLine
{
    public decimal MinAmount { get; set; }
    public string MinAmountTitle => MinAmount.ToString("#,##0");
    public decimal MaxAmount { get; set; }
    public string MaxAmountTitle => MaxAmount.ToString("#,##0");
    public byte PriceTypeId { get; set; }
    public string PriceTypeName => PriceTypeId == 1 ? "درصد" : "نرخ";
    public decimal MinAttenderCommissionValue { get; set; }
    public decimal MaxAttenderCommissionValue { get; set; }

    public string AttenderCommissionValueName => MinAttenderCommissionValue > 0 && MaxAttenderCommissionValue > 0
        ? string.Format("{0}{1}{2}{3}", " از: ", MinAttenderCommissionValue.ToString("#,##0"), " تا: ",
            MaxAttenderCommissionValue.ToString("#,##0"))
        : MinAttenderCommissionValue.ToString("#,##0");
}