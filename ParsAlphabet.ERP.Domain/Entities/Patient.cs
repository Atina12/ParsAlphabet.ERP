using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Patient
{
    public int Id { get; set; }

    public int? CentralId { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string FullName { get; set; }

    public byte? GenderId { get; set; }

    public string NationalCode { get; set; }

    public string MobileNo { get; set; }

    public string PhoneNo { get; set; }

    public short? CountryId { get; set; }

    public DateOnly? BirthDate { get; set; }

    public string Address { get; set; }

    public int? CompanyId { get; set; }

    public string FatherFirstName { get; set; }

    public string IdCardNumber { get; set; }

    public string PostalCode { get; set; }

    public string JobTitle { get; set; }

    public byte? MaritalStatusId { get; set; }

    public byte? EducationLevelId { get; set; }

    public bool? IsActive { get; set; }

    public string SearchKey { get; set; }

    public string Email { get; set; }

    public string Description { get; set; }

    public short? BankId { get; set; }

    public string BankAccountNo { get; set; }

    public string BankShebaNo { get; set; }

    public string BankCardNo { get; set; }
}
