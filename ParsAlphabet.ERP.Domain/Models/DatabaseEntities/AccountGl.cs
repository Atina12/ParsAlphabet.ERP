using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AccountGl
{
    public int Id { get; set; }

    public int CompanyId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public short? CategoryId { get; set; }

    public byte? NatureId { get; set; }

    public bool? IsActive { get; set; }
}
