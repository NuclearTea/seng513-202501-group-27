const appNameFromURL = (url: string | null) => {
  if (!url) return null;
  const splitPeriod = url.split(".");
  if (splitPeriod.length !== 3) {
    return null;
  }
  const firstPart = splitPeriod[0].replaceAll("/", "");
  const splitColon = firstPart.split(":");
  if (splitColon.length !== 2) {
    return null;
  }
  const name = splitColon[1];
  return name;
};

export default appNameFromURL;
