using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Insurer
{
    public int Id { get; set; }

    public byte InsurerTypeId { get; set; }

    public byte? NoSeriesId { get; set; }

    public int? CompanyId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public byte? InsurerTerminologyId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public bool? IsActive { get; set; }
}
