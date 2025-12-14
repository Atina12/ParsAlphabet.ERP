using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class InsurerPrice
{
    public int Id { get; set; }

    public int? CentralId { get; set; }

    public int? InsurerId { get; set; }

    public short? InsurerLineId { get; set; }

    /// <summary>
    /// شناسه قیمت گذاری آیتم قابل قیمت گذاری
    /// </summary>
    public int? MedicalItemPriceId { get; set; }

    /// <summary>
    /// شناسه نحوه محاسبه قیمت آیتم قابل قیمت گذاری
    /// </summary>
    public byte? InsurerPriceCalculationMethodId { get; set; }

    /// <summary>
    /// سقف قیمت مورد قبول بیمه برای یک آیتم قابل قیمت گذاری
    /// </summary>
    public decimal? InsurerPrice1 { get; set; }

    public decimal? InsurerSharePer { get; set; }

    public int? CompanyId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
