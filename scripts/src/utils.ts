import fs from "fs";
import path from "path";
import { homedir } from "os";

/**
 * Resolve tilde based file paths for the current user's home directory
 */
export function resolveTilde(filePath: string) {
  if (filePath.startsWith("~")) {
    return path.join(homedir(), filePath.slice(1));
  }
  return filePath;
}

/**
 * Load a plaintext file from the local filesystem
 */
export function loadPlaintextFile(filePath: string): string {
  try {
    const data = fs.readFileSync(resolveTilde(filePath), "utf-8");
    return data;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error(`File not found: ${filePath}`);
    } else {
      throw new Error(`Error reading file: ${err.message}`);
    }
  }
}

/**
 *
 */
export function loadJsonFile<T = object>(filePath: string): T {
  try {
    const parsedData = parseJson<T>(loadPlaintextFile(filePath));
    if (!parsedData) throw new Error("Unable to parse JSON");
    return parsedData;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`Error: The file at ${filePath} is not valid JSON.`);
    }
    throw err;
  }
}

/**
 *
 */
export function parseJson<T = object>(input: string): T | null {
  try {
    const parsedData: T = JSON.parse(input);
    return parsedData;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Error parsing JSON:", error.message);
    }
    return null;
  }
}

/**
 * Ensure the output directories exist
 */
export function ensureDirectoryExists(dirPath: string) {
  const dirname = path.dirname(dirPath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

/**
 * Check if a file exists in the local file system
 */
export function ensureFileExist(filePath: string, resolve: boolean = true) {
  try {
    filePath = resolveTilde(filePath);
    if (resolve) filePath = path.resolve(filePath);
    fs.statfsSync(filePath);
  } catch (err) {
    throw new Error(`File does not exist: ${filePath}`);
  }
}
