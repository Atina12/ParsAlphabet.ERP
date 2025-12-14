using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using IDatabase = StackExchange.Redis.IDatabase;

namespace ParseAlphabet.ERP.Web.Redis;

public class RedisService(ConnectionHelper connectionHelper) : IRedisService
{
    private readonly IDatabase _db = connectionHelper.Connection.GetDatabase();

    
    public T? GetData<T>(string key)
    {
        var value = _db.StringGet(key);
        if (!value.HasValue) return default;

        return JsonConvert.DeserializeObject<T>(value!);
    }

    public bool SetData<T>(string key, T value, DateTimeOffset expirationTime)
    {
        var ttl = expirationTime.UtcDateTime - DateTime.UtcNow;
        if (ttl <= TimeSpan.Zero) ttl = TimeSpan.FromSeconds(1);

        return _db.StringSet(key, JsonConvert.SerializeObject(value), ttl);
    }

    public object RemoveData(string key)
        => _db.KeyDelete(key);
}