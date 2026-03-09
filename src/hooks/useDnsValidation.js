import { isIPv4, isHostname, isRecordName } from "./validators";

export const useDnsValidation = () => {
  const validateRecordName = (name, domain) => {
    if (!name) return "Record Name required";
    if (!isRecordName(name)) return "Invalid record name";
    if (domain && name.endsWith(domain)) return "Enter only hostname";
    return "";
  };

  const validateValue = (type, value, recordName, fqdn) => {
    if (!value) return "Required";

    if (type === "A" && !isIPv4(value)) return "Invalid IPv4";
    if (type === "CNAME") {
      if (!isHostname(value)) return "Invalid hostname";
      if (value === fqdn) return "Alias cannot equal record name";
    }
    if (type === "MX" && !isHostname(value)) return "Invalid mail exchanger";
    return "";
  };

  return { validateRecordName, validateValue };
};
