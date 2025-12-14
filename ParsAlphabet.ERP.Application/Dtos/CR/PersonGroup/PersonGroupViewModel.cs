namespace ParsAlphabet.ERP.Application.Dtos.CR.PersonGroup;

public class PersonGroupGetPage
{
    public byte Id { get; set; }
    public string Name { get; set; }
    public string PersonGroupTypeName { get; set; }
    public bool IsActive { get; set; }
}

public class PersonGroupGetRecord
{
    public byte Id { get; set; }
    public string Name { get; set; }
    public byte PersonTypeId { get; set; }
    public bool IsActive { get; set; }
}