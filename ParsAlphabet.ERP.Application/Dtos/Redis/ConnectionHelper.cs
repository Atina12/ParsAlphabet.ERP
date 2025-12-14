using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace ParsAlphabet.ERP.Application.Dtos.Redis;

public class ConnectionHelper
{
    private static Lazy<ConnectionMultiplexer> lazyConnection;

    public ConnectionHelper(IConfiguration configuration)
    {
        lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
            ConnectionMultiplexer.Connect(configuration?["Redis:url"] ?? string.Empty));
    }


    public static ConnectionMultiplexer Connection => lazyConnection.Value;
}