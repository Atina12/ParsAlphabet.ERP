using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class MedicalLaboratoryTemplate
{
    public short Id { get; set; }

    public string Name { get; set; }

    public int? ServiceId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public bool IsActive { get; set; }
}
