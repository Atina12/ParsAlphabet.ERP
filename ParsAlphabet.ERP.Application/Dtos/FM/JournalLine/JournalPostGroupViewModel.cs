using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;

public class JournalLinePostingGroup : JournalLineModel
{
    /// <summary>
    ///     شناسه هدر برگه ای که ارتباط بین هدر درخواست مرجع با سطرهای برگه سند حسابداری
    /// </summary>
    public long IdentityId { get; set; }

    /// <summary>
    ///     مشخص میکند که سند سیستمی مربوط به کدام بخش می باشد
    /// </summary>
    public short StageId { get; set; }


    public DateTime DocumentDate { get; set; }


    /// <summary>
    ///     نوع سند اتوماتی که ایجاد می شود
    /// </summary>
    public IdentityTypePostingGroup IdentityType { get; set; }
}

public class DocumentPostGroup
{
    public JournalLinePostingGroup Doc { get; set; }
    public string LineJson => Doc.NotNull() ? JsonConvert.SerializeObject(Doc) : string.Empty;
}

public class AddDocumentPostingGroup : CompanyViewModel
{
    public List<DocumentPostGroup> Journals { get; set; }
    public int UserId { get; set; }
}

public class JournalPostGroupResultStatus : MyResultStatus
{
    public int IdentityId { get; set; }
    public short StageId { get; set; }
    public IdentityTypePostingGroup IdentityType { get; set; }
}