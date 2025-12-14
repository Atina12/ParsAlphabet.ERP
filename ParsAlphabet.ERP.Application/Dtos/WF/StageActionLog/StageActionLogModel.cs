namespace ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;

public class StageActionLogModel : CompanyViewModel
{
    public long Id { get; set; }
    public long TransactionId { get; set; }
    public byte WorkflowCategoryId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public int UserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
}