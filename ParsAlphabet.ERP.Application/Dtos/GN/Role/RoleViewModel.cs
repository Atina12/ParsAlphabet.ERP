namespace ParsAlphabet.ERP.Application.Dtos.GN.Role;

public class RoleGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}

public class RoleGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}

public class GetAuthenViewModel
{
    public GetAuthenViewModel()
    {
        Children = new List<GetAuthenViewModel>();
    }

    public int Id { get; set; }
    public string Title { get; set; }
    public int SortOrder { get; set; }
    public int? ParentId { get; set; }
    public List<GetAuthenViewModel> Children { get; }
    public int Level { get; set; }
    public int ChildCount { get; set; }
    public string ControllerName { get; set; }
    public bool Auth_VIW { get; set; }
    public byte Auth_VIWALL { get; set; }
    public bool Auth_DIS { get; set; }
    public bool Auth_INS { get; set; }
    public bool Auth_UPD { get; set; }
    public bool Auth_DEL { get; set; }
    public bool Auth_PRN { get; set; }
    public bool Auth_FIL { get; set; }
}