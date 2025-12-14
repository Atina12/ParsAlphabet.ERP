using System.ComponentModel;

namespace ParsAlphabet.ERP.Application.Dtos.GN.CentralToken;

[DisplayName("CentralToken")]
public class CentralTokenModel
{
    public short Id { get; set; }
    public string CentralId { get; set; }
    public string TokenId { get; set; }
    public DateTime? ExpirationDateTime { get; set; }
    public DateTime? CreateDateTime { get; set; }
}