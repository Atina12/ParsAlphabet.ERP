using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PatientInfo
{
    public int Id { get; set; }

    public string PassportNo { get; set; }

    public short? LangId { get; set; }

    public string HomePhoneNo { get; set; }

    public int? HomeCityId { get; set; }

    public string HomeAddress { get; set; }

    public int? BirthPlaceCityId { get; set; }

    public byte? MaritalStatusId { get; set; }

    public string PostalCode { get; set; }

    public byte? ReligionId { get; set; }
}
