using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.AttenderService;

public interface IAttenderServiceService
{
    Task<HttpResult<ResultQuery>> SendAttenderService(CentralAttenderService model, string token);
}