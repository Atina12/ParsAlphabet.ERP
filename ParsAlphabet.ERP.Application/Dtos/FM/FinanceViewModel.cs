using ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;

namespace ParsAlphabet.ERP.Application.Dtos.FM;

public class GetFundTypeAdm
{
    public byte SaleTypeId { get; set; }
    public byte InOut { get; set; }
}

public class FinanceOperationResult
{
    public bool Successfull { get; set; }
    public List<JournalPostGroupResultStatus> Results { get; set; }
}

public class FinancialStepList
{
    public string StepName { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; }
    public string UserFullName => UserId != 0 ? $"{UserId} - {FullName}" : "";
    public DateTime? StepDateTime { get; set; }
    public string StepDateTimePersian => StepDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
}

public class UpdateFinanacialStep : CompanyViewModel
{
    public long IdentityId { get; set; }
    public int UserId { get; set; }
    public byte RequestStepId { get; set; }
    public DateTime StepDateTime => DateTime.Now;
}