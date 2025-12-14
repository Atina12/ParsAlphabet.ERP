using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.GN.PersonAccount;

namespace ParsAlphabet.ERP.Application.Interfaces.GN.PersonAccount;

public interface IPersonAccountRepository
{
    GetColumnsViewModel GetColumns(byte personTypeId);
    Task<MyResultPage<List<PersonAccountGetPage>>> GetPage(NewGetPageViewModel model);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    Task<MyResultPage<PersonAccountGetRecord>> GetRecordById(int id, int companyId);
    Task<MyResultQuery> Insert(PersonAccountModel model);
    Task<MyResultQuery> Update(PersonAccountModel model);
    Task<MyResultQuery> Delete(int id, int companyId);
    Task<List<MyDropDownViewModel>> GetDropDown();
}