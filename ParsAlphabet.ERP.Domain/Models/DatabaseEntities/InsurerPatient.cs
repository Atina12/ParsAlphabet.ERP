using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class InsurerPatient
{
    public int Id { get; set; }

    public int? InsurerId { get; set; }

    public byte? InsurerTypeId { get; set; }

    public int? PatientId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
