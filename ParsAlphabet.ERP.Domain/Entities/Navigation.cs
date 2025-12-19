using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class Navigation
{
    public int Id { get; set; }

    public int? ParentId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public string IconNameOld { get; set; }

    public string IconName { get; set; }

    public short? SortOrder { get; set; }

    public string ControllerName { get; set; }

    public string LinkAddress { get; set; }

    public bool? IsNav { get; set; }

    public int? CompanyId { get; set; }

    public bool? IsViwoperation { get; set; }
}
