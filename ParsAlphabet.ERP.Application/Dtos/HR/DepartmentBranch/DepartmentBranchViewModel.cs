namespace ParsAlphabet.ERP.Application.Dtos.HR.DepartmentBranch;

public class DepartmentBranchGetPage
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }


    public bool IsActive { get; set; }
}