using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PrescriptionTaminEdit
{
    public int Id { get; set; }

    public long HeaderId { get; set; }

    public string JsonStr { get; set; }
}
