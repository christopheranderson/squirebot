Write-Host "Starting Functions runtime"
Push-Location ./src/tasks-functions

$test = Test-Path ./node_modules

if($test -ne $true) {
    Write-Host "Installing node modules (might take a while...)"
    npm i
}
$location = Get-Location
Start-Process -FilePath "powershell" -WorkingDirectory $location -UseNewEnvironment -ArgumentList @("npm","start")

Pop-Location

Push-Location ./src/webapp

$test = Test-Path ./node_modules
if($test -ne $true) {
    Write-Host "Installing node modules (might take a while...)"
    npm i
}

$location = Get-Location
Start-Process -FilePath "powershell" -WorkingDirectory $location -UseNewEnvironment -ArgumentList @("npm","start")

while($true) {
    Write-Host "Waiting until the web app is up..."
    try {
        $request = Invoke-WebRequest http://localhost:4200
        if($request.StatusCode -eq 200) {
            break;
        } else {
            Start-Sleep -s 1
        }
    }
    catch {
        Start-Sleep -s 1
    }
}

start chrome http://localhost:4200

Pop-Location
