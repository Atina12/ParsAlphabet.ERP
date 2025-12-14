namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionStageActionLog;

public class AdmissionStageActionLogModel
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public short StageId { get; set; }
    public DateTime InsertDate { get; set; }
    public int UserId { get; set; }
    public byte ActionId { get; set; }
}