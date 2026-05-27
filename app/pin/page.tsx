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
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <h1 className="font-serif italic text-6xl text-zinc-100 tracking-tight">
        Rescroll
      </h1>
      <p className="mt-3 font-mono text-xs text-zinc-500 lowercase tracking-widest">
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
              const filled = i < pin.length;
              return (
                <div
                  key={i}
                  className="h-14 w-12 rounded border bg-transparent flex items-center justify-center transition-colors"
                  style={{
                    borderColor:
                      pin.length === i && !submitting ? "#c8f542" : "#262626",
                    boxShadow:
                      pin.length === i && !submitting
                        ? "0 0 0 1px #c8f542"
                        : "none",
                  }}
                >
                  {filled && (
                    <span
                      className="block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: "#e4e4e7" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="mt-6 font-mono text-xs text-red-500 lowercase tracking-widest">
            incorrect
          </p>
        )}
      </form>
    </main>
  );
}
