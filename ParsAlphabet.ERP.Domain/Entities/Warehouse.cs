using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Warehouse
{
    public int Id { get; set; }

    public string Name { get; set; }

    public short? BranchId { get; set; }

    public short? LocCountryId { get; set; }

    public short? LocStateId { get; set; }

    public short? LocCityId { get; set; }

    public string PostalCode { get; set; }

    public string Address { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }
}
