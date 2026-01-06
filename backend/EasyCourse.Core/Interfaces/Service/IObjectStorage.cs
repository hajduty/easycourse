using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EasyCourse.Core.Interfaces.Service;

public interface IObjectStorage
{
    Task UploadAsync(string key, Stream data, string contentType);
    Task DeleteAsync(string key);
    Task<Stream> GetAsync(string key);
    string GetPublicUrl(string key);
}
