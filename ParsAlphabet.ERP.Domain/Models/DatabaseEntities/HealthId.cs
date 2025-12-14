using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class HealthId
{
    public int Id { get; set; }

    public string Hid { get; set; }

    public byte? InsurerId { get; set; }

    public int? CompanyId { get; set; }

    public DateOnly? ValidDate { get; set; }
}
