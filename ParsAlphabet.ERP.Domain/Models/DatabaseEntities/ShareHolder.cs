using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ShareHolder
{
    public int Id { get; set; }

    public short? PersonGroupId { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName { get; set; }

    public string AgentFullName { get; set; }

    public byte? PartnerTypeId { get; set; }

    public byte? GenderId { get; set; }

    public string NationalCode { get; set; }

    public short? LocCountryId { get; set; }

    public short? LocstateId { get; set; }

    public int? LocCityId { get; set; }

    public string PostalCode { get; set; }

    public string Address { get; set; }

    public string PhoneNo { get; set; }

    public string MobileNo { get; set; }

    public string Email { get; set; }

    public string WebSite { get; set; }

    public string IdNumber { get; set; }

    public DateOnly? IdDate { get; set; }

    public bool? Vatinclude { get; set; }

    public bool? Vatenable { get; set; }

    public byte? VatareaId { get; set; }

    public string TaxCode { get; set; }

    public bool? IsActive { get; set; }

    public string JobTitle { get; set; }

    public string BrandName { get; set; }

    public byte? IndustryId { get; set; }

    public byte? PersonTitleId { get; set; }

    public int? CompanyId { get; set; }
}
