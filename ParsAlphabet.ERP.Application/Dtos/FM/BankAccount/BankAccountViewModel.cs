namespace ParsAlphabet.ERP.Application.Dtos.FM.BankAccount;

public class BankAccountGetPage
{
    public int Id { get; set; }
    public short BankId { get; set; }
    public string BankName { get; set; }
    public string Bank => IdAndTitle(BankId, BankName);
    public string AccountNo { get; set; }
    public string ShebaNo { get; set; }
    public string AccountName { get; set; }

    public string BankAccountCategoryName { get; set; }
    public long BankAccountCategoryId { get; set; }
    public string BankAccountCategory => IdAndTitle(BankAccountCategoryId, BankAccountCategoryName);

    public string BranchNo { get; set; }
    public string CountryName { get; set; }

    public string StateName { get; set; }
    public bool IsActive { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
}

public class BankAccountGetRecord
{
    public int Id { get; set; }
    public short BankId { get; set; }
    public string Name { get; set; }
    public string BankName { get; set; }
    public int BankAccountCategoryId { get; set; }
    public int BranchNo { get; set; }
    public string BranchName { get; set; }
    public string AccountNo { get; set; }
    public string ShebaNo { get; set; }
    public short LocCountryId { get; set; }
    public short LocStateId { get; set; }
    public short LocCityId { get; set; }
    public string Address { get; set; }
    public bool IsActive { get; set; }
    public string JsonAccountDetailList { get; set; }
}