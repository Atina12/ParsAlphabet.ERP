using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class NavigationOperation
{
    public int NavigationId { get; set; }

    public byte OperationTypeId { get; set; }
}
