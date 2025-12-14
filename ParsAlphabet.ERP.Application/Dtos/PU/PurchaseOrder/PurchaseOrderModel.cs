namespace ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;

public class PurchaseOrderModel : CompanyViewModel
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
    public byte? CurrencyId { get; set; }
    public int? OrderNo { get; set; }
    public byte? PersonGroupTypeId { get; set; }
    public int? EmployeeId { get; set; }
    public bool IsOrderQuantity { get; set; }

    public DateTime OrderDate { get; set; }

    public string OrderDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            OrderDate = str.Value;
        }
    }

    public byte? ReturnReasonId { get; set; }

    public long? TreasurySubjectId { get; set; }
    public string Note { get; set; }
    public int UserId { get; set; }
    public DateTime? CreateDateTime { get; set; } = DateTime.Now;
    public byte Status { get; set; }
    public byte ActionId { get; set; }
    public int? DocumentTypeId { get; set; }
    public int? AccountGLId { get; set; }
    public int? AccountSGLId { get; set; }
    public short? NoSeriesId { get; set; }
    public int? AccountDetailId { get; set; }
    public long? RequestId { get; set; }
    public byte InOut { get; set; }

    public int WorkflowId { get; set; }
    public int ParentWorkflowCategoryId { get; set; }
}