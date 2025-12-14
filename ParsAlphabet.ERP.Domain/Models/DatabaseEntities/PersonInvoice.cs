using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PersonInvoice
{
    public int Id { get; set; }

    public int InvoiceId { get; set; }

    public byte InvoiceTypeId { get; set; }

    public short BranchId { get; set; }

    public byte? CurrencyId { get; set; }

    public DateTime? InvoiceDate { get; set; }

    public byte? PersonTypeId { get; set; }

    public int? PersonId { get; set; }

    public int? EmployeeId { get; set; }

    public byte? ReturnReasonId { get; set; }

    public string Note { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? UserId { get; set; }

    /// <summary>
    /// 1: Open
    /// 2: Close
    /// 3: Cancel
    /// </summary>
    public byte? Status { get; set; }

    public bool? OfficialInvoice { get; set; }

    public byte? CompanyId { get; set; }
}
