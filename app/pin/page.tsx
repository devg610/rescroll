"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function PinPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPin(next);
    setError(false);
    if (next.length === 4) {
      submit(next);
    }
  };

  const submit = async (value: string) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: value }),
      });
      if (res.ok) {
        router.replace("/");
        router.refresh();
      } else {
        setError(true);
        setPin("");
        inputRef.current?.focus();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) submit(pin);
  };

  return (
    <main
      className="fixed inset-0 flex flex-col items-center px-6 pt-24"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <h1
        className="text-6xl tracking-tight"
        style={{ color: "var(--foreground)", fontWeight: 700 }}
      >
        Rescroll
      </h1>
      <p
        className="mt-3 text-xs lowercase tracking-widest"
        style={{ color: "var(--muted)" }}
      >
        enter pin
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col items-center">
        <div
          className="relative cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={handleChange}
            disabled={submitting}
            className="absolute inset-0 h-full w-full opacity-0"
            aria-label="pin"
          />
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((i) => {
              const isCursor = pin.length === i && !submitting;
              return (
                <div
                  key={i}
                  className="pill h-14 w-12 bg-transparent flex items-center justify-center transition-colors"
                  style={{
                    border: `1px solid ${
                      isCursor ? "#1D9BF0" : "var(--border)"
                    }`,
                    boxShadow: isCursor ? "0 0 0 1px #1D9BF0" : "none",
                  }}
                >
                  {i < pin.length && (
                    <span
                      className="block h-2.5 w-2.5"
                      style={{ backgroundColor: "var(--foreground)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <p
            className="mt-6 text-xs lowercase tracking-widest"
            style={{ color: "var(--error)" }}
          >
            incorrect
          </p>
        )}
      </form>
    </main>
  );
}
