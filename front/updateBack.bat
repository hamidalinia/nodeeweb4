@echo off

REM Remove all files from the target directory
rmdir /S /Q ..\server\theme

REM Copy the build folder to the server theme folder
xcopy /E /I /H /Y build ..\server\theme

REM Remove all files from the packages\server\theme directory
rmdir /S /Q ..\server\packages\server\theme

REM Copy the build folder to the packages\server\theme folder
xcopy /E /I /H /Y build ..\server\packages\server\theme
