using System.Linq.Expressions;

namespace ParsAlphabet.ERP.Application.Common;

public static class QueryableExtensions
{
    public static IQueryable<T> OrderBy<T>(this IQueryable<T> source, SortModel sortModels)
    {
        var expression = source.Expression;
        var count = 0;
        var parameter = Expression.Parameter(typeof(T), "x");
        var selector = Expression.PropertyOrField(parameter, sortModels.ColId);
        var method = string.Equals(sortModels.Sort, "desc", StringComparison.OrdinalIgnoreCase)
            ? count == 0 ? "OrderByDescending" : "ThenByDescending"
            : count == 0
                ? "OrderBy"
                : "ThenBy";
        expression = Expression.Call(typeof(Queryable), method,
            new[] { source.ElementType, selector.Type },
            expression, Expression.Quote(Expression.Lambda(selector, parameter)));
        count++;
        return count > 0 ? source.Provider.CreateQuery<T>(expression) : source;
    }
}