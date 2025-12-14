using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageStepConfig;

namespace ParseAlphabet.ERP.Web.Modules.WF.StageStepConfig;

[Route("api/WF/[controller]")]
[ApiController]
[Authorize]
public class StageStepConfigApiController(StageStepConfigRepository stageStepConfigRepository) : ControllerBase
{
    [HttpPost]
    [Route("getstagestepconfigcolumn/{isFormLoaded?}")]
    public async Task<MyResultDataQuery<List<DataStageStepConfigColumnsViewModel>>> GetStageStepConfigColumn(
        [FromBody] GetStageStepConfigColumnsViewModel configColumnModel, [FromRoute] bool isFormLoaded)
    {
        return await stageStepConfigRepository.GetStageStepConfigColumn(configColumnModel, false, isFormLoaded);
    }

    [HttpPost]
    [Route("getstagestepfieldtables")]
    public async Task<MyResultDataQuery<StageStepConfigModel>> GetStageStepFieldTables([FromBody] string formKey)
    {
        return await stageStepConfigRepository.GetStageStepFieldTables(formKey);
    }

    [HttpPost]
    [Route("getvalue")]
    public MyResultDataQuery<string> GetValue([FromBody] List<StageStepGetValueModel> model)
    {
        return stageStepConfigRepository.GetValue(model);
    }
}