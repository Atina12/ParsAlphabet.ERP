using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class NavigationOperation
{
    public int NavigationId { get; set; }

    public byte OperationTypeId { get; set; }
}
