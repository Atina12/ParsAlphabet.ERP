using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class CostOfGoodsTemplate
{
    public int Id { get; set; }

    public string Name { get; set; }

    public short? StageId { get; set; }

    public byte? CostDriverId { get; set; }

    public bool? IsActive { get; set; }

    public string Description { get; set; }

    public int? CompanyId { get; set; }
}
