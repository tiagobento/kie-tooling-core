```
Options:
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  --env            Environment variable name                            [string]
  --bool           Boolean value to be used as condition                [string]
  --eq, --equals   Value to be compared with the environment variable.
                                                      [string] [default: "true"]
  --then           Command(s) to execute if environment variable has the desired
                   value                                      [array] [required]
  --else           Command(s) to execute if environment variable doesn't have
                   the desired value                       [array] [default: []]
  --true-if-empty  If the environment variable is not set, the command(s)
                   supplied to --then will run.       [boolean] [default: false]
  --silent         Hide logs from output.             [boolean] [default: false]
  --force          Runs command(s) supplied to --then regardless of the
                   environment variable value.        [boolean] [default: false]
  --catch          Command(s) to execute at the end of execution if one of the
                   commands being executed fails.          [array] [default: []]
  --finally        Command(s) to execute at the end of execution. Provided
                   commands will run even if one of the commands being executed
                   fails.                                  [array] [default: []]


CLI tool to help executing shell scripts conditionally with a friendly syntax on
Linux, macOS, and Windows.


__NOTE__:
Because 'run-script-if' was created with Yarn/NPM scripts, environment variables
and sub-expression syntax (`$(expr)`) in mind, 'run-script-if' will force the
provided commands to be executed on PowerShell.

This is because Yarn and NPM default to the CMD shell on Windows, making it not
ideal for sub-expression-dependent commands.

Apart from using it on commands, it's also possible to use the sub-expression
syntax on boolean conditions, like:

$ run-script-if --bool "$(my-custom-command --isEnabled)" --then "echo 'Hello'"
```
