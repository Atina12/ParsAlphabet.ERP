namespace ParsAlphabet.ERP.Application.Dtos.GN.SendHistory;

public class SendHistoryBulkInsert
{
    //public SendObjectType SendObjectTypeId { get; set; }
    public List<SendHistoryViewModel> ObjectHistoryList { get; set; }
    public int SendUserId { get; set; }
    public DateTime SendDateTime { get; set; }
    public Central.ObjectModel.Public.Enums.SendObjectType SendObjectTypeId { get; set; }
}

public class SendHistoryViewModel
{
    public Guid? Id { get; set; }
    public string CentralId { get; set; }
    public string ObjectId { get; set; }
}

public class SendHistoryUpdateResult : MyResultStatus
{
    public new Guid Id { get; set; }
}