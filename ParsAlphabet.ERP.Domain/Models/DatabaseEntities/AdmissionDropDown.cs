using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionDropDown
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Content { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CompanyId { get; set; }
}
