@echo off

if exist .launchpad/test (
    bash -c ".launchpad/test ""$@""" UNUSED %*
    if not "%ERRORLEVEL%" == "0" (
        exit /b 1
    )
) else if exist ./test (
    bash -c "./test ""$@""" UNUSED %*
    if not "%ERRORLEVEL%" == "0" (
        exit /b 1
    )
) else (
    echo ERROR: .launchpad/test.bat must be run from the project root directory
    exit /b 1
)

