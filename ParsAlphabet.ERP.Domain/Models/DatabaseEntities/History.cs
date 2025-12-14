using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class History
{
    public long Id { get; set; }

    public string ControllerName { get; set; }

    public string ActionName { get; set; }

    public int? UserId { get; set; }

    public int? CompanyId { get; set; }

    public string Description { get; set; }

    public string Browser { get; set; }

    public string OperatingSystem { get; set; }

    public string IpAddress { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
