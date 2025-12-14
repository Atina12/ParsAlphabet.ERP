namespace ParsAlphabet.ERP.Application.Dtos.FM.DocumentType;

public class DocumentTypeGetPage
{
    public short Id { get; set; }
    public string Name { get; set; }
    public string WorkflowCategoryName { get; set; }
    public bool BySystem { get; set; }
    public bool IsActive { get; set; }
}

public class DocumentTypeGetRecord
{
    public byte Lang { get; set; }
    public byte Id { get; set; }
    public string Name { get; set; }
    public string WorkflowCategoryId { get; set; }
    public bool BySystem { get; set; }
    public bool IsActive { get; set; }
}