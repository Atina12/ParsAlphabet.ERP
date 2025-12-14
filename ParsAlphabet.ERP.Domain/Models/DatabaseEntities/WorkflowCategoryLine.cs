using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class WorkflowCategoryLine
{
    public short Id { get; set; }

    public byte? WorkflowCategoryId { get; set; }

    /// <summary>
    /// جداول تعریف شده در این ستون باید ستون های StageId ، ActionId، WorkflowId و ParentWorkflowCategoryId را داشته باشد
    /// </summary>
    public string HeaderTableName { get; set; }

    public string LineTableName { get; set; }

    public string LineGroupBy { get; set; }

    public string LineDetailTableName { get; set; }

    public string LineDetailGroupBy { get; set; }

    public string LineToLineDetailJoin { get; set; }
}
