using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class WorkingHourTypeLine
{
    public byte Id { get; set; }

    public byte? HeaderId { get; set; }

    /// <summary>
    /// مقدار یک &quot;استاندارد&quot; و مقدار دو &quot;واقعی&quot; است.
    /// </summary>
    public byte? CostAccountingTypeId { get; set; }

    public bool? IsActive { get; set; }
}
