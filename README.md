# dotnet-build-test-all

Small Visual Studio Code extension to build all projects in the current folder or workspace.

## Features

- Build every .csproj that is found within the current working directory.
- Run tests for every test project found within the current working directory.

## Usage

From anywhere in your current VS Code window, open the command palette and find ".NET: Build All", ".NET: Restore All" or ".NET: Test All".

## Known Issues

- Log output contains no colours and has bad formatting.
- If a test project doesn't have 'Test' in the .csproj file name, it won't be tested by the extension.

## Release Notes

### 0.0.2

- Addition of 'Restore' command
- Addition of 'Test' command
- Addition of 'Build and Test All' command
- Show total number of projects used by command after completion

### 0.0.1

- Initial release
