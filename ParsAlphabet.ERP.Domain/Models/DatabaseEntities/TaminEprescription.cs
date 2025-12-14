using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TaminEprescription
{
    public int Id { get; set; }

    public int? AdmissionId { get; set; }

    public byte? PrescriptionTypeId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public int? TaminServiceTypeId { get; set; }

    public long? EprescriptionId { get; set; }
}
