$TaskName = "SatViewer3D_X_Bot"
$BatPath = "C:\Users\vanil\Documents\satellite-orbit-simulator\run_bot.bat"

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

$Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$BatPath`""
$Trigger = New-ScheduledTaskTrigger -Daily -At "08:00"
$Trigger.Repetition = (New-ScheduledTaskTrigger -Once -At "08:00" -RepetitionInterval (New-TimeSpan -Hours 4) -RepetitionDuration (New-TimeSpan -Days 3650)).Repetition
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "SatViewer3D Automated Satellite Tracker Bot for X"

Write-Host "Task Registered Successfully: $TaskName" -ForegroundColor Green
