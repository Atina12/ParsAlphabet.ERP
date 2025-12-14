namespace ParsAlphabet.ERP.Application.Dtos.FM.Pos;

public class PosGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int BankAccountId { get; set; }
    public string BankAccounName { get; set; }
    public string TerminalNo { get; set; }
    public bool IsPcPos { get; set; }
    public string Cashier_IpAddress { get; set; }
    public bool IsActive { get; set; }

    public byte PosProviderId { get; set; }


    public string IconUrl
    {
        get
        {
            if (PosProviderId == 1)
                return "/StaticFiles/Pos/behpardakht.png";
            return "/StaticFiles/Pos/saman.png";
        }
    }

    public string AccountNo { get; set; }
    public string BankAccountName { get; set; }
    public string BankName { get; set; }
}

public class PosGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public short BankAccountId { get; set; }
    public string BankAccountName { get; set; }
    public short BankId { get; set; }
    public string BankName { get; set; }
    public string TerminalNo { get; set; }
    public bool IsPcPos { get; set; }
    public string Cashier_IpAddress { get; set; }
    public byte PosProviderId { get; set; }
    public int CashierId { get; set; }
    public bool IsActive { get; set; }
}

public class Get_PosBankName
{
    public short BankId { get; set; }
    public int BankAccountId { get; set; }
}

public class PosListDropDown
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string PosProviderId { get; set; }
}