using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrFdi
{
    public short Id { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    /// <summary>
    /// 1:شیری,
    /// 2:دائم
    /// </summary>
    public byte? TeethGroupId { get; set; }

    public bool? IsActive { get; set; }
}
