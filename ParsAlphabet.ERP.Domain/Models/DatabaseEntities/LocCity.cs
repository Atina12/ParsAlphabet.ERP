using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class LocCity
{
    public int Id { get; set; }

    public string Name { get; set; }

    public short? StateId { get; set; }

    public string PhonePreCode { get; set; }

    public short? CountryId { get; set; }

    public byte? TerritoryId { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public short? IndexBy { get; set; }

    public bool? IsCapital { get; set; }
}
