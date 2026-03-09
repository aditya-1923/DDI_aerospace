export const checkSysRecord = async (type, name, domain) => {
  const res = await fetch(`/check-record?type=${type}&name=${name}&domain=${domain}`);
  return res.json();
};

export const validateCI = async (ci) => {
  const res = await fetch(`/is_valid_configuration_name?ci_name=${ci}`);
  return res.json();
};

export const submitDns = async (type, payload) => {
  const routes = {
    A: "/change_record/create/a",
    CNAME: "/change_record/create/cname",
    PTR: "/change_record/create/ptr",
    MX: "/change_record/create/mx",
    TXT: "/change_record/create/txt"
  };

  return fetch(routes[type], {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
};
