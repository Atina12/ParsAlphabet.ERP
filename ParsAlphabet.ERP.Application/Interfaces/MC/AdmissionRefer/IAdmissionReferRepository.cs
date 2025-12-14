using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionRefer;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.WebService.Api.Model.CIS;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionRefer;

public interface IAdmissionReferRepository
{
    GetColumnsViewModel GetColumns();
    GetColumnsViewModel GetColumnsReferredSend();
    GetColumnsViewModel GetColumnFeedBackSend();

    Task<MyResultPage<List<AdmissionReferGetPage>>> GetPage(NewGetPageViewModel model, int userId);

    Task<bool> CheckExist(int id, int companyId);

    //Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    Task<MyResultPage<List<AdmissionReferSendGetPage>>> AdmissionReferSend_GetPage(GetPageViewModel model);

    Task<MyResultPage<List<AdmissionReferSendFeedBackPage>>> AdmissionReferSendFeedBack_GetPage(GetPageViewModel model);

    //Task<MyResultStatus> SaveAdmissionRefer(AdmissionRefer model);
    //Task<MyResultStatus> SaveAdmissionFeedback(AdmissionRefer model);
    Task<GetAdmissionRefer> GetAdmissionRefer(int AdmissionReferId);
    Task<GetAdmissionFeedback> GetAdmissionFeedback(int admissionFeedbackId);

    Task<MyResultQuery> UpdateAdmissionReferWcfUpdate(int admissionReferId, string compositionUID, string messageUID,
        string patientUID, bool serviceResult, int userId, string referralId);

    Task<IEnumerable<MyDropDownViewModel>> GetThrFollowUpPlaneType();
    Task<IEnumerable<MyDropDownViewModel>> LifeCycleStateId();
    Task<IEnumerable<MyDropDownViewModel>> ReferredReasonId();
    Task<IEnumerable<MyDropDownViewModel>> ReferredTypeId();
    Task<IEnumerable<MyDropDownViewModel>> AbuseDurationUnitId();
    Task<IEnumerable<MyDropDownViewModel>> SubstanceTypeId();
    Task<IEnumerable<MyDropDownViewModel>> AmountOfAbuseUnitId();
    Task<IEnumerable<MyDropDownViewModel>> ReactionId(string term);
    Task<IEnumerable<MyDropDownViewModel>> ReactionCategoryId(string term);
    Task<IEnumerable<MyDropDownViewModel>> DiagnosisSeverityId();
    Task<IEnumerable<MyDropDownViewModel>> CausativeAgentId(string term);
    Task<IEnumerable<MyDropDownViewModel>> CausativeAgentCategoryId(string term);
    Task<IEnumerable<MyDropDownViewModel>> ConditionId(string term);
    Task<IEnumerable<MyDropDownViewModel>> RelatedPersonId();
    Task<IEnumerable<MyDropDownViewModel>> PositionId();
    Task<IEnumerable<MyDropDownViewModel>> ActionNameId(string term);
    Task<IEnumerable<MyDropDownViewModel>> TimeTakenUnitId();
    Task<IEnumerable<MyDropDownViewModel>> OnSetDurationToPresentUnitId_Clinical();
    Task<IEnumerable<MyDropDownViewModel>> Finding(string term);
    Task<IEnumerable<MyDropDownViewModel>> SeverityId(string term);
    Task<IEnumerable<MyDropDownViewModel>> GetPulseCharacter();
    Task<IEnumerable<MyDropDownViewModel>> GetLocationOfMeasurment();
    Task<IEnumerable<MyDropDownViewModel>> GetPulseRegularity();
    Task<IEnumerable<MyDropDownViewModel>> GetPulseVolume();
    Task<IEnumerable<MyDropDownViewModel>> GetTemperatureLocation();
    Task<IEnumerable<MyDropDownViewModel>> ErxId(string term);
    Task<IEnumerable<MyDropDownViewModel>> RouteId(string term);
    Task<IEnumerable<MyDropDownViewModel>> DosageUnitId(string term);
    Task<IEnumerable<MyDropDownViewModel>> FrequencyId();
    Task<IEnumerable<MyDropDownViewModel>> LongTermUnitId();
    Task<IEnumerable<MyDropDownViewModel>> OnsetDurationToPresentUnitId_MedicalHistory();
    Task<IEnumerable<MyDropDownViewModel>> MethodId(string term);
    Task<IEnumerable<MyDropDownViewModel>> LateralityId();
    Task<byte> GetAdmissionReferType(int admissionReferId);
    Task<int> GetNextAdmissionReferId(int AdmissionReferId, int headerPagination = 0);
    Task<int> GetReferAdmissionId(int admissionReferId);

    Task<AdmissionReferItemDropDown> GetAdmissionReferItemInfo(string tableName, string idColumnName,
        string titleColumnName, string filter);
    Task<MyResultDataQuery<List<ReferPatientRecord_Result>>> SendReferralPatientRecord(
           List<int> referIds);
    Task<MyResultDataQuery<List<Cis_Result>>> SendFeedBackPatientRecord(List<int> referIds);
    Task<MyResultDataStatus<GetFeedbackPatientRecord_Result>> GetFeedbackPatientRecord(
      int referId);
    Task<MyResultDataStatus<GetReferralPatientRecord_Result>> GetReferPatientRecord(
      string referralId);
}