using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.Branch;

public interface IBranchService
{
    Task<HttpResult<ResultQuery>> SendBranch(CentralBranch model, string token);
}