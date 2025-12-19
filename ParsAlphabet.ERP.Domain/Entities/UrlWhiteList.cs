using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Entities;

public partial class UrlWhiteList
{
    public byte Id { get; set; }

    public string Name { get; set; }

    public string Protocol { get; set; }

    public string BaseUrl { get; set; }

    public short? Port { get; set; }

    public string FullAddress { get; set; }
}
