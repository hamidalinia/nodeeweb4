@echo off

REM Remove all files from the target directory without prompting
rmdir /S /Q ..\server\admin

REM Copy the build folder to the server admin folder without prompting
xcopy /E /I /H /Y build ..\server\admin

REM Remove all files from the packages\server\theme directory without prompting
rmdir /S /Q ..\server\packages\server\admin

REM Copy the build folder to the packages\server\theme folder without prompting
xcopy /E /I /H /Y build ..\server\packages\server\admin
