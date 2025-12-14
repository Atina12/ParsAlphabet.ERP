namespace ParsAlphabet.ERP.Application.Dtos.FA.FixedAssetSubClass;

public class FixedAssetSubClassGetPage
{
    public int Id { get; set; }
    public int FixedAssetClassId { get; set; }
    public string FixedAssetClassName { get; set; }
    public string Name { get; set; }
}

public class FixedAssetSubClassGetRecord
{
    public int Id { get; set; }
    public int FixedAssetClassId { get; set; }
    public string Name { get; set; }
}