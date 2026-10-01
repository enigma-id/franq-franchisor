export type CashierDeviceStatus = "online" | "stale" | "offline";

export const DEVICE_STATUS_COLOR: Record<CashierDeviceStatus, string> = {
  online: "#10b981",
  stale: "#f59e0b",
  offline: "#94a3b8",
};

export const DEVICE_STATUS_LABEL: Record<CashierDeviceStatus, string> = {
  online: "Online",
  stale: "Stale",
  offline: "Offline",
};

export const deviceStatusColor = (status?: CashierDeviceStatus | string) =>
  DEVICE_STATUS_COLOR[(status as CashierDeviceStatus) ?? "offline"] ??
  DEVICE_STATUS_COLOR.offline;

export const deviceStatusLabel = (status?: CashierDeviceStatus | string) =>
  DEVICE_STATUS_LABEL[(status as CashierDeviceStatus) ?? "offline"] ??
  DEVICE_STATUS_LABEL.offline;

/**
 * Recency device dari timestamp log terakhir. Backend memformat WIB tanpa zona
 * (`YYYY-MM-DD HH:MM:SS`), jadi `+07:00` ditempelkan agar hasilnya absolut.
 */
export const deviceStatusFromTime = (
  timestamp?: string | null,
): CashierDeviceStatus => {
  if (!timestamp) return "offline";

  const parsed = new Date(
    `${timestamp.trim().replace(" ", "T")}+07:00`,
  ).getTime();
  if (Number.isNaN(parsed)) return "offline";

  const minutes = (Date.now() - parsed) / 60000;
  if (minutes <= 10) return "online";
  if (minutes <= 30) return "stale";
  return "offline";
};

/**
 * Status device untuk baris live map. Field `status` BE tidak reliable (live map
 * selalu kirim "Online"), jadi recency `last_activity_at` yang jadi acuan — status
 * BE cuma dipercaya kalau ia menandai device TIDAK online (stale/offline).
 */
export const deviceStatusFromRow = (
  status?: string | null,
  timestamp?: string | null,
): CashierDeviceStatus => {
  const normalized = status?.trim().toLowerCase();
  if (normalized === "stale" || normalized === "offline") return normalized;
  return deviceStatusFromTime(timestamp);
};
