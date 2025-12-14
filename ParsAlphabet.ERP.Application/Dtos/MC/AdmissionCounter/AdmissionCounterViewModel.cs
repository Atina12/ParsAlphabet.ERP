namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCounter;

public class AdmissionCounterGetPage
{
    public short Id { get; set; }
    public int CounterUserId { get; set; }
    public string CounterUserFullName { get; set; }
    public string CounterUser => IdAndTitle(CounterUserId, CounterUserFullName);

    public string BranchName { get; set; }
    public short BranchId { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public string CounterTypeName { get; set; }

    public int CashierId { get; set; }
    public string CashierName { get; set; }
    public string Cashier => IdAndTitle(CashierId, CashierName);

    public bool IsActive { get; set; }
}

public class AdmissionCounterGetRecord
{
    public short Id { get; set; }
    public byte CounterTypeId { get; set; }
    public bool IsActive { get; set; }
    public int CashierId { get; set; }
    public int CounterUserId { get; set; }
    public short BranchId { get; set; }
}

public class AdmissionCounterPosDropDown
{
    public short Id { get; set; }
    public string Name { get; set; }
    public string IconUrl { get; set; }
}