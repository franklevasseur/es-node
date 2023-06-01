import * as utils from "./utils";
import * as esbuild from "esbuild";

export default async (argv: string[]) => {
  if (argv.length < 1) {
    throw new Error("No entrypoint specified");
  }
  if (argv.length > 1) {
    throw new Error("Too many arguments");
  }

  const cwd = utils.path.cwd();

  let entrypoint = argv[0];
  entrypoint = utils.path.absoluteFrom(cwd, entrypoint);

  const { outputFiles } = await esbuild.build({
    entryPoints: [entrypoint],
    logOverride: { "equals-negative-zero": "silent" },
    platform: "node",
    target: "es2020",
    minify: true,
    bundle: true,
    sourcemap: false,
    absWorkingDir: cwd,
    logLevel: "silent",
    keepNames: true,
    write: false,
  });

  const artifact = outputFiles[0];
  if (!artifact) {
    throw new Error("No artifact produced");
  }

  utils.require.requireJsCode(artifact.text);
};
