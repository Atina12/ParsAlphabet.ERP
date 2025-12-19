using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class StageStepConfigDetail
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public int? FieldTableId { get; set; }

    public string FieldTableValue { get; set; }

    public int? InputMethodId { get; set; }

    public bool? IsRequired { get; set; }

    public byte? SortOrder { get; set; }

    public bool? IsActive { get; set; }
}
