const project = (() => {
  const fs = require("fs");
  const path = require("path");
  try {
    const {
      androidManifestPath,
      iosProjectPath,
      windowsProjectPath,
    } = require("react-native-test-app");
    const iosProject = iosProjectPath("ios");
    return {
      android: {
        sourceDir: "android",
        manifestPath: androidManifestPath(path.join(__dirname, "android")),
      },
      windows: fs.existsSync("windows/TestApp.sln") && {
        sourceDir: "windows",
        solutionFile: "TestApp.sln",
        project: windowsProjectPath(path.join(__dirname, "windows")),
      },
      ...(iosProject ? { ios: { project: iosProject } } : undefined),
    };
  } catch (_) {
    return undefined;
  }
})();

module.exports = {
  ...(project ? { project } : undefined),
};
