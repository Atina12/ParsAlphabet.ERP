using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class CentralProperty
{
    public int Id { get; set; }

    public int? CompanyId { get; set; }

    public string ValidIssuer { get; set; }

    public bool? ValidateIssuer { get; set; }

    public string ValidAudience { get; set; }

    public bool? ValidateAudience { get; set; }

    public string IssuerSigningKey { get; set; }

    public bool? ValidateIssuerSigningKey { get; set; }

    public bool? ValidateLifetime { get; set; }

    public TimeOnly? ClockSkew { get; set; }
}
