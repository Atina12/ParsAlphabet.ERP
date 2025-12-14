using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.HR.EmployeeContract;

namespace ParsAlphabet.ERP.Application.Interfaces.HR.EmployeeContract;

public interface IEmployeeContractRepository
{
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    Task<MyResultPage<List<EmployeeContractGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<EmployeeContractGetRecord>> GetRecordById(int id);
    Task<MyResultQuery> Insert(EmployeeContractModel model);
    Task<MyResultQuery> Update(EmployeeContractModel model);
    Task<MyResultQuery> Delete(int keyvalue);
}