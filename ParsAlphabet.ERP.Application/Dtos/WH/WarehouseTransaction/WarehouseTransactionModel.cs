using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;

public class WarehouseTransactionModel : CompanyViewModel
{
    public long? RequestId { get; set; }
    public long? Id { get; set; }

    [Display(Name = "شناسه مرحله")] public short StageId { get; set; }

    [Display(Name = "شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short BranchId { get; set; }

    [Display(Name = "شناسه انبار")]
    //[Required(ErrorMessage = "{0} را وارد کنید")]
    public int? WarehouseId { get; set; }

    public long? TreasurySubjectId { get; set; }
    public long JournalId { get; set; }
    public int No { get; set; }
    public DateTime TransactionDate { get; set; }

    [Display(Name = "تاریخ برگه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public string TransactionDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            TransactionDate = (DateTime)(str == null ? (DateTime?)null : str.Value);
        }
    }

    public byte? ActionId { get; set; }
    public byte DocumentTypeId { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public short? NoSeriesId { get; set; }
    public int? AccountDetailId { get; set; }
    public byte Inout { get; set; }
    public DateTime? CreateDatetime => DateTime.Now;
    public long? CreateUserId { get; set; }
    public int WorkflowId { get; set; } = 0;
    public string Note { get; set; }
    public bool CreateBySystem { get; set; }
    public decimal? SumQuantity { get; set; }
    public decimal? SumAmount { get; set; }

    public int ParentWorkflowCategoryId { get; set; }
}

public class ItemTransactionResult : MyResultQuery
{
    public int Output { get; set; }
}

public class ItemTransactionGetRecord
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public DateTime? TransactionDate { get; set; }
    public string TransactionDatePersian { get; set; }
    public short StageId { get; set; }
    public byte? CurrencyId { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
    public int CreateUserId { get; set; }
    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public long WarehouseId { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public int AccountDetailId { get; set; }
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string AccountDetailName { get; set; }
    public byte Status { get; set; }
    public string Note { get; set; }
    public int SumAmount { get; set; }
    public int SumQuantity { get; set; }
    public byte Priority { get; set; }
    public int IsDataEntry { get; set; }
    public bool IsRequest { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public int? RequestId { get; set; }
    public int? TreasurySubjectId { get; set; }
    public string ParentTransactionDatePersian { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }

    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public int ParentWorkflowCategoryId { get; set; }
}

public class ItemTransactionViewModel : CompanyViewModel
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
    public byte ActionId { get; set; }
    public DateTime DocumentDate { get; set; }
    public int WorkflowId { get; set; }
    public byte Inout { get; set; }
    public byte ParentWorkflowCategoryId { get; set; }
    public string StageClass { get; set; }
    public byte StageClassId { get; set; }
}

public class ItemTransactionRequestModel
{
    public int RequestId { get; set; }
    public int ParentWorkflowCategoryId { get; set; }
}

public class WarehouseTransactionCheckNegativeInventory
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public int? WarehouseId { get; set; }
    public int ItemId { get; set; }
    public short ZoneId { get; set; }
    public int BinId { get; set; }
    public short? SubUnitId { get; set; }
    public short? UnitId { get; set; }
    public byte InOut { get; set; }
    public decimal Ratio { get; set; }
    public int HeaderInOut { get; set; }
    public decimal TotalQuantity { get; set; }
    public string AttributeIds { get; set; }
    public DateTime HeaderDocumentDate { get; set; } = DateTime.Now;
}

public class HeaderWarehouseTransactionPostingGroup : CompanyViewModel
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public byte WorkflowCategoryId { get; set; }
    public short StageId { get; set; }
    public int TreasurySubjectId { get; set; }
    public byte DocumentTypeId { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int AccountDetailId { get; set; }
    public string DocumentTypeName { get; set; }
    public DateTime DocumentDate { get; set; }
    public string DocumentDatePersian => DocumentDate.ToPersianDateString("{0}/{1}/{2}");
    public short IsFiscal { get; set; }
    public bool IsPosted { get; set; }
    public short CurrentActionId { get; set; }
    public byte ActionId { get; set; }
    public byte Priority { get; set; }
}

public class CheckLockModel
{
    public int FiscalYearLineId { get; set; }
    public short BranchId { get; set; }
}

public class HeaderWarehousePostingGroupModel : CompanyViewModel
{
    public DateTime? FromDate => FromDatePersian.ToMiladiDateTime();
    public string FromDatePersian { get; set; }

    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();
    public string ToDatePersian { get; set; }
}

public class WarehouseTransactionValidateStepResultStatus
{
    public bool Successfull { get; set; }
    public List<string> ValidationErrors { get; set; }
}