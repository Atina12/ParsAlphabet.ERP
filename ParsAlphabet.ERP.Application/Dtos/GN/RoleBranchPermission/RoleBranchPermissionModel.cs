namespace ParsAlphabet.ERP.Application.Dtos.GN.RoleBranchPermission;

public class RoleBranchPermissionModel : CompanyViewModel
{
    public byte RoleId { get; set; }
    public List<BranchPermissionList> BranchPermissionList { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}

public class BranchPermissionList
{
    public short Id { get; set; }

    public bool IsActive { get; set; }
}