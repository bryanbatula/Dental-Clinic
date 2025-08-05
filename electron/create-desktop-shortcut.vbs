Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the current directory (where this VBS file is located)
currentDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Get Desktop path
DesktopPath = WshShell.SpecialFolders("Desktop")

' Create shortcut object
Set oShellLink = WshShell.CreateShortcut(DesktopPath & "\Clinic Management System.lnk")

' Set shortcut properties
oShellLink.TargetPath = currentDir & "\Launch Clinic App.vbs"
oShellLink.WorkingDirectory = currentDir
oShellLink.Description = "Clinic Management System Desktop App"
oShellLink.IconLocation = currentDir & "\..\assets\icons\a.ico"

' Save the shortcut
oShellLink.Save

' Show success message
MsgBox "Desktop shortcut created successfully!" & vbCrLf & vbCrLf & "You can now launch the Clinic Management System from your desktop.", vbInformation, "Shortcut Created" 