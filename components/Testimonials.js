import { useState } from "react";

const MAX_COMMENT = 1000;

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

export default function Testimonials({ testimonials = [] }) {
  const [formOpen, setFormOpen] = useState(false);
  const [values, setValues] = useState({ name: "", copyNumber: "", comment: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState(null);

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "No se pudo enviar tu reseña.");

      setStatus("sent");
      setValues({ name: "", copyNumber: "", comment: "", website: "" });
    } catch (err) {
      console.error(err);
      setError(err.message);
      setStatus("idle");
    }
  }

  return (
    <section className="testimonials u-section">
      <div className="u-container-article">
        <h2 className="book_heading">Reseñas de lectores</h2>

        {testimonials.length > 0 ? (
          <ul className="testimonials_list">
            {testimonials.map((t) => (
              <li key={t.id} className="testimonials_item">
                <p className="u-text-regular testimonials_comment">{t.comment}</p>
                <p className="u-text-small testimonials_meta">
                  {t.name}
                  {t.submittedAt && <span> · {formatDate(t.submittedAt)}</span>}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="u-text-regular testimonials_empty">
            Aún no hay reseñas. Si ya leíste la novela, puedes ser quien escriba la primera.
          </p>
        )}

        {status === "sent" ? (
          <p className="u-text-regular testimonials_thanks" role="status">
            Gracias por escribir. J.R. la leerá antes de publicarla en esta página.
          </p>
        ) : formOpen ? (
          <form className="testimonials_form" onSubmit={handleSubmit}>
            <label className="testimonials_field">
              <span className="u-text-small">Nombre</span>
              <input
                type="text"
                value={values.name}
                onChange={update("name")}
                maxLength={60}
                required
              />
            </label>

            <label className="testimonials_field">
              <span className="u-text-small">Número de ejemplar</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{1,10}"
                value={values.copyNumber}
                onChange={update("copyNumber")}
                required
              />
              <span className="u-text-small testimonials_hint">
                Solo para verificar tu compra. No se publica.
              </span>
            </label>

            <label className="testimonials_field">
              <span className="u-text-small">Reseña</span>
              <textarea
                rows={6}
                value={values.comment}
                onChange={update("comment")}
                minLength={10}
                maxLength={MAX_COMMENT}
                required
              />
              <span className="u-text-small testimonials_hint">
                {values.comment.length} / {MAX_COMMENT}
              </span>
            </label>

            {/* Honeypot: hidden from people, filled in by bots. */}
            <input
              type="text"
              name="website"
              className="testimonials_honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={update("website")}
            />

            <button type="submit" className="button testimonials_submit" disabled={status === "sending"}>
              <div>{status === "sending" ? "ENVIANDO…" : "ENVIAR"}</div>
            </button>

            {error && (
              <p className="u-text-small testimonials_error" role="alert">
                {error}
              </p>
            )}
          </form>
        ) : (
          <button
            type="button"
            className="button testimonials_open"
            onClick={() => setFormOpen(true)}
          >
            <div>ESCRIBIR UNA RESEÑA</div>
          </button>
        )}
      </div>
    </section>
  );
}
