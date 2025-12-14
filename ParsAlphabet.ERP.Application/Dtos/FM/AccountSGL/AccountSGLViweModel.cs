namespace ParsAlphabet.ERP.Application.Dtos.FM.AccountSGL;

public class AccountSGLGetPage
{
    public int GLId { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
    public string GlName { get; set; }
    public bool IsActive { get; set; }
    public string AccountDetailRequired { get; set; }
}

public class AccountSGLGetRecord
{
    public byte Lang { get; set; }
    public int GLId { get; set; }
    public string GlName { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
    public short AccountCategoryId { get; set; }
    public bool IsActive { get; set; }
    public byte AccountDetailRequired { get; set; }
    public byte CostCenterRequired { get; set; }
    public List<ID> Ids { get; set; }
    public List<ID> CurrencyIds { get; set; }
}

public class Get_AccountSGL : CompanyViewModel
{
    public int Id { get; set; }
    public int GLId { get; set; }
    public byte IsActive { get; set; }
    public short NoSeriesId { get; set; }
}

public class AccountSGLSetting
{
    public byte AccountDetailRequired { get; set; }
}

public class AccountSGLSearchDropDown : MyDropDownViewModel
{
    public int AccountDetailRequired { get; set; }

    public string AccountDetailRequiredTitle =>
        AccountDetailRequired == 0 ? "ندارد" : AccountDetailRequired == 1 ? "اجباری" : "اختیاری";

    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => $"{AccountGLId} - {AccountGLName}";
    public bool IsActive { get; set; }
    public string IsActiveStr => IsActive ? "فعال" : "غیرفعال";
}