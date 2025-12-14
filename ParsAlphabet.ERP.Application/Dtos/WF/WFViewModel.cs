namespace ParsAlphabet.ERP.Application.Dtos.WF;

public class TreasurySubjectStage
{
    public bool HasTreasurySubject { get; set; }
    public bool HasRequest { get; set; }
}

public class ActionLogicModel
{
    public byte IsDataEntry { get; set; }
    public bool IsRequest { get; set; }
    public bool IsTreasurySubject { get; set; }
    public bool IsDeleteHeader { get; set; }
    public bool IsDeleteLine { get; set; }
    public bool IsMaxStepReviewed { get; set; }
    public bool IsBalanceStepReviewed { get; set; }
    public bool IsOutBoundMonthClosed { get; set; }
    public bool IsLastConfirmHeader { get; set; }
    public bool IsPostedGroup { get; set; }
    public bool IsBank { get; set; }
    public bool IsFiscalYear { get; set; }
    public int CompanyId { get; set; }
    public byte Priority { get; set; }
    public bool IsPreviousStage { get; set; }
}

public class PostGroupFooterModel
{
    public int Id { get; set; }
    public short WorkflowCategoryId { get; set; }
}

public class PostGroupLineFooter
{
    public int Id { get; set; }
    public string Name { get; set; }
    public IsDecimal IsDecimal { get; set; }
    public string IsDecimalName => IsDecimal.IsDecimalDisplayName();
    public int HeaderId { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int AccountDetailId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountDetailName { get; set; }
}

public class GetHeaderBalanceRemainingViewModel
{
    public string ObjectIds { get; set; }
    public byte WorkflowCategoryIdCurrentStage { get; set; }
    public byte WorkflowCategoryIdParentStage { get; set; }

    /// <summary>
    ///     true = Amount
    ///     false = Quantity
    /// </summary>
    public bool AmountOrQuantity { get; set; }
}

public class HeaderBalanceRemaining : MyResultStatus
{
    public decimal Amount { get; set; }
}