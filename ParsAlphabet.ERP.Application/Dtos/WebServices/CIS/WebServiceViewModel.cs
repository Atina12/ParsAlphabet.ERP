using System.ComponentModel.DataAnnotations;
using ParsAlphabet.WebService.Api.Model.CIS;

namespace ParsAlphabet.ERP.Application.Dtos.WebServices.CIS;

public static class WebService
{
    public static List<string> ErrorList = new()
    {
        "anestablishedconnectionwasabortedbythesoftwareinyourhostmachine",
        "therequestfailedwithhttpstatus404notfound",
        "anexistingconnectionwasforciblyclosedbytheremotehost",
        "therequestfailedwithhttpstatus503",
        "unabletoconnecttotheremoteservernoconnectioncouldbemadebecausethetargetmachineactivelyrefusedit",
        "aconnectionattemptfailedbecausetheconnectedpartydidnotproperlyrespondafteraperiodoftime",
        "theunderlyingconnectionwasclosed",
        "messagepart",
        "theremotenamecouldnotberesolved",
        "servicestatusisoff",
        "ارتباط با سامانه بیمه گر برقرار نمی باشد 1911502 -1911501"
    };
}

public class WebServiceViewModel
{
    public class GetPersonByBirth
    {
        [Display(Name = "کدملی")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید.")]
        public string NationalCode { get; set; }

        [Display(Name = "سال تولد")]
        [Required(ErrorMessage = "لطفا {0} را وارد کنید.")]
        [Range(1305, 1405, ErrorMessage = " نباید بیشتر از {1} و {2} باشد.{0}")]
        public short BirthYear { get; set; }
    }

    public class GetCallUpInsurance
    {
        public Person Person { get; set; }
        public Provider Provider { get; set; }
    }

    public class CallupInsuranceResult : CallupInsurance_Result
    {
        public InsuranceResult[] InsuranceList { get; set; }
    }

    public class InsuranceResult : Insurance
    {
        public int InsuranceBoxIdentity { get; set; }
    }

    public class GetHIDOnline
    {
        public Person Person { get; set; }
        public Provider Provider { get; set; }
        public Insurer Insurer { get; set; }
        public ReferringDoctor Referring { get; set; }
        public string InqueryId { get; set; }
    }

    public class GetHIDUrgent : GetHIDOnline
    {
        public bool GetOnline { get; set; }
        public string InsurerCode { get; set; }
    }

    public class EliminateHID
    {
        public HID Hid { get; set; }
        public Person Person { get; set; }
        public string ReasonValue { get; set; }
        public string Description { get; set; }
    }

    public class UpdateHID
    {
        public HID Hid { get; set; }
        public Person Person { get; set; }
        public Provider Provider { get; set; }
        public Insurer Insurer { get; set; }
        public ReferringDoctor Referring { get; set; }
    }

    public class SavePatientBill
    {
        public Developer Developer { get; set; }

        public Organization Organization { get; set; }

        //public CIS_MyWebService.Admission Admission { get; set; }
        public ParsAlphabet.WebService.Api.Model.CIS.Patient Patient { get; set; }
        public ProviderComp ProviderComp { get; set; }
        public ReferringComp ReferringComp { get; set; }
        public BillInsurance[] BillInsurances { get; set; }
        public Service[] Services { get; set; }
        public Diagnosis[] Diagnoses { get; set; }
    }

    public class SendReferralPatientRecord
    {
        public AbuseHistory[] abuseHistorryList { get; set; }

        // public CIS_MyWebService.Admission admission { get; set; }
        public Organization organization { get; set; }
        public ReferringComp referring { get; set; }
        public CareAction[] careActionList { get; set; }
        public ProviderComp attender { get; set; }
        public ClinicFinding[] clinicList { get; set; }
        public Diagnosis[] diagnosisList { get; set; }
        public DrugHistory[] drugHistoryList { get; set; }
        public AdverseReaction[] adverseReactionList { get; set; }
        public DrugOrdered[] drugOrderedList { get; set; }
        public FamilyHistory[] familyHistoryList { get; set; }
        public BillInsurance insurance { get; set; }
        public MedicalHistory[] medicalHistoryList { get; set; }
        public PhysicalExam physicalExam { get; set; }
        public Developer developer { get; set; }
        public LifeCycleState lifeCycleState { get; set; }
        public ParsAlphabet.WebService.Api.Model.CIS.Patient patient { get; set; }
        public ReferralInfo referralInfo { get; set; }
        public string referralId { get; set; }
        public string compositionUID { get; set; }
        public string patientUID { get; set; }
    }

    public class SendFeedBackPatientRecord
    {
        public AbuseHistory[] abuseHistorryList { get; set; }

        // public CIS_MyWebService.Admission admission { get; set; }
        public Organization organization { get; set; }
        public ReferringComp referring { get; set; }
        public CareAction[] careActionList { get; set; }
        public ProviderComp attender { get; set; }
        public ClinicFinding[] clinicList { get; set; }
        public Diagnosis[] diagnosisList { get; set; }
        public DrugHistory[] drugHistoryList { get; set; }
        public DrugOrdered[] drugOrderedList { get; set; }
        public FamilyHistory[] familyHistoryList { get; set; }
        public BillInsurance insurance { get; set; }
        public MedicalHistory[] medicalHistoryList { get; set; }
        public PhysicalExam physicalExam { get; set; }
        public Developer developer { get; set; }
        public LifeCycleState lifeCycleState { get; set; }
        public ParsAlphabet.WebService.Api.Model.CIS.Patient patient { get; set; }
        public ReferralInfo referralInfo { get; set; }
        public FollowUpPlan followUp { get; set; }
        public string referralId { get; set; }
        public string referralAssigner { get; set; }
        public string compositionUID { get; set; }
        public string patientUID { get; set; }
    }

    public class SaveDentalCaseRecord
    {
        public AbuseHistory[] abuseHistorryList { get; set; }

        //  public CIS_MyWebService.Admission admission { get; set; }
        public Organization organization { get; set; }
        public ReferringComp referring { get; set; }
        public ProviderComp attender { get; set; }
        public DentalTreatment[] dentalTreatment { get; set; }
        public DentalDiagnosis[] dentalDiagnosis { get; set; }
        public Tooth[] tooth { get; set; }
        public Diagnosis[] diagnosisList { get; set; }
        public DrugHistory[] drugHistoryList { get; set; }
        public AdverseReaction[] adverseReactionList { get; set; }
        public DrugOrdered[] drugOrderedList { get; set; }
        public FamilyHistory[] familyHistoryList { get; set; }
        public BillInsurance[] insurance { get; set; }
        public MedicalHistory[] medicalHistoryList { get; set; }
        public Developer developer { get; set; }
        public LifeCycleState lifeCycleState { get; set; }
        public ParsAlphabet.WebService.Api.Model.CIS.Patient patient { get; set; }
        public ReferralInfo referralInfo { get; set; }
        public string referralId { get; set; }
        public string compositionUID { get; set; }
        public string patientUID { get; set; }
    }


    public class SaveDeathCertificateRecord
    {
        //  public CIS_MyWebService.Admission admission { get; set; }
        public Organization organization { get; set; }
        public ProviderComp burialAttesterDetails { get; set; }
        public ProviderComp individualRegister { get; set; }
        public string issueDate { get; set; }
        public string serialNumber { get; set; }
        public string comment { get; set; }
        public string deathDate { get; set; }
        public DeathLocation deathLocation { get; set; }
        public string deathTime { get; set; }
        public string householdHeadNationalCode { get; set; }
        public InfantDelivery infantDeliveryInfo { get; set; }
        public ParsAlphabet.WebService.Api.Model.CIS.Patient mother { get; set; }
        public SourceOfNotification sourceOfNotification { get; set; }
        public DeathCause[] deathCauseList { get; set; }
        public MedicalHistory[] relatedConditionList { get; set; }
        public Developer developer { get; set; }
        public LifeCycleState lifeCycleState { get; set; }
        public ParsAlphabet.WebService.Api.Model.CIS.Patient patient { get; set; }
        public string compositionUID { get; set; }
        public string patientUID { get; set; }
    }
}