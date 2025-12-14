using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AccountDetail
{
    public int Id { get; set; }

    public string Name { get; set; }

    public short? NoSeriesId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int CompanyId { get; set; }

    public string DataJson { get; set; }

    public bool? IsActive { get; set; }
}
