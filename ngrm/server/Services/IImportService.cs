using NGRM.Domain.Model;

namespace NGRM.Domain.Interfaces.Services
{
    public interface IImportService
    {
        ImportResult Import(Import import);
    }
}