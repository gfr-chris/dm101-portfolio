@echo off
cd /d D:\Development\dm101-digital-portfolio\portfolio-bpm
FOR /f "tokens=*" %%g IN ('fnm env --use-on-cd --shell cmd') DO %%g
fnm use 26
npm run dev
pause