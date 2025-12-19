using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class ErrorLog
{
    public int Id { get; set; }

    public DateTime ErrDateTime { get; set; }

    public string ErrMessage { get; set; }

    public int UserId { get; set; }

    public string Path { get; set; }

    public string Ipaddress { get; set; }

    public string ComputerName { get; set; }
}
