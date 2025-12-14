using Microsoft.AspNetCore.Mvc.ModelBinding;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.ERP.Application.Dtos.MC;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.Insurer;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;
using ParsAlphabet.ERP.Application.Dtos.MC.Service;

namespace ParsAlphabet.ERP.Application.Interfaces.MC;

public interface IAdmissionsRepository
{
    Task<List<MyDropDownViewModel>> AdmissionType_GetDropDown();
    Task<List<InsurerDropDownViewModel>> InsuranceBox_GetDropDown(int insurerId);
    Task<List<InsurerDropDownViewModel>> InsuranceBoxList_GetDropDown(string insurerIds);
    Task<List<MyDropDownViewModel2>> CompInsuranceBox_GetDropDown(int companyId, bool isAlive, byte isActive);
    Task<List<MyDropDownViewModel>> AdmissionCounterType_GetDropDown();
    Task<List<MyDropDownViewModel>> MedicalSubjectGetList();
    Task<List<MyDropDownViewModel>> CalculationMethodDropDown(byte itemTypeId, byte insurerTypeId);
    Task<string> CalculationMethodName(byte id);
    Task<List<MyDropDownViewModel>> Speciality_GetDropDown();
    Task<List<MyDropDownViewModel>> Role_GetDropDown();
    Task<List<MyDropDownViewModel>> GetThrServiceDropDown(string term);
    Task<List<MyDropDownViewModel>> GetThrCdtServiceDropDown(string term);
    Task<List<MyDropDownViewModel>> GetTaminServiceDropDown(string term);
    Task<List<MyDropDownViewModel>> GetThrSpecialityDropDown(string term);
    Task<string> GetThrSpecialityName(int code);
    Task<List<MyDropDownViewModel>> MSCType_GetDropDown();
    Task<List<MyDropDownViewModel>> PatientRefferalType_GetDropDown();
    Task<List<MyDropDownViewModel>> EliminateHIDReason_GetDropDown(string displaymode);
    Task<List<MyDropDownViewModel>> TaminLaboratoryGroup_GetDropDown();
    Task<IEnumerable<ServiceGroupDropDown>> GetDropDownServiceType(string type);
    Task<IEnumerable<MyDropDownViewModel>> GetServiceByType(string type, string term);
    Task<MyDropDownViewModel2> GetThrOrganization(byte id);
    Task<byte> GetAttenderRoleId(string code);
    Task<short> GetSpecialityId(string code);
    Task<string> GetSpecialityName(short id);
    Task<List<MyDropDownViewModel2>> GetThrServiceTypeDropDown();
    Task<string> GetTaminServiceName(int id);
    Task<string> GetThrRVUName(int id);
    Task<string> GetThrCDTName(int id);
    Task<SetupClientTamin> GetSetupClientTamin(int companyId, byte clientType, string paraTypeId);
    Task<TaminServicePrescription> GetTaminServicePrescription(int id);
    Task<List<TaminServicePrescription>> GetTaminServicePrescriptionList();
    Task<string> GetTaminPlanCode(int id);
    Task<string> GetTaminDrugAmountCode(int id);
    Task<string> GetTaminDrugInstructionCode(int id);
    Task<string> GetTaminDrugUsageCode(int id);

    Task<List<MyDropDownViewModel>> AppointmentDistributionTypeGetDropDown();

    List<MyDropDownViewModel> IsOfflineBookingUnLimit_GetDropdown();

    List<MyDropDownViewModel> IsOnlineBookingUnLimit_GetDropdown();
    List<MyDropDownViewModel> IsPatient_GetDropdown();
    Task<MyResultPage<List<MedicalTimeShiftDisplay>>> DisplayScheduleBlock(NewGetPageViewModel model);

    Task<List<ConvertAttenderScheduleBlockFromCentral>> ConvertAttenderScheduleBlockFromCentral(
        List<ResultValidateAttenderScheduleBlock> modelList);

    Task<MemoryStream> ExportCsvScheduleBlock(NewGetPageViewModel model);
    Task<bool> CheckValidation(int? id, bool isMaster);

    Task<MyResultDataQuery<AdmissionResultQuery>> InsertAdmission(
        ParsAlphabet.ERP.Application.Dtos.MC.Admission.AdmissionModel model);

    Task<MyResultDataQuery<MyResultStatus>> InsertAdmissionCashLine(
        AdmissionCashLineModel model);

    Task<MyResultDataQuery<AdmissionResultQuery>> InsertAdmissionByCashLine(
        AdmissionByAdmissionCashLine modelValue, ModelStateDictionary modelState);
}