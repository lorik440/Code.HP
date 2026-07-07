Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
WshShell.CurrentDirectory = FSO.GetParentFolderName(WScript.ScriptFullName)
exePath = FSO.BuildPath(WshShell.CurrentDirectory, "../dist/win-unpacked/Code.HP.exe")
WshShell.Run """" & exePath & """", 0, False