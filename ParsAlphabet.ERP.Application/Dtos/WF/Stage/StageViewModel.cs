namespace ParsAlphabet.ERP.Application.Dtos.WF.Stage;

public class StageGetPage : CompanyViewModel
{
    public long Id { get; set; }

    public string StageName { get; set; }
    public int StageInOut { get; set; }
    public byte StageClassId { get; set; }
    public string StageClassName { get; set; }
    public string StageClass => StageClassId == 0 ? "" : $"{StageClassId} - {StageClassName}";
    public byte IsActive { get; set; }
    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public string DocumentType => DocumentTypeId == 0 ? "" : $"{DocumentTypeId} - {DocumentTypeName}";
    public string StageInOutName => StageInOut == 1 ? "دریافت" : StageInOut == 2 ? "پرداخت" : "هردو";
    public string InoutName => StageInOut != 0 ? $"{StageInOut} - {StageInOutName}" : "";
    public string Active => IsActive != 0 ? "فعال" : "غیر فعال";
}

public class StageDocumentType : MyDropDownViewModel
{
    public byte StageClassId { get; set; }
}