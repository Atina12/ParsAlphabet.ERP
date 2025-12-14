namespace ParsAlphabet.ERP.Application.Dtos.GN.SendHistory;

public class SendHistoryModel
{
    public Guid Id { get; set; }
    public string ObjectId { get; set; }
    public byte ObjectTypeId { get; set; }
    public int CentralId { get; set; }
    public byte OperationTypeId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
    public int SendHistoryId { get; set; }
    public DateTime SendDateTime => DateTime.Now;
}