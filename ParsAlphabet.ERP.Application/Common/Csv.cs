using System.Collections;
using System.Globalization;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;

namespace ParsAlphabet.ERP.Application.Common;

public class Csv
{
    public async Task<MemoryStream> GenerateCsv(IEnumerable model, List<string> columnNames)
    {
        byte[] result;

        var config = new CsvConfiguration(CultureInfo.InvariantCulture);

        config.HasHeaderRecord = false;
        // config.LeaveOpen = false;

        using (var memoryStream = new MemoryStream())
        {
            using (var streamWriter = new StreamWriter(memoryStream, Encoding.GetEncoding("utf-8")))
            {
                using (var csvWriter = new CsvWriter(streamWriter, config))
                {
                    foreach (var column in columnNames) csvWriter.WriteField(column);

                    await csvWriter.NextRecordAsync();

                    await csvWriter.WriteRecordsAsync(model);
                    await streamWriter.FlushAsync();

                    result = memoryStream.ToArray();
                }
            }
        }

        var csvFile = new MemoryStream(result);
        return csvFile;
    }
}