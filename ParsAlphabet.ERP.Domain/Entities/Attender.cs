using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Attender
{
    public int Id { get; set; }

    public int? CentralId { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName { get; set; }

    public byte? GenderId { get; set; }

    public string NationalCode { get; set; }

    public string Msc { get; set; }

    public DateOnly? MscExpDate { get; set; }

    public byte? MscTypeId { get; set; }

    public int? SpecialityId { get; set; }

    public byte? RoleId { get; set; }

    public int? DepartmentId { get; set; }

    public bool? BookingEnabled { get; set; }

    public bool? IsActive { get; set; }

    public byte? AttenderTaxPer { get; set; }

    public int? UserId { get; set; }

    public string FatherName { get; set; }

    public string IdNumber { get; set; }

    public string PhoneNo { get; set; }

    public string MobileNo { get; set; }

    public DateOnly? BirthDate { get; set; }

    public string Address { get; set; }

    public int? LocCityId { get; set; }

    public short? LocStateId { get; set; }

    public string PrescriptionTypeId { get; set; }

    public bool? AcceptableParaclinic { get; set; }

    public byte? ContractType { get; set; }

    public string ContractTypeName { get; set; }

    public int CompanyId { get; set; }
}
