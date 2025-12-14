namespace ParsAlphabet.ERP.Application.Interfaces.GN;

public interface IGNRepository
{
    Task<List<MyDropDownViewModel>> PricingModel_GetDropDown();
    Task<List<MyDropDownViewModel>> PriceType_GetDropDown();
    Task<List<MyDropDownViewModel>> IndustryGroup_GetDropDown();
    Task<List<MyDropDownViewModel>> PersonGroupType_GetDropDown();
    Task<List<MyDropDownViewModel>> Notify_GetDropDown();
    Task<string> NoSeries_GetName(int id, int companyId);
    Task<List<MyDropDownViewModel>> NoSeries_GetDropDown();
    Task<List<MyDropDownViewModel>> NoSeries_VendorItems_GetDropDown();
    Task<List<MyDropDownViewModel>> PersonTitle_GetDropDown(byte partnerType);
    Task<string> GetFiscalYearLineIdByPersianDate(string PersianDate);
    Task<List<MyDropDownViewModel>> GetTaxType();
}