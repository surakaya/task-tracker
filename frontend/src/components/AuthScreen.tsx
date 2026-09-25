import {
  FormEvent,
  useState,
} from "react";
import {
  login,
  register,
  User,
} from "../api/taskApi";

interface Props {
  onAuthenticated: (
    token: string,
    user: User
  ) => void;
}

export default function AuthScreen({
  onAuthenticated,
}: Props) {
  const [mode, setMode] = useState<
    "login" | "register"
  >("login");

  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("ayse@demo.local");
  const [password, setPassword] =
    useState("Demo12345");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result =
        mode === "login"
          ? await login(email, password)
          : await register(
              name,
              email,
              password
            );

      onAuthenticated(
        result.token,
        result.user
      );
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "İşlem gerçekleştirilemedi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 grid place-items-center p-6">
      <section className="w-full max-w-md bg-white border border-slate-200 shadow-xl shadow-brand-100/30 rounded-2xl p-7">
        <div className="w-11 h-11 grid place-items-center rounded-xl bg-brand-600 text-white text-xl mb-5">
          ✓
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Task Tracker
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          Kendi çalışma alanın.
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Görevlerin yalnızca hesabında görünür.
        </p>

        <div className="mt-6 grid grid-cols-2 bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setMode("login")}
            className={`rounded-md py-2 text-sm ${
              mode === "login"
                ? "bg-white shadow text-slate-800"
                : "text-slate-500"
            }`}
          >
            Giriş yap
          </button>

          <button
            onClick={() => setMode("register")}
            className={`rounded-md py-2 text-sm ${
              mode === "register"
                ? "bg-white shadow text-slate-800"
                : "text-slate-500"
            }`}
          >
            Kayıt ol
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mt-5 space-y-3"
        >
          {mode === "register" && (
            <input
              required
              placeholder="Adın"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="field"
            />
          )}

          <input
            required
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="field"
          />

          <input
            required
            minLength={8}
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="field"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white py-2.5 text-sm font-medium"
          >
            {loading
              ? "Bekleyin..."
              : mode === "login"
                ? "Çalışma alanına git"
                : "Hesabını oluştur"}
          </button>
        </form>

        {mode === "login" && (
          <p className="mt-4 text-xs text-slate-400">
            Demo: ayse@demo.local / Demo12345
          </p>
        )}
      </section>
    </main>
  );
}