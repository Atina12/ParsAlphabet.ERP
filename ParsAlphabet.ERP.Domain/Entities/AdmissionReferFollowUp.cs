using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionReferFollowUp
{
    public int HeaderId { get; set; }

    public DateTime? NextEncounterDateTime { get; set; }

    public short? NextEncounter { get; set; }

    public short? NextEncounterUnitId { get; set; }

    public byte? NextEncounterType { get; set; }

    public string Description { get; set; }
}
