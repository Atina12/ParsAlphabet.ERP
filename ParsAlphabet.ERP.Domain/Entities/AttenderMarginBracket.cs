using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AttenderMarginBracket
{
    public int Id { get; set; }

    /// <summary>
    /// نام کمیسیون معالج مربوط به یک دپارتمان
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// نام لاتین کمیسیون معالج مربوط به یک دپارتمان
    /// </summary>
    public string NameEng { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CompanyId { get; set; }

    public bool? IsActive { get; set; }
}
