namespace ParsAlphabet.ERP.Application.Interfaces;

public interface IBaseRepository<in TEntity, TKey, in TSchema>
{
    Task<TResult> GetRecordById<TResult>(int id, bool isSecondLang, TSchema schema);
    Task<MyResultQuery> Insert(TEntity model, TSchema schema, bool isTable, string tableName = "");
    Task<MyResultQuery> Update(TEntity model, TSchema schema, bool isTable, string tableName = "");
    Task<MyResultQuery> Delete(int id, TSchema schema, int companyId);

    Task<IEnumerable<MyDropDownViewModel>> GetDropDown(TSchema schema, string filter = "", bool isSecondLang = false,
        string idColumnName = "", string titleColumnName = "", string idList = "");
}