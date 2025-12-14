namespace ParsAlphabet.ERP.Application.Dtos.WF.Workflow;

public class GetRequestDataByWorkflowCategory
{
    public int TreasurySubjectId { get; set; }
    public string TreasurySubjectName { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string RequestName { get; set; }
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public DateTime DocumentDate { get; set; }
    public string DocumentDatePersian => DocumentDate.ToPersianDateString("{0}/{1}/{2}");
    public string Note { get; set; }
    public byte AccountDetailRequired { get; set; }
    public byte WorkflowCategoryId { get; set; }
    public byte StageClassId { get; set; }
    public short NoSeriesId { get; set; }
}