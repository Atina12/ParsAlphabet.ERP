using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class RoleWorkflowPermission
{
    public int Id { get; set; }

    public byte? RoleId { get; set; }

    public short? BranchId { get; set; }

    public int? WorkflowId { get; set; }

    public short? StageId { get; set; }

    public byte? ActionId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public byte? CompanyId { get; set; }

    public byte? WorkflowCategoryId { get; set; }
}
