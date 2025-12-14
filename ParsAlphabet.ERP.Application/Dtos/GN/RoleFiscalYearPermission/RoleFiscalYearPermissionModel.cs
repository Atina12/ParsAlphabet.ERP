namespace ParsAlphabet.ERP.Application.Dtos.GN.RoleFiscalYearPermission;

public class RoleFiscalYearPermissionModel : CompanyViewModel
{
    public byte RoleId { get; set; }
    public List<FiscalYearPermissionList> FiscalYearPermissionList { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}

public class FiscalYearPermissionList
{
    public short Id { get; set; }

    public bool IsActive { get; set; }
}