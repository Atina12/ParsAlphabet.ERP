using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TeamSalesPerson
{
    public short TeamId { get; set; }

    public int EmployeeId { get; set; }
}
