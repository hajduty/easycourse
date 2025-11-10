using EasyCourse.Core.DTO;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace EasyCourse.API.Filters;

public class CommonResponseOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        // Generate schema for ApiResponse<object> (for errors)
        var errorSchema = context.SchemaGenerator.GenerateSchema(typeof(ApiResponse<object>), context.SchemaRepository);

        operation.Responses.Remove("400");
        operation.Responses.Remove("401");
        operation.Responses.Remove("404");
        operation.Responses.Remove("500");

        operation.Responses.Add("400", new OpenApiResponse
        {
            Description = "Bad Request - Validation failed or invalid input",
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["application/json"] = new OpenApiMediaType
                {
                    Schema = errorSchema
                }
            }
        });

        operation.Responses.Add("401", new OpenApiResponse
        {
            Description = "Unauthorized - Authentication required or failed",
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["application/json"] = new OpenApiMediaType
                {
                    Schema = errorSchema
                }
            }
        });

        operation.Responses.Add("404", new OpenApiResponse
        {
            Description = "Not Found - Resource doesn't exist",
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["application/json"] = new OpenApiMediaType
                {
                    Schema = errorSchema
                }
            }
        });

        operation.Responses.Add("500", new OpenApiResponse
        {
            Description = "Internal Server Error",
            Content = new Dictionary<string, OpenApiMediaType>
            {
                ["application/json"] = new OpenApiMediaType
                {
                    Schema = errorSchema
                }
            }
        });
    }
}