# Stage 1: Build (still uses SDK)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY easycourse.slnx ./
COPY EasyCourse.API/*.csproj ./EasyCourse.API/
COPY EasyCourse.Core/*.csproj ./EasyCourse.Core/
COPY EasyCourse.Infrastructure/*.csproj ./EasyCourse.Infrastructure/

RUN dotnet restore easycourse.slnx
COPY . .
RUN dotnet publish EasyCourse.API/EasyCourse.API.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime (Alpine)
FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["dotnet", "EasyCourse.API.dll"]
