using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class OrganizationalDepartment
{
    public int Id { get; set; }

    public int? ParentId { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
