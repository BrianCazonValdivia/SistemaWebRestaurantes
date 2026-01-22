"use client";

const ADMIN_AUTH_KEY = "polleria_admin_auth_v1";
const ADMIN_PIN_KEY = "polleria_admin_pin_v1";

// PIN demo (cliente). Para server usaremos process.env.ADMIN_PIN si existe.
const ADMIN_PIN = "1234";

export function isAdminAuthed(): boolean {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  } catch {
    return false;
  }
}

export function loginAdmin(pin: string): boolean {
  const ADMIN_PIN = "1234"; // el mismo que usas para login

  if (pin === ADMIN_PIN) {
    localStorage.setItem("polleria_admin_auth_v1", "true");
    localStorage.setItem("polleria_admin_pin_v1", pin); // 👈 clave
    return true;
  }
  return false;
}

export function getAdminPin(): string {
  return localStorage.getItem("polleria_admin_pin_v1") || "";
}


export function logoutAdmin() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_PIN_KEY);
}
