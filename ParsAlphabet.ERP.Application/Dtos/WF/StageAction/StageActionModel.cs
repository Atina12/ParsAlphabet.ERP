namespace ParsAlphabet.ERP.Application.Dtos.WF.StageAction;

public class StageActionModel : CompanyViewModel
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public byte StepId { get; set; }
    public bool IsDelete { get; set; }
    public bool IsPostedGroup { get; set; }
    public bool IsDataEntry { get; set; }
}

public class ActionModel
{
    public int Id { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public byte WorkflowCategoryId { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public byte IsDataEntry { get; set; }
    public bool IsRequest { get; set; }
    public bool IsTreasurySubject { get; set; }
    public bool IsDeleteHeader { get; set; }
    public bool IsDeleteLine { get; set; }
    public bool IsMaxStepReviewed { get; set; }
    public bool IsLastConfirmHeader { get; set; }
    public bool IsBank { get; set; }
    public bool IsPostedGroup { get; set; }
    public bool IsFiscalYear { get; set; }
    public bool IsQuantityPurchase { get; set; }
    public bool IsQuantitySales { get; set; }
    public bool IsQuantityWarehouse { get; set; }
    public bool IsInvoiceMultipleSettlement { get; set; }
    public bool IsWarehouseMultipleSettlement { get; set; }
    public bool IsTreasuryMultipleSettlement { get; set; }
    public bool UnitCostCalculationWarehouse { get; set; }
    public bool CostofItemOrdered { get; set; }
    public bool CostofItemInvoiced { get; set; }
    public bool CostofItemReceived { get; set; }
    public bool ApiProvider { get; set; }
    public byte MedicalRevenue { get; set; }
    public bool AdmissionMasterSettlement { get; set; }
    public bool BankKiosk { get; set; }
    public byte Priority { get; set; }
    public int CompanyId { get; set; }
    public string PreviousStageActionId { get; set; }
    public bool IsActive { get; set; }
    public bool BySystem { get; set; }
}