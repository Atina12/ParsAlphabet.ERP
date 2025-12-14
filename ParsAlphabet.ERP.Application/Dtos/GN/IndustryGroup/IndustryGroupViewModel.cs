namespace ParsAlphabet.ERP.Application.Dtos.GN.IndustryGroup;

public class IndustryGroupGetPage
{
    public byte Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}

public class IndustryGroupGetRecord
{
    public short Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}