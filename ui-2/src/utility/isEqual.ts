export const isEqualArray = <T>(var1: T[], var2: T[]): boolean => {
  if (var1.length !== var2.length) return false;

  let var1_ptr = 0;
  let var2_ptr = 0;

  while (var1_ptr !== var1.length && var2_ptr !== var2.length) {
    if (var1[var1_ptr] !== var2[var2_ptr]) return false;
    var1_ptr++;
    var2_ptr++;
  }
  return true;
};
