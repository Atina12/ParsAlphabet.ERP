namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasuryBond;

public class TreasuryBondGetPage
{
    public int Id { get; set; }
    public string BankAccountName { get; set; }
    public byte RowNumber { get; set; }
    public string BondSerialNo { get; set; }
    public int BondNo { get; set; }
    public short BondCountNo { get; set; }
    public bool IsActive { get; set; }
}

public class TreasuryBondGetRecord
{
    public int Id { get; set; }
    public int BankAccountId { get; set; }
    public string BondSerialNo { get; set; }
    public long BondNo { get; set; }
    public short BondCountNo { get; set; }
    public bool IsActive { get; set; }
}