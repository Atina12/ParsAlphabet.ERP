namespace ParsAlphabet.ERP.Application.Dtos.WF.Workflow;

public class WorkflowModel : CompanyViewModel
{
    public int Id { get; set; }
    public byte WorkflowCategoryId { get; set; }
    public short BranchId { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
    public byte StageClassId { get; set; }
}