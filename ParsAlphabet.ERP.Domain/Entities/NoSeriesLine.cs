using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class NoSeriesLine
{
    public short Id { get; set; }

    public short HeaderId { get; set; }

    public byte LineNo { get; set; }

    public int CompanyId { get; set; }

    public int? StartNo { get; set; }

    public int? EndNo { get; set; }
}
