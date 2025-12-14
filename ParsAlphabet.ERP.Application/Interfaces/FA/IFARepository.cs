namespace ParsAlphabet.ERP.Application.Interfaces.FA;

public interface IFARepository
{
    Task<List<MyDropDownViewModel>> ClassId_GetDropDown();

    //  Task<List<MyDropDownViewModel>> SubClassId_GetDropDown(short fixedAssetClassId);   
    Task<List<MyDropDownViewModel>> DepreciationMethod_GetDropDown();
    Task<string> GetFixedAssetClassName(int id);
}