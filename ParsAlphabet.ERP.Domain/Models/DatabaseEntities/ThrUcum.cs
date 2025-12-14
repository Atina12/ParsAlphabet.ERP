using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class ThrUcum
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public bool? IsTimeTaken { get; set; }

    public bool? IsLongTerm { get; set; }

    public bool? IsPmhOnsetDurationToPresent { get; set; }

    public bool? IsClinicalOnsetDurationToPresent { get; set; }

    public bool? IsDosage { get; set; }

    public bool? IsAbuseDuration { get; set; }

    public bool? IsAbuseAmount { get; set; }

    public bool? IsInfantWeight { get; set; }

    public bool? IsTotalNumber { get; set; }

    public bool? IsActive { get; set; }
}
