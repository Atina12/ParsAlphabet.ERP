using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionMaster
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public int? CreateUserId { get; set; }
    public DateTime? CreateDateTime { get; set; }

    /// <summary>
    /// مبلغ کل پرونده با احتساب موارد مرجوع شده
    /// </summary>
    public decimal? Amount { get; set; }

    /// <summary>
    /// مبلغ کل پرونده که باید پرداخت شود
    /// </summary>
    public decimal? PayableAmount { get; set; }

    // 🔹 Navigation Properties
    public virtual Patient Patient { get; set; }
    public virtual Branch Branch { get; set; }
    public virtual Workflow Workflow { get; set; }
    public virtual User CreateUser { get; set; }
    public virtual Stage Stage { get; set; }
    public virtual Action Action { get; set; }

    // 🔹 One-to-Many
    public virtual ICollection<AdmissionService> AdmissionServices { get; set; } = new HashSet<AdmissionService>();
}