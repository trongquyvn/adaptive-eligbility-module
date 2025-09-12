export function exportJsonToFile(data: unknown, filename = "data.json") {
  const jsonStr = JSON.stringify(data, null, 2); // pretty print
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export function objExpandKeys(obj: Record<any, any>) {
  const result = {};

  for (const key in obj) {
    const parts = key.split(".");
    let current: Record<any, any> = result;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = obj[key];
      } else {
        current[part] = current[part] || {};
        current = current[part];
      }
    });
  }

  return result;
}

export function bumpVersion(version: string): string {
  const match = version.match(/^([a-zA-Z]*)(\d+)(?:\.(\d+))?$/);
  if (!match) return version;

  const prefix = match[1] || "";
  const major: any = parseInt(match[2], 10);
  const minor: any = match[3] ? parseInt(match[3], 10) : 0;

  if (minor >= 9) {
    return `${prefix}${major + 1}.0`;
  } else if (match[3]) {
    return `${prefix}${major}.${minor + 1}`;
  } else {
    return `${prefix}${major}.1`;
  }
}
