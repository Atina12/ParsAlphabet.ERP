using StackExchange.Redis;

namespace ParseAlphabet.ERP.Web.Redis;

using StackExchange.Redis;

public class ConnectionHelper
{
    private readonly Lazy<ConnectionMultiplexer> _lazy;

    public ConnectionHelper(string redisUrl)
    {
        if (string.IsNullOrWhiteSpace(redisUrl))
            throw new ArgumentException("Redis url is empty. Check configuration: Redis:url");

        _lazy = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect(redisUrl));
    }

    public ConnectionMultiplexer Connection => _lazy.Value;
}
