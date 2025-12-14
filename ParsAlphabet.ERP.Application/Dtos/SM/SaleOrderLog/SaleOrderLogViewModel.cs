namespace ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLog;

public class SaleOrderStepLogList
{
    public int PersonOrderId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string StepDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int ActionUserId { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string UserFullName { get; set; }
    public string Action => $"{ActionId} - {ActionName}";
    public string User => $"{ActionUserId} - {UserFullName}";
}

public class SaleOrderResultStatus : MyResultStatus
{
    public int Output { get; set; }
}