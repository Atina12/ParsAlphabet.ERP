namespace ParsAlphabet.ERP.Application.Dtos.FM.AccountSGLUserLine;

public class AccountSGLUserLineGetPage
{
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);

    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);

    public byte AccountDetailRequired { get; set; }

    public string AccountDetailRequiredTitle =>
        AccountDetailRequired == 3 ? "ندارد" : AccountDetailRequired == 1 ? "اجباری" : "اختیاری";

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public bool IsActive { get; set; }
}

public class AccountSGLUserLineAssignList
{
    public List<AccountSGLUserLineGetPage> Assigns { get; set; }
}

public class AccountSGLUserLineAssign
{
    public int CompanyId { get; set; }
    public int UserId { get; set; }
    public List<AssignModel> Assign { get; set; }
}

public class AssignModel
{
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
}

public class AccountSGLUserLineGetRecord
{
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int UserId { get; set; }
    public bool IsActive => UserId != 0 && AccountSGLId != 0;
}

public class Get_AccountSGLUserLine : CompanyViewModel
{
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int UserId { get; set; }
}