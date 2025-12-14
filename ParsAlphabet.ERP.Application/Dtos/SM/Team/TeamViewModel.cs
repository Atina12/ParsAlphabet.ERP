namespace ParsAlphabet.ERP.Application.Dtos.SM.Team;

public class TeamGetPage
{
    public short Id { get; set; }
    public string Name { get; set; }
    public string CommissionBaseName { get; set; }
    public string CommissionMethodName { get; set; }
    public bool IsActive { get; set; }
}

public class TeamGetRecord
{
    public short Id { get; set; }
    public string Name { get; set; }
    public byte CommissionBaseId { get; set; }
    public byte CommissionMethodId { get; set; }
    public bool IsActive { get; set; }
}