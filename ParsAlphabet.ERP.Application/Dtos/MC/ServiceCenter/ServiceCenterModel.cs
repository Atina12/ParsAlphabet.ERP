using System.ComponentModel;

namespace ParsAlphabet.ERP.Application.Dtos.MC.ServiceCenter;

[DisplayName("ServiceCenter")]
public class ServiceCenterModel : CompanyViewModel
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public string Unit { get; set; }
    public bool IsActive { get; set; }
    public string Opr { get; set; }
}