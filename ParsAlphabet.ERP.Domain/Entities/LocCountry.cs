using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class LocCountry
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string AbbreviationCode { get; set; }

    public string NameEng { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
