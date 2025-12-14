using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.Attender;

public interface IAttenderService
{
    Task<HttpResult<ResultQuery>> SendAttender(CentralAttender model, string token);
}