namespace ParsAlphabet.ERP.Application.Dtos.FA.FixedAssetLocation;

public class FixedAssetLocationGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string CountryName { get; set; }
    public string StateName { get; set; }
    public string CityName { get; set; }
    public string PostalCode { get; set; }
    public bool IsActive { get; set; }
}

public class FixedAssetLocationGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
}