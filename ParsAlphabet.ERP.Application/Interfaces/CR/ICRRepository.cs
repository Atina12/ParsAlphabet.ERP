namespace ParsAlphabet.ERP.Application.Interfaces.CR;

public interface ICRRepository
{
    Task<List<MyDropDownViewModel>> PersonGroupType_GetDropDown();
    Task<List<MyDropDownViewModel>> PersonGroup_GetDropDown(byte personTypeId, int companyId);
}