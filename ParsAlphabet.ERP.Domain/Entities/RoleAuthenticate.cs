using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class RoleAuthenticate
{
    public byte RoleId { get; set; }

    public int NavigationId { get; set; }

    public byte OperationTypeId { get; set; }
}
