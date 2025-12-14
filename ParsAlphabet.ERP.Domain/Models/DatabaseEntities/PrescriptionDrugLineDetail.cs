using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PrescriptionDrugLineDetail
{
    public int HeaderId { get; set; }

    public byte RowNumber { get; set; }

    public byte DetailRowNumber { get; set; }

    public short? ProductId { get; set; }

    public short? Qty { get; set; }

    public short? QtyMax { get; set; }

    public short? UnitId { get; set; }

    public short? RoleId { get; set; }
}
