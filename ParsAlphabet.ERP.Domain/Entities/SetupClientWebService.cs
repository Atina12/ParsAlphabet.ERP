using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class SetupClientWebService
{
    public int Id { get; set; }

    public int? CompanyId { get; set; }

    public string UserName { get; set; }

    public string Password { get; set; }

    public string SoftwareClientId { get; set; }

    public string SoftwareClientSecret { get; set; }

    public byte? ClientType { get; set; }

    public string ServiceProtocol { get; set; }

    public string ServiceBaseUrl { get; set; }

    public string ServicePortNumber { get; set; }

    public string ServiceFullUrl { get; set; }

    public string AcceptableParaClinicTypeId { get; set; }
}
