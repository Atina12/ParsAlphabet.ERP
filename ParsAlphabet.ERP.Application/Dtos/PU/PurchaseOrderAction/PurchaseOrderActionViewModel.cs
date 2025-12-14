namespace ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderAction;

public class PurchaseOrderActionLogList
{
    public int PersonOrderId { get; set; }
    public DateTime CreateDate { get; set; }
    public string StepDateTimePersian => CreateDate.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int ActionUserId { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string UserFullName { get; set; }
    public string Action => IdAndTitle(ActionId, ActionName);
    public string User => IdAndTitle(ActionUserId, UserFullName);
}

public class PurchaseOrderResultStatus : MyResultStatus
{
    public int Output { get; set; }
}

public class UpdateRequestPrice : MyResultStatus
{
    public int Output { get; set; }
}

public class UpdateInvoicePrice : MyResultStatus
{
    public int RowAffected { get; set; }
}

public class PurchaseOrderCheckIsAllocatedViewModel
{
    public short ItemCategoryId { get; set; }
    public string ItemCategoryName { get; set; }
    public string ItemCategory => IdAndTitle(ItemCategoryId, ItemCategoryName);
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
}

public class PurchaseOrderValidateStepResultStatus
{
    public bool Successfull { get; set; }
    public List<string> ValidationErrors { get; set; }
}

public class PurchaseOrderNotLastConfirmHeaderViewModel
{
    public int HeaderId { get; set; }
    public int Id { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string Action => IdAndTitle(ActionId, ActionName);
    public DateTime? DocumentDate { get; set; }
    public string DocumentDatePersian => DocumentDate.ToPersianDateStringNull("{0}/{1}/{2}");
}