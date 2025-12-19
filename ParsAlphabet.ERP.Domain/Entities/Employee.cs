using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Employee
{
    public int Id { get; set; }

    public int? CompanyId { get; set; }

    public short? PersonGroupId { get; set; }

    public byte? MaritalStatusId { get; set; }

    public string FatherFirstName { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName { get; set; }

    public byte? GenderId { get; set; }

    public string NationalCode { get; set; }

    public short? LocCountryId { get; set; }

    public short? LocStateId { get; set; }

    public int? LocCityId { get; set; }

    public string PostalCode { get; set; }

    public string Address { get; set; }

    public string PhoneNo { get; set; }

    public string MobileNo { get; set; }

    public string Email { get; set; }

    public DateOnly? IdDate { get; set; }

    public bool? IsActive { get; set; }

    public string InsurNo { get; set; }

    public int? InsurerId { get; set; }
}
