using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Segment
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public string Note { get; set; }

    public int? UserId { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }
}
