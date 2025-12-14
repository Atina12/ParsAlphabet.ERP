namespace ParsAlphabet.ERP.Application.Interfaces.SM;

public interface ISMRepository
{
    Task<List<MyDropDownViewModel>> CommissionBase_GetDropDown();
    Task<List<MyDropDownViewModel>> CommissionMethod_GetDropDown();
    Task<IEnumerable<MyDropDownViewModel>> ContractType_GetDropDown();
    Task<IEnumerable<MyDropDownViewModel>> PriceType_GetDropDown();
    Task<List<MyDropDownViewModel>> PersonStageDropDown();
}