using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Dtos.MC.Dental;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.Dental;

public interface IDentalRepository
{
    GetColumnsViewModel GetColumns();
    GetColumnsViewModel GetColumnsDentalSend();
    Task<bool> CheckExist(int id, int companyId);
    Task<MyResultPage<List<DentalGetPage>>> GetPage(NewGetPageViewModel model, int userId);
    Task<MyResultStatus> SaveDental(AdmissionDental model);
    Task<GetDental> GetAdmissionDental(int admissionDentalId, int headerPagination = 0);

    Task<MyResultQuery> UpdateDentalWcfUpdate(int admissionDentalId, string compositionUID, string messageUID,
        string patientUID, bool serviceResult, int userId, string DentalId);

    Task<MyResultPage<List<DentalSendGetPage>>> DentalSend_GetPage(GetPageViewModel model);

    Task<IEnumerable<MyDropDownViewModel>> LifeCycleStateId();
    Task<IEnumerable<MyDropDownViewModel>> AbuseDurationUnitId();
    Task<IEnumerable<MyDropDownViewModel>> SubstanceTypeId();
    Task<IEnumerable<MyDropDownViewModel>> AmountOfAbuseUnitId();
    Task<IEnumerable<MyDropDownViewModel>> ReactionId(string term);
    Task<IEnumerable<MyDropDownViewModel>> ReactionCategoryId(string term);
    Task<IEnumerable<MyDropDownViewModel>> ServiceTypeId();
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
    Task<IEnumerable<MyDropDownViewModel>> ErxId(string term);
    Task<IEnumerable<MyDropDownViewModel>> RouteId(string term);
    Task<IEnumerable<MyDropDownViewModel>> DosageUnitId(string term);
    Task<IEnumerable<MyDropDownViewModel>> FrequencyId();
    Task<IEnumerable<MyDropDownViewModel>> LongTermUnitId();
    Task<IEnumerable<MyDropDownViewModel>> OnsetDurationToPresentUnitId_MedicalHistory();
    Task<IEnumerable<MyDropDownViewModel>> MethodId(string term);
    Task<IEnumerable<MyDropDownViewModel>> LateralityId();
    Task<IEnumerable<MyDropDownViewModel>> GetToothName(string term);
    Task<IEnumerable<MyDropDownViewModel>> GetToothPart(string term);
    Task<IEnumerable<MyDropDownViewModel>> GetToothSegment(string term);
    Task<IEnumerable<MyDropDownViewModel>> GetTreatmentServiceCountUnit();
    Task<IEnumerable<MyDropDownViewModel>> GetTreatmentService(int? admissionId);
    Task<IEnumerable<MyDropDownViewModel>> DiagnosisReasonId(string term);
    Task<int> GetDentalAdmissionId(int admissionDentalId);

    Task<DentalItemDropDown> GetDentalItemInfo(string tableName, string idColumnName, string titleColumnName,
        string filter);

    Task<MyResultDataQuery<List<Cis_Result>>> SaveDentalCaseRecord(List<int> dentalIds);
}