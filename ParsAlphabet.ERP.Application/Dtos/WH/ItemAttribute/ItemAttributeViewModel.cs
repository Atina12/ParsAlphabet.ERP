using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemAttribute;

public class ItemAttributeGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}

public class ItemAttributeGetRecorde
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}

public class ItemAttributeModel
{
    public int ItemAttributeId { get; set; }
    public int Name { get; set; }
    public int IsActive { get; set; }
}

public class ItemAttributeLineModel : CompanyViewModel
{
    public int Id { get; set; }
    public int ItemAttributeId { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}

public class ItemAttributeGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string ItemAttributeLine { get; set; }

    public List<ItemAttributeLineGetRecord> ItemAttributeLineList => !string.IsNullOrEmpty(ItemAttributeLine)
        ? JsonConvert.DeserializeObject<List<ItemAttributeLineGetRecord>>(ItemAttributeLine)
        : null;
}

public class ItemAttributeLineGetRecord
{
    public int Id { get; set; }
    public int ItemAttributeId { get; set; }
    public string Name { get; set; }

    public string NameId =>
        //if (ItemAttributeId == 6)
        //{
        //    var item = Convert.ToByte(Name);
        //    return Common.SexDisplayName((Sex)item);
        //}
        //else
        Name;

    public bool IsActive { get; set; }
}