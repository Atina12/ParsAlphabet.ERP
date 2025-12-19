using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class PurchaseOrderLine
{
    public int Id { get; set; }

    public int HeaderId { get; set; }

    public short? BranchId { get; set; }

    public byte? ItemTypeId { get; set; }

    public byte? InOut { get; set; }

    public int? ItemId { get; set; }

    public short? CategoryId { get; set; }

    public byte? CurrencyId { get; set; }

    public decimal? Quantity { get; set; }

    /// <summary>
    /// نرخ خارجی - مبلغ برابر است با تعداد*نرخ*نرخ تسعیر
    /// </summary>
    public decimal? Price { get; set; }

    /// <summary>
    /// این نرخ برای ارز پیشفرض داخل جدول کمپانی برابر 1 می باشد
    /// </summary>
    public decimal? ExchangeRate { get; set; }

    public decimal? GrossAmount { get; set; }

    public decimal? DiscountValue { get; set; }

    /// <summary>
    /// مقدار 1 معادل درصد - مقدار 2 معادل نرخ
    /// </summary>
    public byte? DiscountType { get; set; }

    public decimal? DiscountAmount { get; set; }

    public decimal? NetAmount { get; set; }

    public short? VatId { get; set; }

    /// <summary>
    /// درصد مالیات بر ارزش افزوده را ذخیره میکند که ملاک محاسبه مبلغ با احتساب ارزش افزوده می باشد
    /// </summary>
    public byte? Vatper { get; set; }

    public decimal? Vatamount { get; set; }

    public decimal? FinalAmount { get; set; }

    /// <summary>
    /// مجوز
    /// </summary>
    public bool? AllowInvoiceDiscount { get; set; }

    /// <summary>
    /// قیمت مصرف کننده
    /// </summary>
    public bool? PriceIncludingVat { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public decimal? AvgMargin { get; set; }

    public decimal? AvgNetPrice { get; set; }

    public decimal? TotalAvgNetAmount { get; set; }

    public decimal? AvgFinalPrice { get; set; }

    public decimal? TotalAvgFinalAmount { get; set; }

    public decimal? AvgGrossPrice { get; set; }

    public decimal? TotalAvgGrossAmount { get; set; }

    public decimal? AvgVatprice { get; set; }

    public decimal? TotalAvgVatamount { get; set; }

    public decimal? AvgDiscountPrice { get; set; }

    public decimal? TotalAvgDiscountAmount { get; set; }

    public bool? BySystem { get; set; }
}
