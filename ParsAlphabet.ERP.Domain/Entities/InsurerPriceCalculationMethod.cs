using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class InsurerPriceCalculationMethod
{
    public byte Id { get; set; }

    /// <summary>
    /// نام روش محاسبه قیمت آیتم قابل قیمت گذاری
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// نام لاتین روش محاسبه قیمت آیتم قابل قیمت گذاری
    /// </summary>
    public string NameEn { get; set; }

    /// <summary>
    /// نوع آیتم قابل قیمت گذاری
    /// </summary>
    public byte? ItemTypeId { get; set; }

    public byte? InsurerTypeId { get; set; }
}
