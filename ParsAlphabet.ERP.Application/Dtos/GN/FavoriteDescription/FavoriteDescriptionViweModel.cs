namespace ParsAlphabet.ERP.Application.Dtos.GN.FavoriteDescription;

public class FavoriteDescriptionGetPage
{
    public int Id { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => StageId == 0 ? "" : $"{StageId} - {StageName}";
}

public class FavoriteDescriptionGetRecord
{
    public int Id { get; set; }
    public string Description { get; set; }
    public int UserId { get; set; }
    public bool IsActive { get; set; }
    public short StageId { get; set; }
}