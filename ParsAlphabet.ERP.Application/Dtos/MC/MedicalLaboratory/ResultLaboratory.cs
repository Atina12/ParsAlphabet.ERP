namespace ParsAlphabet.ERP.Application.Dtos.MC.MedicalLaboratory;

public abstract class ResultLaboratory
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int LabTestResultId { get; set; }
}