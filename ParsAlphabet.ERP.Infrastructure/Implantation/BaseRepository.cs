using System.Collections;
using System.ComponentModel;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace ParsAlphabet.ERP.Infrastructure.Implantation;

public abstract class BaseRepository<TEntity, TKey, TSchema>(IConfiguration config)
    : IBaseRepository<TEntity, TKey, TSchema>
{
    public IDbConnection Connection => new SqlConnection(config.GetConnectionString("DefaultConnection"));

    public virtual async Task<TResult> GetRecordById<TResult>(int id, bool isSecondLang, TSchema schema)
    {
        var modelName = GetModelName();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<TResult>(sQuery,
                new { IsSecondLang = isSecondLang, TableName = $"{schema}.{modelName}", Filter = $"Id={id}" },
                commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public virtual async Task<MyResultQuery> Insert(TEntity model, TSchema schema, bool isTable = false,
        string tableName = "")
    {
        var modelName = GetModelName();
        var modelTable = isTable ? "Tables" : modelName;

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            conn.Open();
            await conn.QueryAsync<TEntity>($"{schema}.Spc_{modelTable}_InsUpd", model,
                commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;
        return result;
    }

    public virtual async Task<MyResultQuery> Update(TEntity model, TSchema schema, bool isTable = false,
        string tableName = "")
    {
        var modelName = GetModelName();
        var modelTable = isTable ? "Tables" : modelName;

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            conn.Open();
            await conn.QueryAsync<TEntity>($"{schema}.Spc_{modelTable}_InsUpd", model,
                commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;
        return result;
    }

    public virtual async Task<MyResultQuery> Delete(int id, TSchema schema, int companyId)
    {
        var modelName = GetModelName();
        var result = new MyResultQuery();
        result.ValidationErrors = new List<string>();
        var validationDelete = await DeleteValidation(id, schema, modelName, companyId);
        if (validationDelete.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validationDelete;
        }
        else
        {
            using (var conn = Connection)
            {
                var sQuery = "pb.Spc_Tables_DelRecord";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery,
                    new { TableName = $"{schema}.{modelName}", RecordId = id, CompanyId = companyId },
                    commandType: CommandType.StoredProcedure);
                conn.Close();
            }

            result.Successfull = result.Status > 0;
        }

        return result;
    }

    public virtual async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(TSchema schema, string filter = "",
        bool isSecondLang = false, string idColumnName = "", string titleColumnName = "", string idList = "")
    {
        var modelName = GetModelName();

        using (var conn = Connection)
        {
            var result = new List<MyDropDownViewModel>();
            conn.Open();
            result = (await conn.QueryAsync<MyDropDownViewModel>("pb.Spc_Tables_GetList",
                new
                {
                    isSecondLang, TableName = $"{schema}.{modelName}", IdColumnName = idColumnName,
                    TitleColumnName = titleColumnName, IdList = idList, Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public void Dispose()
    {
        throw new NotImplementedException();
    }

    public GetColumnsViewModel GetColumns()
    {
        throw new NotImplementedException();
    }

 

    public CSVViewModel<IEnumerable> Csv<TResult>(GetPageViewModel model)
    {
        throw new NotImplementedException();
    }

    public async Task<List<string>> DeleteValidation(int id, TSchema schema, string modelName, int companyId)
    {
        var result = new List<string>();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_Tables_Check_Delete_Relation";
            conn.Open();
            result = (await conn.QueryAsync<string>(sQuery,
                new { TableName = $"{schema}.{modelName}", Value = id, CompanyId = companyId },
                commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public virtual async Task<MyResultQuery> Delete(string filter, TSchema schema, int id = 0, int companyId = 0)
    {
        var modelName = GetModelName();
        var result = new MyResultQuery();
        var validationDelete = await DeleteValidation(id, schema, modelName, companyId);
        if (validationDelete.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validationDelete;
        }
        else
        {
            using (var conn = Connection)
            {
                var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery,
                    new { TableName = $"{schema}.{modelName}", Filter = filter },
                    commandType: CommandType.StoredProcedure);
                result.ValidationErrors = new List<string>();
                conn.Close();
            }


            result.Successfull = result.Status == 100;
        }

        return result;
    }

    private string GetModelName()
    {
        var customAttributes = typeof(TEntity).GetCustomAttributes(false);

        foreach (var item in customAttributes)
            if (item is DisplayNameAttribute && item.GetType().Name == "DisplayNameAttribute")
                return (item as DisplayNameAttribute).DisplayName;

        return null;
    }
}