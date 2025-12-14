namespace ParsAlphabet.ERP.Application.Dtos.WF.Stage;

public class StageModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string NameEng { get; set; }
    public byte InOut { get; set; }
    public byte StageClassId { get; set; }
    public bool IsActive { get; set; }
}