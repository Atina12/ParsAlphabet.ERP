using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

/// <summary>
/// در صورتی که آزمایش پاتولوژی باشد اطلاعات مربوط به آن در این جدول ثبت می شود. علت این است که آزمایش های پاتولوژی ویژگی های بیشتری نسبت به سایر آزمایش ها دارند
/// </summary>
public partial class MedicalLaboratoryPathology
{
    public int Id { get; set; }

    public int? MedicalLaboratoryResultId { get; set; }

    public string ClinicalInformation { get; set; }

    public string MacroscopicExamination { get; set; }

    public string MicroscopicExamination { get; set; }

    public byte? CoWorkerCompanyId { get; set; }
}
