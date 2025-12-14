using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class AccountSgluser
{
    public int Id { get; set; }

    public int AccountGlid { get; set; }

    public int AccountSglid { get; set; }

    public int UserId { get; set; }

    public int? CompanyId { get; set; }

    public int? CreateUserId { get; set; }

    public DateTime? CreateDateTime { get; set; }
}
