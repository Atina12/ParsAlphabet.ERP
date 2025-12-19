using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class SetupHealthCare
{
    public int CompanyId { get; set; }

    public string CisWcfUrl { get; set; }

    public string CisWcfSystemId { get; set; }

    public string TaminClientId { get; set; }

    public string TaminClientSecret { get; set; }

    public string WebServiceOrgGuid { get; set; }

    public byte? WebServiceOrgTerminologyId { get; set; }

    public string ArmedInsuranceIdentity { get; set; }

    public string ArmedInsuranceName { get; set; }

    public string TaminInsuranceIdentity { get; set; }

    public string TaminInsuranceName { get; set; }

    public string SiamId { get; set; }
}
