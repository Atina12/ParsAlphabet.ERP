using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AttenderToken
{
    public short Id { get; set; }

    public int? AttenderId { get; set; }

    public int? CompanyId { get; set; }

    public string WebServiceOrgGuid { get; set; }
}
