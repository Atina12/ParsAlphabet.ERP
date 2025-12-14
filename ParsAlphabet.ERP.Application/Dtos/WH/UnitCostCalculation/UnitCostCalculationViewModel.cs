namespace ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculation;

public class UnitCostCalculationGetPage
{
    public byte Id { get; set; }
    public int FiscalYearId { get; set; }
    public string FiscalYearName { get; set; }
    public string FiscalYear => IdAndTitle(FiscalYearId, FiscalYearName);

    public byte Closed { get; set; }
    public byte CostingMethodId { get; set; }
    public string CostingMethodName { get; set; }
    public string CostingMethod => IdAndTitle(CostingMethodId, CostingMethodName);


    public byte CreateUserId { get; set; }
    public string FullName { get; set; }
    public string UserFullName => IdAndTitle(CreateUserId, FullName);

    public DateTime CreateDateTime { get; set; }

    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
}

public class UnitCostCalculationGetRecord
{
    public DateTime CreateDateTime = DateTime.Now;
    public byte Id { get; set; }
    public int FiscalYearId { get; set; }
    public byte CostingMethodId { get; set; }
    public int CreateUserId { get; set; }
}

public class UnitCostCalculationViewModel
{
    public DateTime CreateDateTime = DateTime.Now;
    public byte? Id { get; set; }
    public int FiscalYearId { get; set; }
    public byte CostingMethodId { get; set; }
    public int CreateUserId { get; set; }
}

public class HeaderUnitCostCalculationPostingGroupModel : CompanyViewModel
{
    public int Id { get; set; }
    public short StageId { get; set; }

    public int WorkflowId { get; set; }
    public string FromDatePersian { get; set; }
    public DateTime? FromDate => FromDatePersian.ToMiladiDateTime();

    public string ToDatePersian { get; set; }
    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();

    public int CurrentActionId { get; set; }
}