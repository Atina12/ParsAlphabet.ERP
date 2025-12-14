using System.Drawing;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Prescription;

public class GetPrescriptionPage : GetPageViewModel
{
    public int AttenderId { get; set; }
}

public class NewGetPrescriptionPage : NewGetPageViewModel
{
    public int? AttenderId { get; set; }
}

public class NextPrescriptionId
{
    public int PrescriptionId { get; set; }
    public int HeaderPagination { get; set; }
}

public class PrescriptionGetPage
{
    public int Id { get; set; }
    public string PrescriptionDateTimePersian { get; set; }
    public string ExpiryDatePersian { get; set; }
    public int PrescriptionTypeId { get; set; }
    public string PrescriptionTypeName { get; set; }
    public string PrescriptionType => IdAndTitle(PrescriptionTypeId, PrescriptionTypeName);
    public int AdmissionId { get; set; }
    public string PrescriptionHID { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public long AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);
    public string HidUpdateDateTimePersian { get; set; }
    public string HidType { get; set; }
    public int CreateUserId { get; set; }
    public string UserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, UserFullName);
    public bool Sent { get; set; }
}

public class SendPrescriptionGetPage
{
    public int Id { get; set; }
    public string PrescriptionDateTimePersian { get; set; }
    public string ExpiryDatePersian { get; set; }
    public int RepeatCount { get; set; }
    public int PrescriptionTypeId { get; set; }

    public string PrescriptionTypeName { get; set; }
    public string PrescriptionType => IdAndTitle(PrescriptionTypeId, PrescriptionTypeName);

    public int AdmissionId { get; set; }
    public int PatientId { get; set; }

    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string AttenderFullName { get; set; }
    public long AttenderId { get; set; }

    public string Attender => IdAndTitle(AttenderId, AttenderFullName);

    public string PrescriptionHID { get; set; }
    public string HidType { get; set; }
    public string HidUpdateDateTimePersian { get; set; }
    public bool Sent { get; set; }
    public bool UpdateHID { get; set; }
    public byte UpdateHIDResult { get; set; }
    public string UpdateHIDResultName { get; set; }
    public bool SendPrescription { get; set; }
    public byte SendPrescriptionResult { get; set; }
    public string SendPrescriptionResultName { get; set; }
}

public class UpdatePrescriptionHID
{
    public int Id { get; set; }
    public string HID { get; set; }
    public bool HIDOnline { get; set; }
    public DateTime UpdateHIDDateTime { get; set; } = DateTime.Now;
}

public class GetPrescriptionByAdmissionId
{
    public int Id { get; set; } // For #prescriptionId in each page
    public int PrescriptionDrugId { get; set; }
    public int PrescriptionLabId { get; set; }
    public int PrescriptionImageId { get; set; }

    public string CreateDatePersian { get; set; }
    public string CreateTime { get; set; }
    public string ExpiryDatePersian { get; set; }
    public byte RepeatCount { get; set; }
    public string Note { get; set; }
    public short PriorityId { get; set; }
    public string PriorityName { get; set; }
    public string PriorityCode { get; set; }
    public byte PrescriptionTypeId { get; set; }
    public string PrescriptionTypeName { get; set; }

    public short IntentId { get; set; }
    public string IntentName { get; set; }
    public string IntentCode { get; set; }

    public short SpecimenTissueTypeId { get; set; }
    public string SpecimenTissueTypeName { get; set; }
    public string SpecimenTissueTypeCode { get; set; }

    public byte AdequacyForTestingId { get; set; }
    public string AdequacyForTestingName { get; set; }

    public short CollectionProcedureId { get; set; }
    public string CollectionProcedureName { get; set; }
    public string CollectionProcedureCode { get; set; }

    public string CollectionDatePersian { get; set; }
    public string CollectionTime { get; set; }
    public string CollectionDateTimePersian => $"{CollectionDatePersian} {CollectionTime}";

    public string SpecimenIdentifier { get; set; }

    public string CompositionUID { get; set; }
    public string MessageUID { get; set; }
    public string PatientUID { get; set; }
    public int CreateUserId { get; set; }
    public string UserFullName { get; set; }
    public int AdmissionId { get; set; }
    public string ReasonEncounter { get; set; }
    public string AdmissionHID { get; set; }
    public short ReasonForEncounterId { get; set; }
    public string ReasonForEncounterCode { get; set; }
    public string ReasonForEncounterName { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public string PatientBirthDate { get; set; }
    public string PatientMobileNo { get; set; }
    public string PatientAddress { get; set; }
    public string BasicInsurerName { get; set; }
    public string InsuranceBoxName { get; set; }
    public string CompInsuranceBoxName { get; set; }
    public string PrescriptionHID { get; set; }

    public bool HIDOnline { get; set; }
    public string InsurExpDatePersian { get; set; }
    public string AttenderFullName { get; set; }
    public int ThirdPartyId { get; set; }
    public string ThirdPartyName { get; set; }

    public string DrugLineJSON
    {
        set => PrescriptionDrugLines = JsonConvert.DeserializeObject<List<PrescriptionDrugLineList>>(value);
    }

    public List<PrescriptionDrugLineList> PrescriptionDrugLines { get; set; }

    public string DrugLineDetailJSON
    {
        set => PrescriptionDrugLineDetails = JsonConvert.DeserializeObject<List<PrescriptionDrugLineDetailList>>(value);
    }

    public List<PrescriptionDrugLineDetailList> PrescriptionDrugLineDetails { get; set; }

    public string ImageLineJSON
    {
        set => PrescriptionImageLines = JsonConvert.DeserializeObject<List<PrescriptionImageLineList>>(value);
    }

    public List<PrescriptionImageLineList> PrescriptionImageLines { get; set; }

    public string ImageLineDetailJSON
    {
        set => PrescriptionImageLineDetails =
            JsonConvert.DeserializeObject<List<PrescriptionImageLineDetailList>>(value);
    }

    public List<PrescriptionImageLineDetailList> PrescriptionImageLineDetails { get; set; }


    public string LabLineJSON
    {
        set => PrescriptionLabLines = JsonConvert.DeserializeObject<List<PrescriptionLabLineList>>(value);
    }

    public List<PrescriptionLabLineList> PrescriptionLabLines { get; set; }


    public string DiagnosisLineJson
    {
        set => PrescriptionDiagnosisLines = JsonConvert.DeserializeObject<List<AdmissionDiagnosisLineList>>(value);
    }

    public List<AdmissionDiagnosisLineList> PrescriptionDiagnosisLines { get; set; }
}

public class PrescriptionDrugLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public short ProductId { get; set; }
    public string ProductName { get; set; }
    public short AsNeedId { get; set; }
    public string AsNeedName { get; set; }
    public double Dosage { get; set; }
    public short DosageUnitId { get; set; }
    public string DosageUnitName { get; set; }
    public short FrequencyId { get; set; }
    public string FrequencyName { get; set; }
    public short RouteId { get; set; }
    public string RouteName { get; set; }
    public short MethodId { get; set; }
    public string MethodName { get; set; }
    public short PriorityId { get; set; }
    public string PriorityName { get; set; }
    public int ReasonId { get; set; }
    public string ReasonName { get; set; }
    public short BodySiteId { get; set; }
    public string BodySiteName { get; set; }
    public string Description { get; set; }
    public string PatientInstruction { get; set; }
    public bool IsCompounded { get; set; }
    public short TotalNumber { get; set; }
    public short TotalNumberUnitId { get; set; }
    public string TotalNumberUnitName { get; set; }
    public short MaxNumber { get; set; }
}

public class PrescriptionDrugLineDetailList
{
    public int HeaderID { get; set; }
    public byte RowNumber { get; set; }
    public byte DetailRowNumber { get; set; }
    public short ProductId { get; set; }
    public string ProductName { get; set; }
    public short Qty { get; set; }
    public short QtyMax { get; set; }
    public short UnitId { get; set; }
    public string UnitName { get; set; }
    public byte RoleId { get; set; }
    public string RoleName { get; set; }
}

public class PrescriptionImageLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }

    public short BodySiteId { get; set; }
    public string BodySiteName { get; set; }
    public short LateralityId { get; set; }
    public string LateralityName { get; set; }
    public string Note { get; set; }
    public string PatientInstruction { get; set; }
}

public class PrescriptionImageLineDetailList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public byte DetailRowNumber { get; set; }
    public int ServiceId { get; set; }

    public string ServiceName { get; set; }
    // public short LateralityId { get; set; }
    //public string LateralityName { get; set; }
}

public class PrescriptionLabLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public bool DoNotPerform { get; set; }
    public short AsNeedId { get; set; }
    public string AsNeedName { get; set; }
    public int ReasonId { get; set; }
    public string ReasonName { get; set; }
    public int MethodId { get; set; }
    public string MethodName { get; set; }

    public short BodySiteId { get; set; }
    public string BodySiteName { get; set; }
    public string Note { get; set; }
    public string PatientInstruction { get; set; }
}

public class DrugItemDropDown
{
    public string Id { get; set; }
    public string Name { get; set; }
}

public class SearchAdmission
{
    public int AdmissionId { get; set; }

    public DateTime AdmissionDateTime { get; set; }
    public string AdmissionDatePersian => AdmissionDateTime.ToPersianDateString("{0}/{1}/{2}");
    public string AdmissionTime => AdmissionDateTime.ToPersianDateString("{3}:{4}:{5}");

    public short BranchId { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte WorkflowCategoryId { get; set; }

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }

    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }

    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }

    public string BasicInsurerLineCode { get; set; }

    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public int CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }


    public string AdmissionHID { get; set; }
    public string ReferredHID { get; set; }

    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }

    public DateTime? BasicInsurerExpirationDate { get; set; }

    public string BasicInsurerExpirationDatePersian =>
        BasicInsurerExpirationDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public string BasicInsurerNo { get; set; }

    public DateTime? PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public DateTime? ReserveDateTime { get; set; }
    public string ReserveDate => ReserveDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
    public string ReferringFullName { get; set; }


    public int ReferringId { get; set; }
}

public class SendPrescription
{
    //public Developer Developer { get; set; }
    //public Organization Organization { get; set; }
    //public CIS_MyWebService.Admission Admission { get; set; }
    //public Patient Patient { get; set; }
    //public ProviderComp ProviderComp { get; set; }
    //public ReferringComp ReferringComp { get; set; }
    //public BillInsurance BillInsurance { get; set; }
    //public Prescription Prescription { get; set; }
    //public PrescriptionLab PrescriptionLab { get; set; }
    //public ID HID { get; set; }
    //public List<Diagnosis> Diagnoses { get; set; }
    //public List<Drug> Drugs { get; set; }
    //public List<Lab> Labs { get; set; }
    public List<Image> Images { get; set; }
}

public class ResultSendPrescription
{
    public int PrescriptionId { get; set; }
    public string PatientUID { get; set; }
    public string CompositionUID { get; set; }
    public string MessageUID { get; set; }
    public string ErrorMessage { get; set; }
    public int ErrorStatus { get; set; }
    public bool IsCompSent { get; set; }
}

public class GetPrescriptionSelect2
{
    public string Term { get; set; }
    public byte ServiceType { get; set; }
    public bool IsGeneric { get; set; }
}