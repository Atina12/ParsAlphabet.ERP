namespace ParsAlphabet.ERP.Application.Dtos.FM.Journal;

public class JournalGetPage
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);


    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);


    public int DocumentNo { get; set; }
    public DateTime DocumentDate { get; set; }
    public string DocumentDatePersian { get; set; }

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");

    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public string DocumentType => IdAndTitle(DocumentTypeId, DocumentTypeName);
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, CreateUserFullName);
    public long SumAmountDebit { get; set; }
    public long SumAmountCredit { get; set; }
    public bool BySystem { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public bool LineCheckExist { get; set; }
}

public class JournalGetRecord
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public short WorkflowId { get; set; }
    public short StageId { get; set; }
    public short DocumentNo { get; set; }
    public byte DocumentTypeId { get; set; }
    public DateTime? DocumentDate { get; set; }
    public string DocumentDatePersian => DocumentDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public string HeaderDocumentDatePersian => DocumentDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public DateTime? CreateDateTime { get; set; } = DateTime.Now;
    public int CreateUserId { get; set; }
    public int ModifiedUserId { get; set; }
    public DateTime? ModifiedDateTime { get; set; }
    public byte Status { get; set; }
}

public class JournalActionLogicModel
{
    public int IsDataEntry { get; set; }
}

public class UpdateUserJournal
{
    public int JournalId { get; set; }
    public int UserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}

public class JournalDocumentMyDropDownViewModel
{
    public int Id { get; set; }

    public bool BySystem { get; set; }
    public string BySystemName => BySystem ? "سیستمی" : "دستی";
    public string Name => BySystemName;
}

public class JournalDocumentInfo
{
    public int Id { get; set; }
    public bool BySystem { get; set; }
    public string BySystemName => BySystem ? "سیستمی" : "دستی";
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public int DocumentId { get; set; }
    public string DocumentName { get; set; }
    public string DocumentIdName => IdAndTitle(DocumentId, DocumentName);
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string BranchIdName => IdAndTitle(BranchId, BranchName);
    public string DocumentDatePersian { get; set; }
    public int JournalLineCount { get; set; }
}

public class JournalDuplicate
{
    public short FromJournalId { get; set; }
    public short BranchId { get; set; }
    public byte DocumentTypeId { get; set; }
    public DateTime ToDocumentDateJournal { get; set; }

    public string ToDocumentDateJournalPersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            ToDocumentDateJournal = str.Value;
        }
    }

    public int UserId { get; set; }
    public int CompanyId { get; set; }
    public int JournalLineCount { get; set; }
}

public class WorkFlowInfo
{
    public short Id { get; set; }
    public string Name { get; set; }
}

public class StageInfo
{
    public short Id { get; set; }
    public string Name { get; set; }
}