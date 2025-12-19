using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class NoSeriesAssignNextStage
{
    public int Id { get; set; }

    public int? NoSeriesId { get; set; }

    public bool? Purchase { get; set; }

    public bool? Sale { get; set; }

    public bool? Warehouse { get; set; }

    public bool? FixedAsset { get; set; }

    public bool? Treasury { get; set; }
}
