using System;
using System.Collections.Generic;

namespace ParsAlphabet.ERP.Domain.Models.DatabaseEntities;

public partial class TerminologyMap
{
    public int SourceTerminologyId { get; set; }

    public int SourceId { get; set; }

    public string SourceCode { get; set; }

    public string SourceName { get; set; }

    public int DestinationTerminologyId { get; set; }

    public int DestinationId { get; set; }

    public string DestinationCode { get; set; }

    public string DestinationName { get; set; }

    public string RelationType { get; set; }
}
