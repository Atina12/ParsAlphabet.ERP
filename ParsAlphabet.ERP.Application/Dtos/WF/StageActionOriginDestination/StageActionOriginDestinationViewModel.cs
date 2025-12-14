namespace ParsAlphabet.ERP.Application.Dtos.WF.StageActionOriginDestination;

public class WorkflowStageViewModel
{
    public int Id { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public string HeaderTableName { get; set; }
    public string LineTableName { get; set; }
    public byte AdmissionTypeId { get; set; }
}