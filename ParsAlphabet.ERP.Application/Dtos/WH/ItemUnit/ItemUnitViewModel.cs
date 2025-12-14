using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemUnit;

public class ItemUnitGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}

public class ItemUnitGetRecord
{
    public string UnitName { get; set; }
    public bool IsActive { get; set; }
    public string ItemSubUnit { get; set; }

    public List<ItemSubUnitGetRecord> ItemSubUnitList => !string.IsNullOrEmpty(ItemSubUnit)
        ? JsonConvert.DeserializeObject<List<ItemSubUnitGetRecord>>(ItemSubUnit)
        : null;
}

public class ItemSubUnitModel
{
    public int HeaderId { get; set; }
    public int UnitId { get; set; }
    public string Ratio { get; set; }
    public bool IsActive { get; set; }
}

public class ItemSubUnitGetRecord
{
    public int UnitId { get; set; }
    public string Name { get; set; }
    public decimal Ratio { get; set; }
    public bool IsActive { get; set; }
    public string ItemSubUnitName => IdAndTitle(UnitId, Name);
    public bool Checked { get; set; }
}

public class ItemUnitGetExcellPage
{
    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public string UnitNameId => IdAndTitle(UnitId, UnitName);
    public bool UnitIsActive { get; set; }
    public int SubUnitId { get; set; }
    public string SubUnitName { get; set; }
    public string SubUnitNameId => IdAndTitle(SubUnitId, SubUnitName);
    public decimal SubUnitRatio { get; set; }
    public bool SubUnitIsActive { get; set; }
}

public class UnitItemInfo
{
    public short SubUnitId { get; set; }
    public short UnitId { get; set; }
    public string UnitName { get; set; }
    public decimal SubUnitRatio { get; set; }
}

public class ItemUnitDetailInfo
{
    public decimal Ratio { get; set; }
    public short IdSubUnit { get; set; }
}