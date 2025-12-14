using ParsAlphabet.ERP.Application.Dtos.FM;

namespace ParsAlphabet.ERP.Application.Interfaces.FM;

public interface IFinanceRepository
{
    Task<IEnumerable<MyDropDownViewModel>> FundType_GetDropDown(string filterType);

    //Task<List<MyDropDownViewModel>> OpenAccount_GetDropDown(string openacc);
    Task<List<MyDropDownViewModel>> FundType_Adm_GetDropDown(bool isOpenAcc);
    Task<List<MyDropDownViewModel>> VatArea_GetDropDown();
    Task<List<MyDropDownViewModel>> CostDriverType_GetDropDown();
    Task<byte> GetCostDriverTypeId(int driverId);
    Task<byte> FundTypeInputMethod(int fundTypeId);
    Task<byte> GetNoSeriesIdAccountDetail(int accountDetailId, int companyId);
    byte GetNoSeriesIdAccountDetailSync(int accountDetailId, int companyId);
    Task<List<MyDropDownViewModel>> CostDriver_GetDropDown(byte driverTypeId);
    Task<List<MyDropDownViewModel>> CostCategory_GetDropDown(int companyId);
    Task<List<MyDropDownViewModel>> CostObject_GetDropDown(byte driverTypeId);
    Task<List<MyDropDownViewModel>> CostEntityType_GetDropDown();
    Task<List<MyDropDownViewModel>> BankAccountCategory_GetDropDown();
    Task<List<MyDropDownViewModel>> CostObject_GetDropDown(int entityTypeId);
    Task<List<MyDropDownViewModel>> FundTypeAdm_GetDropDown(GetFundTypeAdm model);
    Task<List<MyDropDownViewModel>> AccountDetail_GetDropDown(int companyId);
    Task<List<MyDropDownViewModel>> CashFlowCategory_GetDropDown();
    Task<List<MyDropDownViewModel>> AccountNatureType_GetDropDown();
    Task<List<MyDropDownViewModel>> FundTypeAdmActive_GetDropDown();
    Task<string> CostDriver_GetName(int id);
    Task<List<MyDropDownViewModel>> IncomeBalanceType_GetDropDown();
}