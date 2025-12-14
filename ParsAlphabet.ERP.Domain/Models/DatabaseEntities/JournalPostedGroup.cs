using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class JournalPostedGroup
{
    public int Id { get; set; }

    public int JournalLineId { get; set; }

    public int IdentityId { get; set; }

    public short? StageId { get; set; }

    public int? CompanyId { get; set; }
}
