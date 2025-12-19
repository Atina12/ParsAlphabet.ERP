using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class DeathCertificate
{
    public int Id { get; set; }

    public int? AdmissionId { get; set; }

    public int? BurialAttesterId { get; set; }

    public int? IndividualRegisterId { get; set; }

    public DateOnly? IssueDate { get; set; }

    public string SerialNumber { get; set; }

    public string Comment { get; set; }

    public DateTime DeathDateTime { get; set; }

    public int? DeathLocationId { get; set; }

    public string HouseholdHeadNationalCode { get; set; }

    public int? SourceOfNotificationId { get; set; }

    public string CompositionUid { get; set; }

    public string MessageUid { get; set; }

    public string PersonUid { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public byte? CompanyId { get; set; }

    public bool? IsCompSent { get; set; }

    public byte? SentResult { get; set; }

    public DateTime? SentDateTime { get; set; }

    public string RelatedHid { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public byte? GenderId { get; set; }

    public string NationalId { get; set; }

    public DateOnly? BirthDate { get; set; }

    public string FullName { get; set; }

    public int? CountryId { get; set; }

    public int? CountryDivisionEstateId { get; set; }

    public int? CountryDivisionCityId { get; set; }
}
