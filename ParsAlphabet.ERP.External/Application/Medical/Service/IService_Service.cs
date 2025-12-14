using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Requests;

namespace ERPCentral.Interface.App.Application.Medical.Service;

public interface IService_Service
{
    Task<HttpResult<ResultQuery>> SendService(CentralService model, string token);
}