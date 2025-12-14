using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class StageFormPlate
{
    public short Id { get; set; }

    public string Name { get; set; }

    public string FormName { get; set; }

    public string ControllerName { get; set; }

    public string Path { get; set; }

    public int? CompanyId { get; set; }
}
