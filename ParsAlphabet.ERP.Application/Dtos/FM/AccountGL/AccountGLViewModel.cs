namespace ParsAlphabet.ERP.Application.Dtos.FM.AccountGL;

public class AccountGLGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string CategoryName { get; set; }
    public string IncomeBalanceTypeName { get; set; }
    public string NatureTypeName { get; set; }
    public bool IsActive { get; set; }

    public byte AccountDetailRequired { get; set; }
    public byte CostCenterRequired { get; set; }
}

public class AccountGLGetRecord
{
    public byte Lang { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
    public byte CategoryId { get; set; }
    public byte NatureId { get; set; }
    public bool IsActive { get; set; }
}

public class AccountGLCategoryDropDown : MyDropDownViewModel
{
    public string AccountCategoryName { get; set; }
}

public class AccountGLSearchViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
    public string IsActiveStr => IsActive ? "فعال" : "غیرفعال";
}