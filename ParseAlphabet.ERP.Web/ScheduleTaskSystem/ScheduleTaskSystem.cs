namespace ParseAlphabet.ERP.Web.ScheduleTaskSystem;

public abstract class ScheduleTaskSystem : IHostedService
{
    private readonly CancellationTokenSource _stoppingCts = new();
    private Task _executingTask;

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _executingTask = ExecuteAsync(_stoppingCts.Token);

        if (_executingTask.IsCompleted) return _executingTask;

        return Task.CompletedTask;
    }

    public virtual async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_executingTask == null) return;

        try
        {
            await _stoppingCts.CancelAsync();
        }
        finally
        {
            await Task.WhenAny(_executingTask, Task.Delay(Timeout.Infinite, cancellationToken));
        }
    }

    protected virtual async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        do
        {
            await Process();
            await Task.Delay(5000, stoppingToken);
        } while (!stoppingToken.IsCancellationRequested);
    }

    protected abstract Task Process();
}