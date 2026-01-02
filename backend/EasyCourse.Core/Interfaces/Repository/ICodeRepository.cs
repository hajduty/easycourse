using EasyCourse.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyCourse.Core.Interfaces.Repository;

public interface ICodeRepository
{
    Task<CodeProblem> CreateProblem(CodeProblem problem);
    Task<CodeProblem> GetProblemById(Guid id);
    Task<IEnumerable<CodeProblem>> GetAllProblems();
    Task<CodeProblem> UpdateProblem(CodeProblem problem);
    Task<bool> DeleteProblem(CodeProblem problem);
}