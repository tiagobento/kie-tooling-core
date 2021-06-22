/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const execSync = require("child_process").execSync;

const LERNA_JSON = "./lerna.json";

// MAIN

const newVersion = process.argv[2];
if (!newVersion) {
  console.error("[update-version] Missing version argument.");
  return 1;
}

let execOpts = {};
const opts = process.argv[3];
if (opts === "--verbose") {
  execOpts = { stdio: "inherit" };
} else {
  execOpts = { stdio: "pipe" };
}

Promise.resolve()
  .then(() => updateNpmPackages(newVersion))
  .then(async (version) => {
    console.info(`[update-version] Formatting files...`);
    execSync(`yarn format`, execOpts);
    return version;
  })
  .then((version) => {
    console.info(`[update-version] Updated to '${version}'.`);
  })
  .catch((error) => {
    console.error(error);
    console.error("");
    console.error(`[update-version] Error updating versions. There might be undesired unstaged changes.`);
  });

//

async function updateNpmPackages(lernaVersionArg) {
  console.info("[update-version] Updating NPM packages...");

  execSync(`lerna version ${lernaVersionArg} --no-push --no-git-tag-version --exact --yes`, execOpts);
  return require(LERNA_JSON).version;
}
