using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.AttenderScheduleBlock;

public interface IAttenderScheduleBlockService
{
    Task<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>> AttenderScheduleBlockSaveService(
        List<AttenderScheduleModel> model, string token, int companyId);

    Task<HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>> AttenderScheduleBlockDeleteService(string model,
        string token);

    Task<HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>> AttenderScheduleBlockValidationService(
        string centralIds, string token);

    Task<HttpResult<ResultQuery>> AttenderScheduleBlockUpdateRangeTimeService(List<UpdateRangeTimeScheduleBlock> model,
        string token, int companyId);

    //Task<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>> AttenderScheduleBlockUpdateMedicalShiftService(List<AttenderScheduleModel> model, string token, int companyId);
    // Task<HttpResult<ResultQuery>> AttenderScheduleBlockUpdateShiftNameService(List<UpdateShiftNameInputModel> model, string token, int companyId);
    Task<HttpResult<ResultQuery>> AttenderScheduleBlockcChangeLock(ChangeLockScheduleBlock model, string token);
}