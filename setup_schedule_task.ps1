# SatViewer3D Bot - Windows タスクスケジューラ自動登録スクリプト
# 4時間おき（毎日 08:00, 12:00, 16:00, 20:00 等）に自動実行します

$TaskName = "SatViewer3D_X_Bot"
$BatPath = "C:\Users\vanil\Documents\satellite-orbit-simulator\run_bot.bat"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🛰️ SatViewer3D Bot - タスクスケジューラ設定" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 既存タスクがあれば削除
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

# アクション定義（run_bot.bat のサイレント実行）
$Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$BatPath`""

# トリガー定義（毎日8:00から開始、4時間ごとに繰り返し、1日間継続）
$Trigger = New-ScheduledTaskTrigger -Daily -At "08:00"
$Trigger.Repetition = (New-ScheduledTaskTrigger -Once -At "08:00" -RepetitionInterval (New-TimeSpan -Hours 4) -RepetitionDuration (New-TimeSpan -Days 3650)).Repetition

# 設定定義
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew

# タスク登録
Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "SatViewer3D Automated Satellite Tracker Bot for X"

Write-Host "`n✅ タスクスケジューラに登録が完了しました！" -ForegroundColor Green
Write-Host "タスク名: $TaskName" -ForegroundColor Yellow
Write-Host "スケジュール: 毎日 08:00 から 4時間おきに自動実行" -ForegroundColor Yellow
Write-Host "実行ログ: C:\Users\vanil\Documents\satellite-orbit-simulator\bot_run.log" -ForegroundColor Yellow
Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
