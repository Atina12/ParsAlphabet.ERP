using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class CostOfGoodsTemplateLine
{
    public int Id { get; set; }

    public int? HeaderId { get; set; }

    public short? ItemCategoryId { get; set; }

    public short? CostRelationId { get; set; }
}
