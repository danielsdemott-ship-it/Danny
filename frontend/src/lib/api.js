const stripTrailingSlash = (value) => value.replace(/\/+$/, "");

const configuredApiUrl = process.env.REACT_APP_API_URL;
const configuredBackendUrl = process.env.REACT_APP_BACKEND_URL;

export const BACKEND_URL = stripTrailingSlash(
  configuredBackendUrl ||
    (configuredApiUrl ? configuredApiUrl.replace(/\/api\/?$/, "") : "") ||
    "http://localhost:8000",
);

export const API_BASE = `${BACKEND_URL}/api`;

export function formatMoney(value) {
  if (!value) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function titleCase(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
