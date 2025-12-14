namespace ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculationLine;

public class UnitCostCalculationLineList
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
}

public class UnitCostCalculationLineViewModel
{
    public byte Id { get; set; }
    public short BranchId { get; set; }
}

public class UnitCostCalculationDirectPagingViewModel
{
    public int Id { get; set; }
    public int directPaging { get; set; }
}

public class UnitCostCalculationLinegetpage
{
    public int Id { get; set; }
    public int MonthId { get; set; }
    public string MonthName { get; set; }
    public string Month => IdAndTitle(MonthId, MonthName);
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string Action => IdAndTitle(ActionId, ActionName);
    public DateTime StartDate { get; set; }
    public string StartDatePersian => StartDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime EndDate { get; set; }
    public string EndDatePersian => EndDate.ToPersianDateString("{0}/{1}/{2}");
    public byte Locked { get; set; }

    public int CreateUserId { get; set; }
    public string FullName { get; set; }
    public string UserFullName => IdAndTitle(CreateUserId, FullName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
}

public class UpdateUnitCalculationStep : CompanyViewModel
{
    public byte RequestActionId { get; set; }
    public byte CurrentActionId { get; set; }
    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public int IdentityId { get; set; }
    public int UserId { get; set; }
    public int WorkflowCategoryId { get; set; }

    public DateTime? FromDate { get; set; }

    public string FromDatePersian
    {
        get => FromDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            FromDate = str == null ? null : str.Value;
        }
    }

    public DateTime? ToDate { get; set; }

    public string ToDatePersian
    {
        get => ToDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            ToDate = str == null ? null : str.Value;
        }
    }

    public short BranchId { get; set; }
    public byte CostingMethodId { get; set; }
    public short UnitCostCalculationLineId { get; set; }
}

public class UnitCostCalculationLineDetailResultStatus : MyResultStatus
{
    public int Output { get; set; }
}

public class UnitCostCalculationValidateResultStatus : MyResultStatus
{
    public byte CurrentPriority { get; set; }
    public byte RequestPriority { get; set; }
    public bool CostofItemOrdered { get; set; }
    public bool CostofItemInvoiced { get; set; }
    public bool IsLastConfirmHeader { get; set; }
    public bool UnitCostCalculationWarehouse { get; set; }
}

public class UnitCostCalculationUpdatePurchasedPrice : CompanyViewModel
{
    public string FromDatePersian { get; set; }
    public DateTime? FromDate => FromDatePersian.ToMiladiDateTime();

    public string ToDatePersian { get; set; }
    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();

    public short BranchId { get; set; }
    public int UserId { get; set; }
    public byte CostingMethodId { get; set; }
    public bool IsReturn { get; set; }
}

public class UnitCostCalculationNotLastConfirmHeaderViewModel
{
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

    public int WorkflowCategoryId { get; set; }
}

public class LastconfirmheadeViewModel
{
    public string FromDatePersian { get; set; }
    public DateTime? FromDate => FromDatePersian.ToMiladiDateTime();
    public string ToDatePersian { get; set; }
    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();
    public bool IsCostOfItemInvoice { get; set; }
    public bool Type { get; set; }
}

public class UnitCostCalculationLineDetailInfo
{
    public byte Id { get; set; }
    public byte MonthId { get; set; }

    public string Month => GetMonth(MonthId);

    public byte ActionId { get; set; }
}

public class UnitCostCalculationLineDetailViewModel
{
    public byte Id { get; set; }
    public byte MonthId { get; set; }
    public short RequestActionId { get; set; }
}