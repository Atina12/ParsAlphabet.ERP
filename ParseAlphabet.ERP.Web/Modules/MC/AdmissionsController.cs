using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC;
using ParsAlphabet.ERP.Application.Dtos.MC.Insurer;
using ParsAlphabet.ERP.Application.Dtos.MC.Service;
using ParsAlphabet.ERP.Application.Interfaces.MC;

namespace ParseAlphabet.ERP.Web.Modules.MC;

[Route("api/[controller]")]
[ApiController]
public class AdmissionsApiController(IAdmissionsRepository AdmissionsRepository) : ControllerBase
{
    [HttpGet]
    [Route("calculationmethod_getdropdown/{itemTypeId}/{insurerTypeId}")]
    public async Task<List<MyDropDownViewModel>> CalculationMethodDropDown(byte itemTypeId, byte insurerTypeId)
    {
        return await AdmissionsRepository.CalculationMethodDropDown(itemTypeId, insurerTypeId);
    }


    [HttpGet]
    [Route("medicalsubject_getdropdown")]
    public async Task<List<MyDropDownViewModel>> MedicalSubjectDropDown()
    {
        return await AdmissionsRepository.MedicalSubjectGetList();
    }

    [HttpGet]
    [Route("admissiontype_getdropdown")]
    public async Task<List<MyDropDownViewModel>> AdmissionType_GetDropDown()
    {
        return await AdmissionsRepository.AdmissionType_GetDropDown();
    }

    [HttpGet]
    [Route("insurancebox_getdropdown/{insurerId}")]
    public async Task<List<InsurerDropDownViewModel>> InsuranceBox_GetDropDown(int insurerId)
    {
        return await AdmissionsRepository.InsuranceBox_GetDropDown(insurerId);
    }

    [HttpGet]
    [Route("insuranceboxlist_getdropdown/{insurerIds}")]
    public async Task<List<InsurerDropDownViewModel>> InsuranceBoxList_GetDropDown(string insurerIds)
    {
        return await AdmissionsRepository.InsuranceBoxList_GetDropDown(insurerIds);
    }

    [HttpGet]
    [Route("admissioncountertype_getdropdown")]
    public async Task<List<MyDropDownViewModel>> AdmissionCounterType_GetDropDown()
    {
        return await AdmissionsRepository.AdmissionCounterType_GetDropDown();
    }

    [HttpGet]
    [Route("taminlaboratorygroup_getdropdown")]
    public async Task<List<MyDropDownViewModel>> TaminLaboratoryGroup_GetDropDown()
    {
        return await AdmissionsRepository.TaminLaboratoryGroup_GetDropDown();
    }

    [HttpGet]
    [Route("compinsurancebox_getdropdown/{isAlive}/{isActive}")]
    public async Task<List<MyDropDownViewModel2>> CompInsuranceBox_GetDropDown(bool isAlive, byte isActive = 1)
    {
        var companyId = UserClaims.GetCompanyId();
        return await AdmissionsRepository.CompInsuranceBox_GetDropDown(companyId, isAlive, isActive);
    }

    [HttpGet]
    [Route("speciality_GetDropDown")]
    public async Task<List<MyDropDownViewModel>> Speciality_GetDropDown()
    {
        return await AdmissionsRepository.Speciality_GetDropDown();
    }

    [HttpGet]
    [Route("role_GetDropDown")]
    public async Task<List<MyDropDownViewModel>> Role_GetDropDown()
    {
        return await AdmissionsRepository.Role_GetDropDown();
    }

    [HttpGet]
    [Route("getthrservicedropdown")]
    public async Task<List<MyDropDownViewModel>> GetThrServiceDropDown(string? term)
    {
        return await AdmissionsRepository.GetThrServiceDropDown(term);
    }

    [HttpGet]
    [Route("getthrcdtservicedropdown")]
    public async Task<List<MyDropDownViewModel>> GetThrCdtServiceDropDown(string? term)
    {
        return await AdmissionsRepository.GetThrCdtServiceDropDown(term);
    }

    [HttpGet]
    [Route("gettaminservicedropdown")]
    public async Task<List<MyDropDownViewModel>> GetTaminServiceDropDown(string? term)
    {
        return await AdmissionsRepository.GetTaminServiceDropDown(term);
    }

    [HttpGet]
    [Route("getthrservicetypedropdown")]
    public async Task<List<MyDropDownViewModel2>> GetThrServiceTypeDropDown()
    {
        return await AdmissionsRepository.GetThrServiceTypeDropDown();
    }

    [HttpGet]
    [Route("getthrspecialitydropdown")]
    public async Task<List<MyDropDownViewModel>> GetThrSpecialityDropDown(string? term)
    {
        return await AdmissionsRepository.GetThrSpecialityDropDown(term);
    }

    [HttpGet]
    [Route("msctype_getdropdown")]
    public async Task<List<MyDropDownViewModel>> MSCType_GetDropDown()
    {
        return await AdmissionsRepository.MSCType_GetDropDown();
    }

    [HttpGet]
    [Route("patientrefferaltype_getdropdown")]
    public async Task<List<MyDropDownViewModel>> PatientRefferalType_GetDropDown()
    {
        return await AdmissionsRepository.PatientRefferalType_GetDropDown();
    }

    [HttpGet]
    [Route("eliminatehidreason_getdropdown/{displaymode}")]
    public async Task<List<MyDropDownViewModel>> EliminateHIDReason_GetDropDown(string displaymode)
    {
        return await AdmissionsRepository.EliminateHIDReason_GetDropDown(displaymode);
    }

    [HttpGet]
    [Route("selecttypeservcie_getdropdown/{type}")]
    public async Task<IEnumerable<ServiceGroupDropDown>> SelectTypeService_GetDropDown(string type)
    {
        return await AdmissionsRepository.GetDropDownServiceType(type);
    }

    [HttpGet]
    [Route("getservicebytype_getdropdown/{type}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetServiceByType_GetDropDown(string type, string? term)
    {
        return await AdmissionsRepository.GetServiceByType(type, term);
    }

    [HttpGet]
    [Route("getorganizqationtype_getdropdown/{type}")]
    public async Task<MyDropDownViewModel2> GetOrganizationType_GetDropDown(byte id)
    {
        return await AdmissionsRepository.GetThrOrganization(id);
    }

    [HttpGet]
    [Route("appointmentdistribution_getdropdown")]
    public async Task<List<MyDropDownViewModel>> AppointmentDistributionTypeGetDropDown()
    {
        return await AdmissionsRepository.AppointmentDistributionTypeGetDropDown();
    }


    [HttpGet]
    [Route("isofflinebookingunlimit_getdropdown")]
    public List<MyDropDownViewModel> IsOfflineBookingUnLimit_GetDropdown()
    {
        return AdmissionsRepository.IsOfflineBookingUnLimit_GetDropdown();
    }

    [HttpGet]
    [Route("isonlinebookingunlimit_getdropdown")]
    public List<MyDropDownViewModel> IsOnlineBookingUnLimit_GetDropdown()
    {
        return AdmissionsRepository.IsOnlineBookingUnLimit_GetDropdown();
    }

    [HttpGet]
    [Route("ispatient_getdropdown")]
    public List<MyDropDownViewModel> IsPatient_GetDropdown()
    {
        return AdmissionsRepository.IsPatient_GetDropdown();
    }

    [HttpPost]
    [Route("dispalyscheduleblock")]
    public async Task<MyResultPage<List<MedicalTimeShiftDisplay>>> DisplayScheduleBlock(
        [FromBody] NewGetPageViewModel model)
    {
        return await AdmissionsRepository.DisplayScheduleBlock(model);
    }

    [HttpPost]
    [Route("csvscheduleblock")]
    //[Authenticate(Operation.PRN, "")]
    public async Task<FileResult> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        var resultCsv = await AdmissionsRepository.ExportCsvScheduleBlock(model);

        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "" };
    }

    [Route("checksettelmentmaster/{id}/{isMaster}")]
    [HttpGet]
    public async Task<bool> CheckValidation(int id, bool isMaster)
    {
        return await AdmissionsRepository.CheckValidation(id, isMaster);
    }
}