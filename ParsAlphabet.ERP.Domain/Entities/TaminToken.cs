using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class TaminToken
{
    public int Id { get; set; }

    public string TokenId { get; set; }

    public byte? TokenType { get; set; }

    public DateTime? TokenDateTime { get; set; }

    public int? CompanyId { get; set; }

    public string ParaClinicTypeId { get; set; }
}
