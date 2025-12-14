using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WF;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionStageAction;

public class GetAdmissionStageAction : CompanyViewModel
{
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public byte Priority { get; set; }
}

public class AdmissionStageActionModel
{
    public int Id { get; set; }
    public int AdmissionStageId { get; set; }
    public byte ActionId { get; set; }
    public string Logic { get; set; }

    public ActionLogicModel LogicModel => JsonConvert.DeserializeObject<ActionLogicModel>(Logic);
}