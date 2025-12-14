using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class StageStepConfigLine
{
    public int Id { get; set; }

    public int? HeaderId { get; set; }

    public int? FieldTableId { get; set; }

    public string FieldTableValue { get; set; }
}
