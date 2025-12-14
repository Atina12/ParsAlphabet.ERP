using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.Prescription;
using ParsAlphabet.ERP.Application.Dtos.MC.PrescriptionTamin;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.PrescriptionTamin;

namespace ParseAlphabet.ERP.Web.Modules.MC.PrescriptionTamin;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class PrescriptionTaminApiController : Controller
{
    private readonly PrescriptionTaminRepository _prescriptionTaminRepository;

    public PrescriptionTaminApiController(PrescriptionTaminRepository prescriptionTaminRepository)
    {
        _prescriptionTaminRepository = prescriptionTaminRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PrescriptionTaminGetPage>>> GetPage(
        [FromBody] NewGetPrescriptionTaminPage model)
    {
        if (model.Form_KeyValue[0]?.ToString() == "myPr")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        model.AttenderId = 0; // await _attenderPrescriptionRepository.GetAttenderIdByUserId(userId,model.CompanyId);
        var userId = UserClaims.GetUserId();
        ;
        return await _prescriptionTaminRepository.GetPage(model, userId);
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<List<MyResultPrescriptionTamin>> Save([FromBody] SavePrescriptionTamin model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();

        var result = await _prescriptionTaminRepository.SavePrescription(model);

        return result;
    }

    [HttpGet]
    [Route("drugamountdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> DrugAmountDropDown()
    {
        return await _prescriptionTaminRepository.DrugAmountDropDown();
    }

    [HttpGet]
    [Route("drugusagedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> DrugUsageDropDown()
    {
        return await _prescriptionTaminRepository.DrugUsageDropDown();
    }

    [HttpGet]
    [Route("druginstructiondropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> DrugInstructionDropDown()
    {
        return await _prescriptionTaminRepository.DrugInstructionDropDown();
    }

    [HttpGet]
    [Route("plandropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> PlanDropDown()
    {
        return await _prescriptionTaminRepository.PlanDropDown();
    }

    [HttpGet]
    [Route("illnessdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> IllnessDropDown()
    {
        return await _prescriptionTaminRepository.IllnessDropDown();
    }

    [HttpGet]
    [Route("organparentdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> OrganParentDropDown()
    {
        return await _prescriptionTaminRepository.OrganParentDropDown();
    }

    [HttpGet]
    [Route("organdropdown/{parentid}")]
    public async Task<IEnumerable<MyDropDownViewModel>> OrganDropDown(byte parentid)
    {
        return await _prescriptionTaminRepository.OrganDropDown(parentid);
    }

    [HttpGet]
    [Route("pargrpcodedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> ParGrpCodeDropDown()
    {
        return await _prescriptionTaminRepository.ParGrpCodeDropDown();
    }

    [HttpGet]
    [Route("taminprescriptiontypedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> TaminPrescriptionTypeDropDown()
    {
        return await _prescriptionTaminRepository.TaminPrescriptionTypeDropDown();
    }


    [HttpPost]
    [Route("getservicedropdownbytype/{serviceType}/{isGeneric}")]
    public async Task<IEnumerable<ServicePrescriptionByType>> GetServicePrescriptionByType(
        [FromBody] GetPrescriptionSelect2 model)
    {
        return await _prescriptionTaminRepository.GetServicePrescriptionByType(model);
    }

    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.VIW, "")]
    public async Task<GetPrescriptionTamin> PrescriptionDisplay([FromBody] NextPrescriptionId model)
    {
        var prescriptionId = 0;
        var headerPagination = 0;
        var CompanyId = UserClaims.GetCompanyId();
        if (model != null)
        {
            prescriptionId = model.PrescriptionId;
            headerPagination = model.HeaderPagination;
        }

        var result =
            await _prescriptionTaminRepository.PrescriptionDisplay(prescriptionId, headerPagination, CompanyId);
        return result;
    }

    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> PrescriptionCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _prescriptionTaminRepository.CheckExist(id, companyId);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] GetDeletePrescriptionTamin model)
    {
        return await _prescriptionTaminRepository.Delete(model);
    }

    [HttpPost]
    [Route("patientprint")]
    [Authenticate(Operation.PRN, "")]
    public async Task<IEnumerable<PrintPatientPrescriptionTaminViewModel>> GetPatientPrescriptionTaminPrint(
        [FromBody] int id)
    {
        return await _prescriptionTaminRepository.GetPatientPrescriptionTaminPrint(id);
    }
}

[Route("MC")]
[Authorize]
public class PrescriptionTaminController : Controller
{
    [Route("[Controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.PrescriptionTamin.Index);
    }

    [Route("[controller]/form/{id?}")]
    [Authenticate(Operation.INS, "")]
    [HttpGet]
    public IActionResult Form(int? id)
    {
        return PartialView(Views.MC.PrescriptionTamin.Form);
    }

    [Route("[controller]/display/{id}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.PrescriptionTamin.Display);
    }
}