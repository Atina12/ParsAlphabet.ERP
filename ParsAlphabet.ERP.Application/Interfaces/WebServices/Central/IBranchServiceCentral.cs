using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;

public interface IBranchServiceCentral
{
    Task<HttpResult<ResultQuery>> BranchCentral(CentralBranch model);
}