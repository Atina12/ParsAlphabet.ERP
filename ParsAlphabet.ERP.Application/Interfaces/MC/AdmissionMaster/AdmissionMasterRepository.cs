using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionMaster;
using ParsAlphabet.ERP.Application.Dtos.WF.StageAction;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionMaster;

public interface IAdmissionMasterRepository
{
    new GetColumnsViewModel GetColumns();
    Task<MyResultPage<List<AdmissionMasterGetPage>>> GetPage(NewGetPageViewModel model, int userId);
    Task<List<AdmissionMasterGetAdmission>> GetMasterAdmissions(int admissionMasterId);
    Task<string> ValidateCheckAdmissionMasterPermission(AdmissionCheckPermissionViewModel model);
    Task<AdmissionResultQuery> Save(AdmissionMasterModel model);
    Task<MyResultStatus> UpdateLastActionMaster(int id, byte lastActionId);
    Task<List<AdmissionCashByAdmissionMaster>> GetAdmissionCashByMaster(int admissionMasterId);
    Task<MyResultStatus> UpdateAdmissionMasterAmount(int admissionMasterId, bool output);
    Task<decimal> GetAdmissionMasterBalance(int id);
    Task<byte> GetAdmissionMasterActionId(int id);
    Task<AdmissionMasterPayAmount> GetAdmissionMasterAmounts(int admissionMasterId);
    Task<byte> GetActionIdByIdentityId(int admissionMasterId);
    Task<List<string>> ValidationActionLogAdmissionMaster(UpdateAction model, byte roleId);
    Task<string> ValidateCheckAdmissionPermission(AdmissionCheckPermissionViewModel model);
    Task<ActionModel> GetAdmissionMasterStageAction(int admissionMasterId);
    Task<List<string>> AdmissionMasterCashValidation(int admissionMasterId, decimal newCashAmount);
}