namespace ParsAlphabet.ERP.Application.Dtos.MC.Insurer;

public class InsurerGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public int InsurerTypeId { get; set; }
    public string InsurerTypeName { get; set; }
    public string InsurerType => IdAndTitle(InsurerTypeId, InsurerTypeName);
    public bool IsActive { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
}

public class InsurerDropDownViewModel
{
    public string Id { get; set; }
    public string Name { get; set; }
    public int CountBox { get; set; }
}