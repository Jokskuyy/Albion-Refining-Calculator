@echo off
REM Albion Refining Calculator - Windows Batch Script
REM This is a wrapper for the PowerShell script

SET COMMAND=%1

if "%COMMAND%"=="" (
    powershell -ExecutionPolicy Bypass -File "%~dp0start-system.ps1" help
) else (
    powershell -ExecutionPolicy Bypass -File "%~dp0start-system.ps1" %COMMAND%
)
