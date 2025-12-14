using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PayrollTaxBracket
{
    public short Id { get; set; }

    public short? FiscalYearId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
