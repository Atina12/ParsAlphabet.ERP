using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

/// <summary>
/// اطلاعات نتایج ریز آزمایش های موجود در هر پنل در این جدول ثبت می شود.
/// </summary>
public partial class MedicalLaboratoryResultLine
{
    public int Id { get; set; }

    public int MedicalLaboratoryResultId { get; set; }

    /// <summary>
    /// شناسه خدمت که لوینک باشد و پنل نباشد
    /// </summary>
    public int? TestNameId { get; set; }

    /// <summary>
    /// ترتیب انجام آزمایش ها در صورتی که مهم باشد
    /// </summary>
    public byte? TestSequence { get; set; }

    public string Comment { get; set; }

    public string Note { get; set; }

    /// <summary>
    /// وضعیت جواب آزمایش را نشان می دهد. کدینگ thritaEHR
    /// </summary>
    public int? StatusId { get; set; }

    /// <summary>
    /// کدینگ thrDataTypes
    /// </summary>
    public int? ResultTypeId { get; set; }

    /// <summary>
    /// در این ستون مقدار جواب آزمایش در صورتی که عددی یا تعدادی و یا شمارشی باشد ذخیره می شود
    /// Ordinal
    /// Quantity
    /// Count
    /// </summary>
    public decimal? ResultValue { get; set; }

    public string ResultMagnitudeStatus { get; set; }

    /// <summary>
    /// واحد 
    /// </summary>
    public int? ResultUnitId { get; set; }

    public bool? ResultBoolean { get; set; }

    /// <summary>
    /// نتیجه آزمایش در صورتی که کدینگ باشد در این ستون ذخیره می شود
    /// </summary>
    public int? ResultId { get; set; }

    /// <summary>
    /// اگر نتیجه آزمایش کدینگ باشد جدولی که ستون TestResultId به آن اشاره می کند در این ستون ذخیره می شود
    /// </summary>
    public string ResultTable { get; set; }

    /// <summary>
    /// اگر نتیجه آزمایش نسبت باشد، صورت کسر در این ستون ذخیره می شود.
    /// </summary>
    public decimal? ResultNumerator { get; set; }

    /// <summary>
    /// اگر نتیجه آزمایش نسبت باشد، مخرج کسر در این ستون ذخیره می شود.
    /// </summary>
    public decimal? ResultDenominator { get; set; }

    /// <summary>
    /// 0:نسبت
    /// 1:واحد
    /// 2:درصد
    /// 3:کسر
    /// 4:عدد صحیح-کسر
    /// </summary>
    public byte? ResultProportionType { get; set; }

    /// <summary>
    /// کدینگ thrOrdinalTerm
    /// </summary>
    public int? ResultOrdinalSymbolId { get; set; }

    public int? ResultLowerValue { get; set; }

    public int? ResultUpperValue { get; set; }
}
