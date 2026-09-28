export type SessionStatus = "open" | "few" | "closed";

export function deriveSessionStatus(spotsLeft: number, explicit?: string | null): SessionStatus {
  if (explicit === "closed" || spotsLeft <= 0) return "closed";
  if (spotsLeft <= 4) return "few";
  return "open";
}

export function sessionStatusLabel(status: string) {
  if (status === "closed") return "Закрыт";
  if (status === "few") return "Мало мест";
  return "Открыт";
}
