using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class PrescriptionTamin
{
    public int Id { get; set; }

    public int? AdmissionServiceTaminId { get; set; }

    public int? AttenderId { get; set; }

    public int? PatientId { get; set; }

    public DateOnly? PrescriptionDate { get; set; }

    public string Comment { get; set; }

    public DateOnly? ExpireDate { get; set; }

    public int? TaminPrescriptionCategoryId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public string TrackingCode { get; set; }

    public string RequestEprescriptionId { get; set; }

    public int? CompanyId { get; set; }

    public bool? IsSent { get; set; }

    public byte? SendResult { get; set; }

    public DateTime? SendDateTime { get; set; }

    public string Otpcode { get; set; }

    public byte? ActionId { get; set; }

    public short? StageId { get; set; }

    public int? WorkflowId { get; set; }
}
