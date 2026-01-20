@echo off
setlocal
cd /d "%~dp0"
python wasm_config.py %*
endlocal
