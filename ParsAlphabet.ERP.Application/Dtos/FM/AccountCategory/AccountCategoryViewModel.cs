namespace ParsAlphabet.ERP.Application.Dtos.FM.AccountCategory;

public class AccountCategoryGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public byte IncomeBalanceId { get; set; }
    public string IncomeBalanceName { get; set; }
    public string IncomeBalance => IdAndTitle(IncomeBalanceId, IncomeBalanceName);
    public bool IsActive { get; set; }
}

public class AccountCategoryGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public byte IncomeBalanceId { get; set; }
    public bool IsActive { get; set; }
}