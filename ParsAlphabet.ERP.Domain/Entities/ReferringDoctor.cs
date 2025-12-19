using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ReferringDoctor
{
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName { get; set; }

    public byte? GenderId { get; set; }

    public string Msc { get; set; }

    public byte? MscTypeId { get; set; }

    public int? SpecialityId { get; set; }

    public string Address { get; set; }

    public string PhoneNo { get; set; }

    public string MobileNo { get; set; }

    public int? CompanyId { get; set; }

    public byte? RoleId { get; set; }

    public int? LocCityId { get; set; }

    public short? LocStateId { get; set; }

    public bool? IsActive { get; set; }
}
