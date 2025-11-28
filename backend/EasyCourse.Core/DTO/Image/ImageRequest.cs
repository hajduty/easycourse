using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace EasyCourse.Core.DTO.Image;
public class ImageRequest
{
    [Required]
    public IFormFile File { get; set; }
}
