namespace ParsAlphabet.ERP.Application.Dtos;

public class GetPageViewModel : Pagination
{
    public string FieldItem { get; set; }
    public string FieldValue { get; set; }
    public object[] Form_KeyValue { get; set; }
    public List<FormKeyValue> Filters { get; set; } = new();
    public SortModel SortModel { get; set; } = new();
}

public class NewGetPageViewModel : PaginationReport
{
    public string FieldItem { get; set; }
    public string FieldValue { get; set; }
    public object[] Form_KeyValue { get; set; } = [];
    public List<FormKeyValue> Filters { get; set; } = new();
    public SortModel SortModel { get; set; } = new();
}

public class Pagination : CompanyViewModel
{
    public int PageNo { get; set; }
    public int PageRowsCount { get; set; }
}

public class PaginationReport : CompanyViewModel
{
    public int? PageNo { get; set; }
    public int? PageRowsCount { get; set; }
}

public class SortModel
{
    public string ColId { get; set; }
    public string Sort { get; set; }
}

public class DO_TIME
{
    public string ISOString { get; set; }

    public int? Hour { get; set; }

    public int? Minute { get; set; }

    public int? Second { get; set; }
}

public class DO_DATE
{
    public int? Year { get; set; }

    public int? Month { get; set; }

    public int? Day { get; set; }

    public string ISOString { get; set; }
}

public class ID
{
    public long Id { get; set; }
}

public class FormKeyValue
{
    public string Name { get; set; }
    public string Value { get; set; } = "";
}

public class FormPlate1
{
    public class DataColumnsViewModel
    {
        public string Id { get; set; }
        public string InputId { get; set; }
        public string Title { get; set; }
        public int Type { get; set; } // sql data type
        public int Size { get; set; } = 0;
        public int Width { get; set; } = 0;
        public bool IsDetailItem { get; set; } = false;
        public string Align { get; set; } = "right";

        public string ClassName { get; set; } = "";
        public bool IsPersian { get; set; } = false;
        public bool IsPrimary { get; set; } = false;
        public bool IsCommaSep { get; set; } = false;
        public bool IsDtParameter { get; set; } = false;
        public bool IsFilterParameter { get; set; } = false;
        public string FilterType { get; set; } = "text";
        public bool FilterSelect2IdAndTitle { get; set; } = true;
        public int FilterMinimumLength { get; set; } = -1;
        public List<MyDropDownViewModel2> FilterItems { get; set; } = null;
        public string FilterTypeApi { get; set; } = "";
        public bool Editable { get; set; } = false;
        public bool HasLink { get; set; } = false;
        public bool HeaderReadOnly { get; set; } = false;
        public bool NotResetInHeader { get; set; } = false;
        public bool IsReadOnly { get; set; } = false;
        public bool DefaultReadOnly { get; set; } = false;
        public bool IsDisplayItem { get; set; } = false;
        public bool IsDisplayNone { get; set; } = false;
        public short MaxLength { get; set; }
        public string InputType { get; set; } = "";
        public string SwitchValue { get; set; } = "";
        public short InputOrder { get; set; } = 0;
        public bool PleaseChoose { get; set; } = false;
        public bool IsNotFocusSelect { get; set; } = false;
        public List<string> FillColumnValueIds { get; set; }
        public GetDataColumnConfig GetColumnValueConfig { get; set; }
        public List<string> FillColumnInputSelectIds { get; set; }
        public GetDataColumnConfig GetInputSelectConfig { get; set; } = null;
        public SearchPlugin SearchPlugin { get; set; }
        public List<MyDropDownViewModel> Inputs { get; set; }
        public InputMask InputMask { get; set; } = null;
        public List<Validation> Validations { get; set; }
        public bool IsSelect2 { get; set; } = false;
        public string Select2Title { get; set; } = "";
        public bool IsFocus { get; set; } = false;
        public bool HasSumValue { get; set; } = false;
        public bool CalculateSum { get; set; } = true;
        public decimal SumValue { get; set; }
        public bool HasRounding { get; set; } = false;
        public byte DecimalRounding { get; set; } = 3;
        public string FillType { get; set; }
        public bool IsRangeValue { get; set; }
        public int MinValue { get; set; }
        public int MaxValue { get; set; }
        public string Condition { get; set; } = "";
        public string AnswerCondition { get; set; } = "";
        public bool HasDetail { get; set; } = false;
        public bool Order { get; set; } = false;
        public bool FixedColumn { get; set; } = false;
    }

    public class NavigateToPage
    {
        public string ColumnId { get; set; }
        public string Url { get; set; }
        public PageType PageType { get; set; }
        public Modal Modal { get; set; }
        public List<FormKeyValue> Parameters { get; set; }
    }

    public class Modal
    {
        public string HeaderTitle { get; set; }
        public string ModalSize { get; set; }
        public int WindowSize { get; set; }
        public List<GetActionColumnViewModel> ButtonModal { get; set; }
    }

    public class GetDataColumnConfig
    {
        public string FillUrl { get; set; }
        public List<GetDataColumnParameterModel> Parameters { get; set; }
    }

    public class GetDataColumnParameterModel
    {
        public string Id { get; set; }

        /// <summary>
        ///     آیا این این المنت در سطر جاری است یا هر جایی به جز سطر جاری ممکن است باشد؟
        /// </summary>
        public bool InlineType { get; set; } = true;
    }

    public class SearchPlugin
    {
        public string SearchUrl { get; set; }
        public List<string> ModelItems { get; set; } = new();
        public string SelectColumn { get; set; }
        public List<SearchPluginColumn> Column { get; set; } = new();
        public string ModalSize { get; set; }
    }

    public class SearchPluginColumn
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool IsFilterParameter { get; set; }
        public int Width { get; set; }
    }

    public class InputMask
    {
        public string Mask { get; set; } = "";
        public char RadixPoint { get; set; }
    }

    public class Validation
    {
        public string ValidationName { get; set; }
        public string Param1 { get; set; }
        public string Value1 { get; set; }
        public string Value2 { get; set; }
    }

    public class Input
    {
        public string Type { get; set; } = "";
        public string Title { get; set; } = "";
        public string Value { get; set; } = "";
    }

    public class GetColumnsViewModel
    {
        public string Title { get; set; }
        public string Classes { get; set; }
        public bool IsEditable { get; set; } = false;
        public bool IsSelectable { get; set; } = false;
        public string HeaderType { get; set; } = "inline";
        public bool SumDynamic { get; set; } = false;
        public string GetSumApi { get; set; } = "";
        public bool HasFilter { get; set; } = true;
        public string RunButtonIndex { get; set; } = "";
        public string ActionType { get; set; } = "dropdown";
        public bool HasRowNumber { get; set; } = false;
        public List<NavigateToPage> Navigations { get; set; }
        public List<DataColumnsViewModel> DataColumns { get; set; }
        public List<GetActionColumnViewModel> Buttons { get; set; }

        public bool FixedColumn { get; set; } = false;
        public bool Order { get; set; } = false;
        public string ConditionOn { get; set; } = "";
        public List<ConditionPageTable> Condition { get; set; }
        public string AnswerCondition { get; set; } = "";
        public string ElseAnswerCondition { get; set; } = "";
        public byte PostingGroupTypeLineId { get; set; }
        public string PostingGroupTypeLineName { get; set; }
    }

    public class GetStageStepConfigColumnsViewModel
    {
        public string Title { get; set; }
        public string Classes { get; set; }
        public bool IsEditable { get; set; } = false;
        public bool IsSelectable { get; set; } = false;
        public bool IsQuantity { get; set; } = false;
        public string HeaderType { get; set; } = "inline";
        public bool HasStageStepConfig { get; set; } = false;
        public string FormKey { get; set; }

        public StageStepConfigModel StageStepConfig { get; set; }
        //public bool ClientSideDisplayItems { get; set; } = false;

        public bool HasFilter { get; set; } = true;
        public string ActionType { get; set; } = "dropdown";
        public bool HasRowNumber { get; set; } = false;
        public List<DataStageStepConfigColumnsViewModel> DataColumns { get; set; }
        public List<GetActionColumnViewModel> Buttons { get; set; }
        public bool Order { get; set; } = false;
        public string ConditionOn { get; set; } = "";
        public List<ConditionPageTable> Condition { get; set; }
        public string AnswerCondition { get; set; } = "";
        public string ElseAnswerCondition { get; set; } = "";

        /// <summary>
        ///     شناسه نوع وجه یا نوع کالا... مربوطه
        /// </summary>
        public int IdentityId { get; set; }

        /// <summary>
        ///     مشخص میکند که این کانفیگ مربوطه به چه نوعی می باشد نوع وجه - نوع کالا .....
        /// </summary>
        public int IdentityType { get; set; }
    }

    public class ConditionPageTable
    {
        public string FieldName { get; set; }
        public string Operator { get; set; }
        public string FieldValue { get; set; }
    }

    public class GetActionColumnViewModel
    {
        public string Name { get; set; }
        public string Title { get; set; }
        public string ClassName { get; set; } = "";
        public string IconName { get; set; } = "";
        public bool IsSeparator { get; set; }
        public string ConditionOperand { get; set; } = "&&";
        public List<ConditionPageTable> Condition { get; set; } = null;
    }
}

public class DataStageStepConfigColumnsViewModel : DataColumnsViewModel
{
    public bool PublicColumn { get; set; }
    public string InputType1 { get; set; }
    public string InputType2 { get; set; }
    public int InputMethod { get; set; }
    public int TypeKey { get; set; }
    public bool IsStageStepLineField { get; set; } = false;
}

public class StageStepConfigJson
{
    public string Name { get; set; }
    public int InputMethodId { get; set; }
}

public class StageStepGetValueModel
{
    public string Title { get; set; }
    public string Value { get; set; }
}

public class StageStepConfigModel
{
    public List<StageStepHeaderColumn> HeaderFields { get; set; }
    public List<StageStepLineColumn> LineFields { get; set; }
}

public class StageStepHeaderColumn
{
    public string FieldId { get; set; }
    public string FieldValue { get; set; }
}

public class StageStepLineColumn
{
    public string FieldId { get; set; }
    public string FieldValue { get; set; }
    public string TableName { get; set; }
}

public class TakeRowsCountByPage
{
    public int UserId { get; set; }
    public string Href { get; set; }
    public short PageRowsCount { get; set; }
}

public class ExtraPropertyViewModel
{
    public byte ElementId { get; set; }
    public object ElementValue { get; set; }
}