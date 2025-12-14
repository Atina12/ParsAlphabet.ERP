using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class CostCenter
{
    public short Id { get; set; }

    public int? CompanyId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public byte? CostDriverId { get; set; }

    public byte? CostCategoryId { get; set; }

    public bool? IsActive { get; set; }
}
