using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class Prescription
{
    public int Id { get; set; }

    public int? AdmissionId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public int? CreateUserId { get; set; }

    public byte? PrescriptionTypeId { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public string PatientUid { get; set; }

    public string CompositionUid { get; set; }

    public string MessageUid { get; set; }

    public byte? RepeatCount { get; set; }

    public string Hid { get; set; }

    public bool? Hidonline { get; set; }

    public DateTime? UpdateHiddateTime { get; set; }

    public byte? UpdateHidresult { get; set; }

    public byte? CompanyId { get; set; }

    public bool? IsCompSent { get; set; }

    public DateTime? SendPrescriptionDateTime { get; set; }

    public byte? SendPrescriptionResult { get; set; }

    public string ReasonEncounter { get; set; }

    public string Note { get; set; }

    public short? PriorityId { get; set; }

    public short? IntentId { get; set; }

    public short? SpecimenTissueTypeId { get; set; }

    public byte? AdequacyForTestingId { get; set; }

    public short? CollectionProcedureId { get; set; }

    public DateTime? CollectionDateTime { get; set; }

    public string SpecimenIdentifier { get; set; }
}
