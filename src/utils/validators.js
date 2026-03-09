export const isIPv4 = (ip) =>
  /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(\1)\.(\1)\.(\1)$/.test(ip);

export const isHostname = (v) =>
  /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);

export const isRecordName = (v) =>
  /^[a-zA-Z0-9-]+$/.test(v);
