import { createWriteStream } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";

import JSZip from "jszip";

const extensionDist = resolve("apps/extension/dist");
const outputFile = resolve(`gnomon-extension-${new Date().toISOString().slice(0, 10)}.zip`);

async function addDirectory(zip: JSZip, directory: string): Promise<void> {
  const entries = await readdir(directory);

  for (const entry of entries) {
    const path = join(directory, entry);
    const stats = await stat(path);

    if (stats.isDirectory()) {
      await addDirectory(zip, path);
      continue;
    }

    const zipPath = relative(extensionDist, path).replaceAll("\\", "/");
    zip.file(zipPath, await readFile(path));
  }
}

const zip = new JSZip();
await addDirectory(zip, extensionDist);

await new Promise<void>((resolvePromise, reject) => {
  zip
    .generateNodeStream({ type: "nodebuffer", streamFiles: true })
    .pipe(createWriteStream(outputFile))
    .on("finish", resolvePromise)
    .on("error", reject);
});

console.log(`Created ${basename(outputFile)}`);
