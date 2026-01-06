# PowerShell: comprobar instalación
Get-Command k6
k6 version

# Si no está, prueba winget (si está disponible)
winget install --id=Grafana.k6 -e# PowerShell: comprobar instalación
Get-Command k6
k6 version

# Si no está, prueba winget (si está disponible)
winget install --id=Grafana.k6 -e# PowerShell: comprobar instalación
Get-Command k6
k6 version

# Si no está, prueba winget (si está disponible)
winget install --id=Grafana.k6 -e# PowerShell: comprobar instalación
Get-Command k6
k6 version

# Si no está, prueba winget (si está disponible)
winget install --id=Grafana.k6 -e# PowerShell: comprobar instalación
Get-Command k6
k6 version

# Si no está, prueba winget (si está disponible)
winget install --id=Grafana.k6 -e# PowerShell: comprobar instalación
Get-Command k6
k6 version

# Si no está, prueba winget (si está disponible)
winget install --id=Grafana.k6 -e# PowerShell: comprobar instalación
Get-Command k6
k6 version

# Si no está, prueba winget (si está disponible)
winget install --id=Grafana.k6 -e# PowerShell: comprobar instalación
Get-Command k6
k6 version

# Si no está, prueba winget (si está disponible)
winget install --id=Grafana.k6 -e# PowerShell: comprobar instalación
Get-Command k6
k6 version

# Si no está, prueba winget (si está disponible)
winget install --id=Grafana.k6 -e# PowerShell script para ejecutar la prueba k6 con parámetros opcionales.
param(
    [int]$Rate = 20,
    [string]$Duration = '1m',
    [string]$TimeUnit = '1s'
)

$scriptPath = 'src/test/resources/k6/login.js'

if (-not (Get-Command k6 -ErrorAction SilentlyContinue)) {
    Write-Error "k6 no está instalado o no está en PATH. Ver https://k6.io/docs/getting-started/installation"
    exit 1
}

Write-Output "Ejecutando k6: RATE=$Rate, DURATION=$Duration, TIME_UNIT=$TimeUnit"
$env:RATE = $Rate
$env:DURATION = $Duration
$env:TIME_UNIT = $TimeUnit
k6 run $scriptPath

