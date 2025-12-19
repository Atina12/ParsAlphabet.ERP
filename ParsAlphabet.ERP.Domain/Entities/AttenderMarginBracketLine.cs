using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AttenderMarginBracketLine
{
    public int Id { get; set; }

    /// <summary>
    /// شناسه انواع کمیسیون معالج در یک دپارتمان
    /// </summary>
    public int? HeaderId { get; set; }

    /// <summary>
    /// شماره ردیف به ازای هر شناسه نوع کمیسیون معالج
    /// </summary>
    public byte? RowNumber { get; set; }

    /// <summary>
    /// مبلغ شروع پله پرداخت
    /// </summary>
    public decimal? StartAmount { get; set; }

    /// <summary>
    /// مبلغ پایان پله پرداخت
    /// </summary>
    public decimal? EndAmount { get; set; }

    /// <summary>
    /// نوع محاسبه قیمت: درصد یا نرخ
    /// </summary>
    public byte? PriceTypeId { get; set; }

    public decimal? AttenderCommissionValue { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
