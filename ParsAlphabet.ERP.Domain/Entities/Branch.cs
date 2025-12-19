using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Branch
{
    public short Id { get; set; }

    public short? CentralId { get; set; }

    public byte? CompanyId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public short? StateId { get; set; }

    public int? CityId { get; set; }

    public string Address { get; set; }

    public decimal? Longitude { get; set; }

    public decimal? Latitude { get; set; }

    public bool? IsActive { get; set; }
}
