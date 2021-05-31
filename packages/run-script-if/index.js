#!/usr/bin/env node

/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { spawn } = require("child_process");

async function main() {
  const argv = yargs(hideBin(process.argv))
    .strict()
    .options({
      env: {
        required: true,
        alias: "e",
        type: "string",
        description: "Environment variable name",
      },
      eq: {
        default: "true",
        alias: "equals",
        type: "string",
        description: "Value to be compared with the environment variable.",
      },
      then: {
        array: true,
        required: true,
        type: "string",
        description: "Command to execute if environment variable has the desired value",
      },
      else: {
        default: [],
        array: true,
        required: false,
        type: "string",
        description: "Command to execute if environment variable doesn't have the desired value",
      },
      "true-if-empty": {
        default: false,
        type: "boolean",
        description: "Runs the command if the environment variable is not set.",
      },
      silent: {
        default: false,
        type: "boolean",
        description: "Doesn't output any logs.",
      },
    }).argv;

  const envVariableName = argv.env;
  const envVariableValue = process.env[envVariableName];
  const shouldRunIfEmpty = argv["true-if-empty"];

  let commandsToRun;
  let commandsToSkip;
  if ((!envVariableValue || envVariableValue === "") && shouldRunIfEmpty) {
    commandsToRun = argv.then;
    commandsToSkip = argv.else;
  } else if (envVariableValue === argv.eq) {
    commandsToRun = argv.then;
    commandsToSkip = argv.else;
  } else {
    commandsToRun = argv.else;
    commandsToSkip = argv.then;
  }

  let envVariableValueToLog;
  if (envVariableValue === "") {
    envVariableValueToLog = `not set ("")`;
  } else if (envVariableValue === undefined) {
    envVariableValueToLog = "not set";
  } else {
    envVariableValueToLog = envVariableValue;
  }

  log(
    argv,
    console.info,
    `Environment variable '${envVariableName}' is ${envVariableValueToLog} and --true-if-empty is ${
      shouldRunIfEmpty ? "enabled" : "disabled"
    }.`
  );

  if (commandsToRun.length > 0) {
    log(argv, console.info, `Running ${commandsToRun.length} commands(s): ['${commandsToRun.join("', '")}']`);
  } else {
    log(argv, console.info, `Running 0 command(s)`);
  }

  if (commandsToSkip.length > 0) {
    log(argv, console.info, `Skipping ${commandsToSkip.length} commands(s): ['${commandsToSkip.join("', '")}']`);
  }

  let nCommandsFinished = 0;
  for (const commandString of commandsToRun) {
    await new Promise((res, rej) => {
      const commandBin = commandString.split(" ")[0];
      const commandArgs = commandString.split(" ").slice(1);

      log(argv, console.info, `Running '${commandString}'`);
      const command = spawn(commandBin, commandArgs, { stdio: "inherit" });

      command.on("error", (data) => {
        logCommandError(argv, commandsToRun, nCommandsFinished, commandString);
        rej({ code: 1, msg: data.toString() });
      });

      command.on("exit", (code) => {
        if (code !== 0) {
          logCommandError(argv, commandsToRun, nCommandsFinished, commandString);
          rej({ code });
          return;
        }

        nCommandsFinished += 1;
        log(argv, console.info, `Finished '${commandString}'`);
        res();
      });
    });
  }
}

function log(argv, logFunction, ...args) {
  if (argv.silent) {
    return;
  }

  logFunction(`[run-script-if] `, ...args);
}

function logCommandError(argv, commandsToRun, nCommandsFinished, cmd) {
  const n = commandsToRun.length - nCommandsFinished - 1;
  if (n > 0) {
    const skipped = commandsToRun.splice(nCommandsFinished + 1).join("', '");
    log(argv, console.error, `Error executing '${cmd}'. Stopping and skipping ${n} command(s): ['${skipped}']`);
  } else {
    log(argv, console.error, `Error executing '${cmd}'.`);
  }
}

main().catch((err) => {
  if (err.msg) {
    console.error(err.msg);
  }

  process.exit(err.code);
});
