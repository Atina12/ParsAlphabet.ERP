using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Workflow
{
    public int Id { get; set; }

    public byte? WorkflowCategoryId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
