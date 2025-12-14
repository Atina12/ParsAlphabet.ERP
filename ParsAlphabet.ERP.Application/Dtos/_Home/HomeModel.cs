namespace ParsAlphabet.ERP.Application.Dtos._Home;

public class Navigation
{
    public Navigation()
    {
        Children = new List<Navigation>();
    }

    public int Id { get; set; }
    public string Title { get; set; }
    public string IconName { get; set; }
    public int SortOrder { get; set; }
    public int? ParentId { get; set; }
    public List<Navigation> Children { get; }
    public int Level { get; set; }
    public bool Show { get; set; }
    public string LinkAddress { get; set; }
}