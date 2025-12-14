using ParsAlphabet.ERP.Application.Dtos.MC.Prescription;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.Prescription;

public interface IPrescriptionRepository
{
    GetColumnsViewModel GetColumns();
    Task<MyResultPage<List<PrescriptionGetPage>>> GetPage(NewGetPrescriptionPage model, int uderId);
    GetColumnsViewModel SendPrescriptionColumns();
    Task<MyResultPage<List<SendPrescriptionGetPage>>> SendPrescriptionGetPage(GetPrescriptionPage model);
    Task<GetPrescriptionByAdmissionId> GetPrescriptionById(int id, int headerPagination, int companyId);

    Task<bool> CheckExist(int id, int companyId);
    Task<Tuple<MyResultStatus, MyResultStatus, MyResultStatus, MyResultStatus>> SavePrescription(GetPrescription model);
    Task<MyResultStatus> UpdatePrescriptionComposition(ResultSendPrescription model);
    Task<byte> GetPrescriptionTypeById(int id);
    Task<int> GetAdmissionIdById(int id, int CompanyId);
    Task<bool> CheckSent(int id);
    Task<bool> CheckHid(int id);
    Task<MyResultStatus> UpdatePrescriptionHid(UpdatePrescriptionHID model);
    Task<int> GetIdByAdmissionId(int admissionId);
    Task<IEnumerable<MyDropDownViewModel>> ProductId(string term);
    Task<IEnumerable<MyDropDownViewModel>> AsNeedId(string term);
    Task<IEnumerable<MyDropDownViewModel>> DosageUnitId(string term);
    Task<IEnumerable<MyDropDownViewModel>> DrugTotalNumberUnitId(string term);
    Task<IEnumerable<MyDropDownViewModel>> FrequencyId(string term);
    Task<IEnumerable<MyDropDownViewModel>> IntentId(string term);
    Task<IEnumerable<MyDropDownViewModel>> RouteId(string term);
    Task<IEnumerable<MyDropDownViewModel>> MethodId(string term);
    Task<IEnumerable<MyDropDownViewModel>> PriorityId(string term);
    Task<IEnumerable<MyDropDownViewModel>> PrescriptionPriorityId(string term);
    Task<IEnumerable<MyDropDownViewModel>> ReasonId(string term);
    Task<IEnumerable<MyDropDownViewModel>> BodySiteId(string term);
    Task<IEnumerable<MyDropDownViewModel>> RoleId(string term);
    Task<IEnumerable<MyDropDownViewModel>> ImageServiceId(string term);
    Task<IEnumerable<MyDropDownViewModel>> LabServiceId(string term);
    Task<IEnumerable<MyDropDownViewModel>> ImageDetailServiceId(string term);
    Task<IEnumerable<MyDropDownViewModel>> DiagnosisStatusId();
    Task<List<MyDropDownViewModel>> ServerityId();
    Task<IEnumerable<MyDropDownViewModel>> DiagnosisReasonId(string term);
    Task<IEnumerable<MyDropDownViewModel>> LateralityId();

    Task<DrugItemDropDown> GetPrescriptionItemInfo(string tableName, string idColumnName, string titleColumnName,
        string filter);

    Task<IEnumerable<MyDropDownViewModel>> ReasonForEncounterId(string term);
    Task<IEnumerable<MyDropDownViewModel>> SpecimenTissueTypeId();
    Task<IEnumerable<MyDropDownViewModel>> PrescriptionTypeDropDown();
}