using ParsAlphabet.ERP.Application.Dtos.MC.MedicalLaboratory;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.MedicalLaboratory;

public interface IMedicalLaboratoryRepository
{
    GetColumnsViewModel GetColumns();
    GetColumnsViewModel GetColumnsMedicalLaboratorySend();
    Task<MyResultPage<List<MedicalLaboratoryGetPage>>> GetPage(NewGetPageViewModel model, int userId);
    Task<MyResultStatus> SaveMedicalLaboratory(Dtos.MC.MedicalLaboratory.MedicalLaboratory model);
    Task<GetMedicalLaboratory> GetMedicalLaboratory(int MedicalLaboratoryId, int headerPagination = 0);
    Task<bool> CheckExist(int id, int companyId);

    Task<MyResultQuery> UpdateMedicalLaboratoryWcfUpdate(int medicalLaboratoryId, string compositionUID,
        string messageUID, string patientUID, bool serviceResult, int userId);

    Task<MyResultPage<List<MedicalLaboratorySendGetPage>>> MedicalLaboratorySend_GetPage(GetPageViewModel model);

    Task<IEnumerable<MyDropDownViewModel>> LifeCycleStateId();
    Task<IEnumerable<MyDropDownViewModel>> SpecimenTypeId();
    Task<IEnumerable<MyDropDownViewModel>> CodedTypeId(string term);
    Task<IEnumerable<MyDropDownViewModel>> CollectionProcedureId();
    Task<IEnumerable<MyDropDownViewModel>> SnomedctMethodId(string term);
    Task<IEnumerable<MyDropDownViewModel>> LaboratoryPanelId(string term);
    Task<IEnumerable<MyDropDownViewModel>> ResultStatusId();
    Task<IEnumerable<MyDropDownViewModel>> TestNameId(string term);
    Task<IEnumerable<MyDropDownViewModel>> TestPanelId(string term);
    Task<IEnumerable<MyDropDownViewModel>> TestResultId(string term);
    Task<IEnumerable<MyDropDownViewModel>> AgeRangeId();
    Task<IEnumerable<MyDropDownViewModel>> GestationAgeRangeId();
    Task<IEnumerable<MyDropDownViewModel>> HormonalPhaseId();
    Task<IEnumerable<MyDropDownViewModel>> ReferenceStatusId();
    Task<IEnumerable<MyDropDownViewModel>> SpeciesId();
    Task<IEnumerable<MyDropDownViewModel>> DiagnosisReasonId(string term);
    Task<IEnumerable<MyDropDownViewModel>> SeverityId(string term);
    Task<IEnumerable<MyDropDownViewModel>> DiagnosisStatusId();
    Task<IEnumerable<MyDropDownViewModel>> SpecimenAdequacyId();
    Task<IEnumerable<MyDropDownViewModel>> TestResultTypeId();
    Task<IEnumerable<MyDropDownViewModel>> TestResultUnitId(string term);
    Task<IEnumerable<MyDropDownViewModel>> TestResultUnitId_ResultType(string term);
    Task<IEnumerable<MyDropDownViewModel>> TopographyLaterality();
    Task<int> GetMedicalLaboratoryAdmissionId(int medicalLaboratoryId);

    Task<MedicalLaboratoryItemDropDown> GetMedicalLaboratoryItemInfo(string tableName, string idColumnName,
        string titleColumnName, string filter);
}