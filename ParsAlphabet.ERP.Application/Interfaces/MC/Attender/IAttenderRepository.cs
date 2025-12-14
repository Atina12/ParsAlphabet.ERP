using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.Attender;

public interface IAttenderRepository
{
    Task<MyResultPage<List<AttenderGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<ScheduleAttenderGetRecord>> GetRecordById(short id);
    Task<MyResultQuery> Insert(AttenderModel model);
    Task<MyResultQuery> Update(AttenderModel model);
    Task<MyResultQuery> Delete(int keyvalue);
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    Task<List<MyDropDownViewModel>> GetDropDown(string term);

    Task<string> GetAttenderName(int id);

    //Task<bool> GetBookingEnabled(short id);
    Task<bool> GetNationalCode(CheckAttenderNationalCode model);
}