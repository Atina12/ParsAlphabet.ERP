namespace ParsAlphabet.ERP.Application.Dtos.GN.RoleWorkflowPermission;

public class RoleWorklfowPermissionModel : CompanyViewModel
{
    public byte RoleId { get; set; }
    public List<WorkflowPermissionList> WorkflowPermissionList { get; set; }
    public int? CreateUserId { get; set; }
    public DateTime? CreateDateTime { get; set; } = DateTime.Now;
}

public class WorkflowPermissionList
{
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public bool IsActive { get; set; }
}