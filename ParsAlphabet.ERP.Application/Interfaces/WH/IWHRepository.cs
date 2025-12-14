namespace ParsAlphabet.ERP.Application.Interfaces.WH;

public interface IWHRepository
{
    Task<List<MyDropDownViewModel>> CostingMethod_GetDropDown();
    Task<List<MyDropDownViewModel>> BinCategory_GetDropDown();
    Task<List<MyDropDownViewModel>> ItemTypeIsItem_GetDropDown();
    Task<List<MyDropDownViewModel>> ItemType_GetDropDown();
    Task<List<MyDropDownViewModel>> ItemTypeSalesPrice_GetDropDown();
    Task<List<MyDropDownViewModel>> ItemTypeByType_GetDropDown(string itemTypes);
}