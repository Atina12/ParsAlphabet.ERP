using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class AdmissionRefer
{
    public int Id { get; set; }

    public int? AdmissionId { get; set; }

    public byte? AdmissionReferTypeId { get; set; }

    public byte? LifeCycleStateId { get; set; }

    public bool? Isqueriable { get; set; }

    public int? ReferringDoctorId { get; set; }

    public string ReferringDoctorMscId { get; set; }

    public byte? ReferredReasonId { get; set; }

    public byte? ReferredTypeId { get; set; }

    public string ReferredDescription { get; set; }

    public int? AdmitingDoctorId { get; set; }

    public string AdmitingDoctorMscId { get; set; }

    public int? AdmitingDoctorSpecialityId { get; set; }

    public string CompositionUid { get; set; }

    public string MessageUid { get; set; }

    public string PersonUid { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public byte? CompanyId { get; set; }

    public bool? IsCompSent { get; set; }

    public byte? SentResult { get; set; }

    public DateTime? SentDateTime { get; set; }

    public string ReferralId { get; set; }

    public string RelatedHid { get; set; }
}
