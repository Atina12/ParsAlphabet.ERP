using System;
using System.Collections.Generic;
using System.Numerics;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AdmissionService
{
    public int Id { get; set; }
    public int? CentralId { get; set; }
    public int? AdmissionMasterId { get; set; }
    public byte BookingTypeId { get; set; }
    public int? AdmissionNo { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public int WorkflowId { get; set; }
    public short BranchId { get; set; }
    public int AttenderId { get; set; }
    public bool? IsReturn { get; set; }
    public Guid? AttenderScheduleBlockId { get; set; }
    public short ReserveNo { get; set; }
    public DateOnly ReserveDate { get; set; }
    public TimeOnly? ReserveTime { get; set; }
    public int? ReserveShiftId { get; set; }
    public int? ReferringDoctorId { get; set; }
    public int PatientId { get; set; }
    public string BasicInsurerNo { get; set; }
    public string BasicInsurerBookletPageNo { get; set; }
    public DateOnly? BasicInsurerExpirationDate { get; set; }
    public int BasicInsurerId { get; set; }
    public short BasicInsurerLineId { get; set; }
    public int? CompInsurerId { get; set; }
    public short? CompInsurerLineId { get; set; }
    public int? ThirdPartyInsurerId { get; set; }
    public int? DiscountInsurerId { get; set; }
    public byte? CompanyId { get; set; }
    public decimal? AdmissionAmount { get; set; }
    public decimal? AdmissionPenaltyAmount { get; set; }
    public decimal? AdmissionRemainedAmount { get; set; }
    public DateTime CreateDateTime { get; set; }
    public int CreateUserId { get; set; }
    public byte? MedicalSubjectId { get; set; }
    public byte? InOut { get; set; }
    public DateTime? ModifyDateTime { get; set; }
    public int? ModifyUserId { get; set; }

    // 🔹 Navigation Properties
    public virtual AdmissionMaster AdmissionMaster { get; set; }
    public virtual Patient Patient { get; set; }
    public virtual ReferringDoctor ReferringDoctor { get; set; }
    public virtual Attender Attender { get; set; }
    public virtual Branch Branch { get; set; }
    public virtual Workflow Workflow { get; set; }
    public virtual Insurer BasicInsurer { get; set; }
    public virtual Insurer CompInsurer { get; set; }
    public virtual Insurer ThirdPartyInsurer { get; set; }
    public virtual Insurer DiscountInsurer { get; set; }
    public virtual Company Company { get; set; }
    public virtual User CreateUser { get; set; }
    public virtual Stage Stage { get; set; }
    public virtual Action Action { get; set; }
    public ICollection<AdmissionServiceExtraProperty> ExtraProperties { get; set; }
    public ICollection<AdmissionServiceLine> Lines { get; set; }
}
