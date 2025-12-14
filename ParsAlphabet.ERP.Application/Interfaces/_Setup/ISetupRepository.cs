using ParsAlphabet.ERP.Application.Dtos._Setup;

namespace ParsAlphabet.ERP.Application.Interfaces._Setup;

public interface ISetupRepository
{
    Task<SetupInfo> GetSetupInfo();
    Task<List<MyDropDownViewModel>> Country_GetDropDown();
    Task<List<MyDropDownViewModel>> City_GetDropDown();
    Task<List<MyDropDownViewModel>> MaritalStatus_GetDropDown();
    List<MyDropDownViewModel> GetDropDown();
    Task<string> GetCisWcfUrl();
    Task<string> GetCisWcfSystemId();
    Task<bool> GetRefreshKiosk();
    Task UpdateRefreshKiosk();
}