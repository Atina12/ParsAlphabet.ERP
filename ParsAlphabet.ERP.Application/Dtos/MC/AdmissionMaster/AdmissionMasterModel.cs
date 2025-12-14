using System.ComponentModel;
using ParsAlphabet.ERP.Application.Dtos.MC.Patient;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionMaster;

[DisplayName("AdmissionMaster")]
public class AdmissionMasterModel : CompanyViewModel
{
    public int Id { get; set; }
    public AdmissionPatient AdmissionPatientJSON { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public decimal Amount { get; set; }
}