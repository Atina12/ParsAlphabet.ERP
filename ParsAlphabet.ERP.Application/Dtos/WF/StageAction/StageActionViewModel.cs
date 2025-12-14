namespace ParsAlphabet.ERP.Application.Dtos.WF.StageAction;

public class GetStageAction : CompanyViewModel
{
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public byte Priority { get; set; }
}

public class StageActionGetRecord
{
    public long Id { get; set; }
    public long StageId { get; set; }
    public string StageName { get; set; }
    public byte ActionId { get; set; }
    public long TreasuryStageActionId { get; set; }
    public long? WorkflowId { get; set; }

    public bool IsRequest { get; set; }
    public bool IsTreasurySubject { get; set; }
    public bool IsDeleteHeader { get; set; }
    public bool IsDeleteLine { get; set; }
    public bool IsMaxStePreviewed { get; set; }
    public bool isLastConfirmHeader { get; set; }
    public bool IsPostedGroup { get; set; }
    public string IsDataEntry { get; set; }
    public bool IsFiscalYear { get; set; }
    public byte Priority { get; set; }
    public bool IsBank { get; set; }
    public long Fk_stageid { get; set; }
    public long Fk_actionid { get; set; }
    public string PreviousStageActionId { get; set; }
    public bool CostofItemOrdered { get; set; }
    public bool CostofItemInvoiced { get; set; }
    public bool UnitCostCalculationWarehouse { get; set; }
}

public class StageActionGetPage
{
    public long Id { get; set; }
    public long StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public long? WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public bool IsRequest { get; set; }
    public bool IsTreasurySubject { get; set; }
    public bool IsDeleteHeader { get; set; }
    public bool IsDeleteLine { get; set; }
    public bool IsMaxStePreviewed { get; set; }
    public bool isLastConfirmHeader { get; set; }
    public bool IsPostedGroup { get; set; }
    public bool IsActive { get; set; }
    public bool IsDataEntry { get; set; }

    public bool IsFiscalYear => true;
    public int Priority { get; set; }
    public bool IsBank { get; set; }

    public bool Isoutboundmonthclosed { get; set; }

    public bool CostofItemOrdered { get; set; }
    public bool CostofItemInvoiced { get; set; }
    public bool UnitCostCalculationWarehouse { get; set; }
}

public class GetAction : CompanyViewModel
{
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public byte Priority { get; set; }
    public bool IsActive { get; set; } = true;
    public int WorkflowId { get; set; } = 0;
}

public class GetParentRequestLogicByWorkflowCategory
{
    public int RequestId { get; set; }
    public byte WorkflowCategoryId { get; set; }
}

public class ParentRequestStageActionLogicModel
{
    public bool IsLastConfirmHeader { get; set; }
    public bool IsQuantityPurchase { get; set; }
    public bool IsQuantityWarehouse { get; set; }
    public int WorkflowId { get; set; }
    public string PreviousStageActionId { get; set; }
    public bool IsRequest { get; set; }
}

public class GetActionViewModel : CompanyViewModel
{
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
}

public class GetNextStageActionViewModel
{
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
}

public class ActionDropDownViewModel : MyDropDownViewModel
{
    public byte Priority { get; set; }
}

public class GetActionListByStageDto
{
    public string StageId { get; set; }
    public string WorkFlowId { get; set; }
    public byte? IsActive { get; set; } = 1;
    public byte? BySystem { get; set; } = 2;
    public string? BranchId { get; set; }
    public string? WorkFlowCategoryId { get; set; } = null;
    public bool IncludePriority { get; set; } = true;
    public string? StageClassId { get; set; } = null;
}