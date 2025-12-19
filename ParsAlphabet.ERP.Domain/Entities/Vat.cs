using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Vat
{
    public short Id { get; set; }

    public string Name { get; set; }

    public byte? Vatper { get; set; }

    public byte? CompanyId { get; set; }

    public bool? IsActive { get; set; }

    public short? NoSeriesId { get; set; }

    public int? AccountDetailId { get; set; }

    public byte? VattypeId { get; set; }
}
