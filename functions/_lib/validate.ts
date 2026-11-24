// Small, dependency-free validators. Every value that reaches the database or
// an email passes through one of these.

const CONTROL = /[\u0000-\u001f\u007f]/g;
const EMAIL = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/;
const PHONE = /^[+()\d\s.-]{6,24}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export class Invalid extends Error {
  constructor(public fields: Record<string, string>) {
    super("invalid");
  }
}

export class Checker {
  errors: Record<string, string> = {};
  constructor(private body: Record<string, unknown>) {}

  /** Single-line text: control characters removed, whitespace collapsed. */
  line(key: string, opts: { max: number; required?: boolean; label: string }): string {
    const raw = this.body[key];
    const s = typeof raw === "string" ? raw.replace(CONTROL, " ").replace(/\s+/g, " ").trim() : "";
    if (!s && opts.required) this.errors[key] = `${opts.label} is required.`;
    if (s.length > opts.max) this.errors[key] = `${opts.label} is too long.`;
    return s.slice(0, opts.max);
  }

  /** Multi-line text: keeps line breaks, removes other control characters. */
  text(key: string, opts: { max: number; min?: number; label: string }): string {
    const raw = this.body[key];
    const s = typeof raw === "string" ? raw.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim() : "";
    if (opts.min && s.length < opts.min) this.errors[key] = `${opts.label} is too short.`;
    if (s.length > opts.max) this.errors[key] = `${opts.label} is too long.`;
    return s.slice(0, opts.max);
  }

  email(key: string): string {
    const raw = this.body[key];
    const s = typeof raw === "string" ? raw.trim().toLowerCase() : "";
    if (!s || s.length > 254 || !EMAIL.test(s)) this.errors[key] = "Enter a valid email address.";
    return s;
  }

  phone(key: string): string {
    const raw = this.body[key];
    const s = typeof raw === "string" ? raw.trim() : "";
    if (s && !PHONE.test(s)) this.errors[key] = "Enter a valid phone number or leave it empty.";
    return s;
  }

  int(key: string, min: number, max: number, label: string): number {
    const n = this.body[key];
    if (typeof n !== "number" || !Number.isInteger(n) || n < min || n > max) {
      this.errors[key] = `${label} must be between ${min} and ${max}.`;
      return min;
    }
    return n;
  }

  bool(key: string): boolean {
    return this.body[key] === true;
  }

  oneOf<T extends string>(key: string, allowed: readonly T[], label: string): T {
    const raw = this.body[key];
    if (typeof raw !== "string" || !allowed.includes(raw as T)) {
      this.errors[key] = `Choose a valid ${label}.`;
      return allowed[0] as T;
    }
    return raw as T;
  }

  subset(key: string, allowed: readonly string[]): string[] {
    const raw = this.body[key];
    if (!Array.isArray(raw)) return [];
    return [...new Set(raw.filter((x): x is string => typeof x === "string" && allowed.includes(x)))];
  }

  date(key: string, label: string): string {
    const raw = this.body[key];
    if (typeof raw !== "string" || !ISO_DATE.test(raw) || Number.isNaN(Date.parse(`${raw}T00:00:00Z`))) {
      this.errors[key] = `Choose a valid ${label}.`;
      return "";
    }
    // Reject impossible dates such as 2027-02-31.
    if (new Date(`${raw}T00:00:00Z`).toISOString().slice(0, 10) !== raw) {
      this.errors[key] = `Choose a valid ${label}.`;
      return "";
    }
    return raw;
  }

  done(): void {
    if (Object.keys(this.errors).length) throw new Invalid(this.errors);
  }
}

export function nights(checkIn: string, checkOut: string): number {
  return Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86_400_000);
}
