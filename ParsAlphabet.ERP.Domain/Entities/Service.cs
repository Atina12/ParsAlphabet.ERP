using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Service
{
    public int Id { get; set; }

    public int? CentralId { get; set; }

    public string Name { get; set; }

    public string OnlineName { get; set; }

    public int? ServiceTypeId { get; set; }

    /// <summary>
    /// THRRVU
    /// </summary>
    public int? TerminologyId { get; set; }

    public short? CdtTerminologyId { get; set; }

    public int? TaminTerminologyId { get; set; }

    public bool? IsActive { get; set; }

    public string PrintDescription { get; set; }

    public int? CompanyId { get; set; }

    public string ShortName { get; set; }
}
