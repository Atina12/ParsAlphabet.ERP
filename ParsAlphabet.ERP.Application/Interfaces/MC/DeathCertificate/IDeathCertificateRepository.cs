using ParsAlphabet.ERP.Application.Dtos.MC.DeathCertificate;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.DeathCertificate1;

public interface IDeathCertificateRepository
{
    GetColumnsViewModel GetColumns();
    GetColumnsViewModel GetColumnsDeathCertificateSend();
    Task<GetDeathCertificate> GetDeathCertificate(int deathId, int headerPagination = 0);
    Task<bool> CheckExist(int id, int companyId);
    Task<MyResultPage<List<DeathCertificateGetPage>>> GetPage(NewGetPageViewModel model, int userId);
    Task<MyResultStatus> SaveDeathCertificate(DeathCertificate model);

    Task<MyResultQuery> UpdateDeathWcfUpdate(int Id, string compositionUID, string messageUID, string patientUID,
        bool serviceResult, int userId);

    Task<MyResultPage<List<DeathCertificateSendGetPage>>> DeathCertificateSend_GetPage(GetPageViewModel model);

    Task<IEnumerable<MyDropDownViewModel>> ConditionId(string term);
    Task<IEnumerable<MyDropDownViewModel>> GetCauseId(string term);
    Task<IEnumerable<MyDropDownViewModel>> GetCountryDivisions(string term);
    Task<IEnumerable<MyDropDownViewModel>> DosageUnitId(string term);
    Task<IEnumerable<MyDropDownViewModel>> GetDeathLocationId();
    Task<IEnumerable<MyDropDownViewModel>> GetSourceofDeathNotification();
    Task<IEnumerable<MyDropDownViewModel>> GetInfantWeight();
    Task<IEnumerable<MyDropDownViewModel>> OnsetDurationToPresentUnitId_MedicalHistory();
    Task<IEnumerable<MyDropDownViewModel>> GetDeliveryAgent();
    Task<IEnumerable<MyDropDownViewModel>> GetDeliveryLocation();
    Task<IEnumerable<MyDropDownViewModel>> GetDurationDeath();
    Task<IEnumerable<MyDropDownViewModel>> GetDeathCauseStatus();
    Task<int> GetDeathCertificateAdmissionId(int admissionDeathId);

    Task<DeathCertificateItemDropDown> GetDeathItemInfo(string tableName, string idColumnName, string titleColumnName,
        string filter);
}