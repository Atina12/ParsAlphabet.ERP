using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class DocumentAccountLine
{
    public int Id { get; set; }

    public int? HeaderId { get; set; }

    public int? AccountGlid { get; set; }

    public int? AccountSglid { get; set; }

    public int? AccountDetailId { get; set; }
}
