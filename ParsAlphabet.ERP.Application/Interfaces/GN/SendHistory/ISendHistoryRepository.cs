using ParsAlphabet.ERP.Application.Dtos.GN.SendHistory;

namespace ParsAlphabet.ERP.Application.Interfaces.GN.SendHistory;

public interface ISendHistoryRepository
{
    Task<MyResultStatus> Update(Guid id, long centralId, int userId);
    Task<MyResultStatus> UpdateBulk(List<SendHistoryViewModel> model, byte objectTypeId, int userId);
}