using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ThrRvu
{
    public int Id { get; set; }

    public int Code { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public string Device { get; set; }

    public string Category { get; set; }

    public string Group { get; set; }

    public string Attribute { get; set; }

    public decimal? ProfessionalCode { get; set; }

    public decimal? TechnicalCode { get; set; }

    public byte? AnesthesiaBase { get; set; }

    public bool? IsActive { get; set; }
}
