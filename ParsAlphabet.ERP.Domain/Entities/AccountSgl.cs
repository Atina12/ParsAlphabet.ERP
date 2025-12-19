using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AccountSgl
{
    public int Glid { get; set; }

    public int Id { get; set; }

    public int CompanyId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public byte AccountDetailRequired { get; set; }

    public short? AccountCategoryId { get; set; }

    public bool? IsActive { get; set; }
}
