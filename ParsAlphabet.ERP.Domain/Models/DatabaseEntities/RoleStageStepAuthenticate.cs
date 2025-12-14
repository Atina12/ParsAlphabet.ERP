using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class RoleStageStepAuthenticate
{
    public byte RoleId { get; set; }

    public int StageStepId { get; set; }
}
