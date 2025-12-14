namespace ParsAlphabet.ERP.Application.Dtos.GN.LocCity;

public class LocCityGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }

    public string StateName { get; set; }
    //public string Phone_PreCode { get; set; }
    //public short CountryName { get; set; }
    //public byte TerritoryId { get; set; }
    //public decimal Latitude { get; set; }
    //public decimal Longitude { get; set; }
    //public short IndexBy { get; set; }
}

public class LocCityGetRecord
{
    public int TotalRecord { get; set; }
    public int Id { get; set; }
    public string Name { get; set; }
    public short StateId { get; set; }

    public string StateName { get; set; }
    //public string Phone_PreCode { get; set; }
    //public short CountryId { get; set; }
    //public byte TerritoryId { get; set; }
    //public decimal? Latitude { get; set; }
    //public decimal? Longitude { get; set; }
    //public short IndexBy { get; set; }
}