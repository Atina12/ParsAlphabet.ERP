using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

public interface IAttenderScheduleBlockServiceCentral
{
    Task<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>> Save(List<AttenderScheduleModel> model,
        int companyId);

    Task<HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>> Delete(string centralIds);

    //Task<HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>> Validation(string centralIds);
    Task<HttpResult<ResultQuery>> UpdateRangeTime(List<UpdateRangeTimeScheduleBlock> model, int companyId);

    //Task<HttpResult<IEnumerable<ResultSaveAttenderScheduleBlock>>> UpdateMedicalShift(List<AttenderScheduleModel> model, int companyId);
    //Task<HttpResult<ResultQuery>> UpdateShiftName(List<UpdateShiftNameInputModel> model, int companyId);
    Task<HttpResult<ResultQuery>> ChangeLock(ChangeLockScheduleBlock model);
}