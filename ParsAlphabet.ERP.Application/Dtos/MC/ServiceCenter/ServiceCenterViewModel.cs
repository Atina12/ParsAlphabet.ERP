namespace ParsAlphabet.ERP.Application.Dtos.MC.ServiceCenter;

public class ServiceCenterGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int departmentId { get; set; }
    public string DepartmentNameId => IdAndTitle(departmentId, Name);
    public string Unit { get; set; }
    public bool IsActive { get; set; }
}

public class ServiceCenterGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int DepartmentId { get; set; }
    public string Unit { get; set; }
    public bool IsActive { get; set; }
}