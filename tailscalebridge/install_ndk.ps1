$ErrorActionPreference = "Stop"
$SdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$CmdlineToolsPath = "$SdkPath\cmdline-tools"
$ZipFile = "$env:TEMP\cmdline-tools.zip"

Write-Host "Downloading cmdline-tools..."
Invoke-WebRequest -Uri "https://dl.google.com/android/repository/commandlinetools-windows-11076708_latest.zip" -OutFile $ZipFile

if (-not (Test-Path $CmdlineToolsPath)) {
    New-Item -ItemType Directory -Force -Path $CmdlineToolsPath | Out-Null
}

Write-Host "Extracting cmdline-tools..."
Expand-Archive -Path $ZipFile -DestinationPath $CmdlineToolsPath -Force

# Rename extracted folder to 'latest' as required by Android SDK structure
$ExtractedFolder = "$CmdlineToolsPath\cmdline-tools"
$LatestFolder = "$CmdlineToolsPath\latest"
if (Test-Path $LatestFolder) {
    Remove-Item -Recurse -Force $LatestFolder
}
Rename-Item -Path $ExtractedFolder -NewName "latest"

Write-Host "Accepting licenses and installing NDK + CMake..."
$SdkManager = "$LatestFolder\bin\sdkmanager.bat"
# echo y to accept licenses
echo y | & $SdkManager --licenses
& $SdkManager "ndk;25.1.8937393" "cmake;3.22.1"

Write-Host "NDK Installation Complete."
