namespace ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;

public class StepLogList
{
    public int TransactionId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int UserId { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string UserFullName { get; set; }
    public string Action => IdAndTitle(ActionId, ActionName);
    public string User => IdAndTitle(UserId, UserFullName);
}

public class UpdateAction : CompanyViewModel
{
    public byte RequestActionId { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public int IdentityId { get; set; }
    public int UserId { get; set; }
    public DateTime StepDateTime => DateTime.Now;
    public int WorkflowCategoryId { get; set; }

    public byte ParentWorkflowCategoryId { get; set; }
    public DateTime? DocumentDate { get; set; }

    public string DocumentDatePersian
    {
        set
        {
            var dateTime = value.ToMiladiDateTime();

            DocumentDate = dateTime;
        }
    }
}