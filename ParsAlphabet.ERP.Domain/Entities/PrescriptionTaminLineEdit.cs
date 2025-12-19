using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PrescriptionTaminLineEdit
{
    public int Id { get; set; }

    public int? PrescriptionTaminLineId { get; set; }

    public string JsonStr { get; set; }
}
