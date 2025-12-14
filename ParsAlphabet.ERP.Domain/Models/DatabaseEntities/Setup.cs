using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Setup
{
    public byte Id { get; set; }

    public string SiteBaseUrl { get; set; }

    public string SmsServicePanel { get; set; }

    public string SmsServiceNumber { get; set; }

    public string SmsServiceLogin { get; set; }

    public string SmsServicePassword { get; set; }

    public string CisWcfUrl { get; set; }

    public string CisWcfSystemId { get; set; }

    public bool? RefreshKiosk { get; set; }

    public string TaminClientId { get; set; }

    public string TaminClientSecret { get; set; }

    public string CentralWebsite { get; set; }
}
