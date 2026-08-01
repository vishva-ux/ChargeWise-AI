FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["ChargeWise.Core/ChargeWise.Core.csproj", "ChargeWise.Core/"]
COPY ["ChargeWise.Infrastructure/ChargeWise.Infrastructure.csproj", "ChargeWise.Infrastructure/"]
COPY ["ChargeWise.API/ChargeWise.API.csproj", "ChargeWise.API/"]

RUN dotnet restore "ChargeWise.API/ChargeWise.API.csproj"

COPY . .
WORKDIR "/src/ChargeWise.API"
RUN dotnet build "ChargeWise.API.csproj" -c Release -o /app/build
RUN dotnet publish "ChargeWise.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "ChargeWise.API.dll"]
