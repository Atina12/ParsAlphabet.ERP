using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class NoSeries
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public string TableName { get; set; }

    public bool? IsManual { get; set; }

    public bool? AssignPurchase { get; set; }

    public int CompanyId { get; set; }
}
