/** Only this email receives ADMIN; all others are USER. */
export function getAdminEmail(): string {
    return (process.env.ADMIN_EMAIL || "dganhtuan.2k5@gmail.com").toLowerCase().trim();
}

export function roleForEmail(email: string): "ADMIN" | "USER" {
    return email.toLowerCase().trim() === getAdminEmail() ? "ADMIN" : "USER";
}
