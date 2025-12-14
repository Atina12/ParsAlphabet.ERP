using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.Pos;

namespace ParsAlphabet.ERP.Application.Dtos.FM.Cahier;

public class CashierGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string BranchName { get; set; }
    public bool IsActive { get; set; }
    public bool IsStand { get; set; }
    public string IpAddress { get; set; }
}

public class CashierGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public short BranchId { get; set; }
    public bool IsActive { get; set; }
    public bool IsStand { get; set; }
    public string IpAddress { get; set; }
    public string PosListJSON { get; set; }
    public List<PosGetRecord> PosList => JsonConvert.DeserializeObject<List<PosGetRecord>>(PosListJSON);
}

public class GetCashierIdByIp
{
    public int Id { get; set; }
    public short BranchId { get; set; }
}

public class PosViewModel : MyDropDownViewModel
{
    public string BankAccountName { get; set; }
    public string AccountNo { get; set; }
}

public class cashStandViewModel : MyDropDownViewModel
{
    public string IpAddress { get; set; }
}