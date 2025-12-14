using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionPhysiotherapy
{
    public int Id { get; set; }

    public long ErequestId { get; set; }

    public int SessionNo { get; set; }

    public int? TechId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public int? CompanyId { get; set; }
}
