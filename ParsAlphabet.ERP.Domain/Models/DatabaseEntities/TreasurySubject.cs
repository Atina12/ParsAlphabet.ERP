using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TreasurySubject
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public byte? CashFlowCategoryId { get; set; }

    public bool? IsActive { get; set; }

    public byte? CompanyId { get; set; }
}
