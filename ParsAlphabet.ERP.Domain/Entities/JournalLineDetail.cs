using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class JournalLineDetail
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public byte? CostObjectId { get; set; }

    public byte? CostCategoryId { get; set; }

    public byte? CostDriverId { get; set; }
}
