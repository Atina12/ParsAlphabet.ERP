using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class MedicalItemPrice
{
    public int Id { get; set; }

    public int? CentralId { get; set; }

    /// <summary>
    /// شناسه آیتم قابل قیمت گذاری
    /// </summary>
    public int? ItemId { get; set; }

    public byte? ItemTypeId { get; set; }

    public byte? InsurerTypeId { get; set; }

    /// <summary>
    /// شناسه نوع تعرفه
    /// </summary>
    public byte? MedicalSubjectId { get; set; }

    /// <summary>
    /// شناسه نوع قیمت گذاری
    /// </summary>
    public byte? PricingModelId { get; set; }

    public decimal? BeginPrice { get; set; }

    public decimal? EndPrice { get; set; }

    public bool? IsActive { get; set; }

    public int? CompanyId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
