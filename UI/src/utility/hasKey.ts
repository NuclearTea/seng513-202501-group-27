export function hasKey(obj: Record<string, unknown>, key: string) {
  if (!obj || typeof obj !== "object") return false;
  if (key in obj) {
    return true;
  }
  for (const k in obj) {
    if (hasKey(obj[k] as Record<string, unknown>, key)) {
      return true;
    }
  }
}

export default hasKey;
