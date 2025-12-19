using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class FixedAssetLocation
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public short? CountryId { get; set; }

    public int? CityId { get; set; }

    public string PostalCode { get; set; }

    public string Address { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }
}
