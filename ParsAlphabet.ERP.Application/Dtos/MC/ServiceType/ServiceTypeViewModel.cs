namespace ParsAlphabet.ERP.Application.Dtos.MC.ServiceType;

public class ServiceTypeGetPage
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string NickName { get; set; }
    public string TerminologyId { get; set; }
    public bool IsActive { get; set; }
    public bool IsDental { get; set; }

    public short CostCenterId { get; set; }
    public string CostCenterName { get; set; }
    public string CostCenter => IdAndTitle(CostCenterId, CostCenterName);
}

public class ServiceTypeGetRecord
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string NickName { get; set; }
    public string TerminologyId { get; set; }
    public bool IsActive { get; set; }
    public bool IsDental { get; set; }
    public short CostCenterId { get; set; }
}