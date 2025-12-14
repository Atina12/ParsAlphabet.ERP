using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

/// <summary>
/// تقویم استاندارد برای یک دپارتمان و یک سال مالی در این جدول قرار می گیرد
/// </summary>
public partial class StandardTimeSheet
{
    /// <summary>
    /// شناسه تقویم استاندارد
    /// </summary>
    public short Id { get; set; }

    public string Name { get; set; }

    public string NameEng { get; set; }

    public short? FiscalYearId { get; set; }

    public int? DepartmentId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public string Description { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }
}
