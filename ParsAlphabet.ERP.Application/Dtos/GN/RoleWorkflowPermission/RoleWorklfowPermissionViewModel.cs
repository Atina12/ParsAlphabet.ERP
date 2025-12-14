namespace ParsAlphabet.ERP.Application.Dtos.GN.RoleWorkflowPermission;

public class RoleWorklfowPermissionGetPage
{
    public int Id { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
}

public class RoleWorkflowPermissionGetListModel
{
    public byte Type { get; set; }
    public byte RoleId { get; set; }
    public byte WorkflowCategoryId { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
}

public class GetRoleWorkflowStageActionPermission
{
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public byte RoleId { get; set; }
}