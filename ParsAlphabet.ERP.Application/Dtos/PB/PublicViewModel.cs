using Microsoft.AspNetCore.Http;

namespace ParsAlphabet.ERP.Application.Dtos.PB;

public class File
{
    public IFormFile FileVlue { get; set; }
    public int Width { get; set; }
    public int Height { get; set; }
    public string AliasName { get; set; }
}