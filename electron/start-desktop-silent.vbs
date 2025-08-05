Set WshShell = CreateObject("WScript.Shell")

' Get the current directory (where this VBS file is located)
currentDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' Change to the electron directory
WshShell.CurrentDirectory = currentDir

' Check if node_modules exists in electron folder
Set fso = CreateObject("Scripting.FileSystemObject")
If Not fso.FolderExists(currentDir & "\node_modules") Then
    ' Install Electron dependencies silently
    WshShell.Run "cmd /c npm install", 0, True
End If

' Check if main project dependencies exist
If Not fso.FolderExists(currentDir & "\..\node_modules") Then
    ' Install main project dependencies silently
    WshShell.Run "cmd /c cd .. && npm install", 0, True
End If

' Start the Electron app silently (0 = hidden window)
WshShell.Run "cmd /c npm run electron", 0, False 