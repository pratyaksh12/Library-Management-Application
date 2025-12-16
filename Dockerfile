# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY ["LibraryApplicationManagement/LibraryApplicationManagement.csproj", "LibraryApplicationManagement/"]
RUN dotnet restore "LibraryApplicationManagement/LibraryApplicationManagement.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/LibraryApplicationManagement"
RUN dotnet build "LibraryApplicationManagement.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "LibraryApplicationManagement.csproj" -c Release -o /app/publish /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "LibraryApplicationManagement.dll"]