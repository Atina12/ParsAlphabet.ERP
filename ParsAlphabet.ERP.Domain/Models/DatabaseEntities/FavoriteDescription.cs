using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class FavoriteDescription
{
    public int Id { get; set; }

    public string Description { get; set; }

    public byte? CompanyId { get; set; }

    public short StageId { get; set; }

    public bool? IsActive { get; set; }
}
