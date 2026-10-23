import { randomUUID } from "node:crypto";
import { getWriteClient } from "../../sanity/lib/writeClient";

const MAX_NAME = 60;
const MIN_COMMENT = 10;
const MAX_COMMENT = 1000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = getWriteClient();
  if (!client) {
    console.error("Testimonial submitted without SANITY_WRITE_TOKEN configured");
    return res.status(500).json({ error: "No se pudo enviar tu reseña ahora." });
  }

  const { name, copyNumber, comment, website } = req.body ?? {};

  // Honeypot: the field is hidden from people and left empty by them, so
  // anything in it came from a bot filling the form blind.
  if (website) return res.status(200).json({ ok: true });

  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanNumber = typeof copyNumber === "string" ? copyNumber.trim() : "";
  const cleanComment = typeof comment === "string" ? comment.trim() : "";

  if (!cleanName || cleanName.length > MAX_NAME) {
    return res.status(400).json({ error: "Escribe tu nombre." });
  }
  if (!/^\d{1,10}$/.test(cleanNumber)) {
    return res.status(400).json({ error: "El número de ejemplar solo puede tener dígitos." });
  }
  if (cleanComment.length < MIN_COMMENT || cleanComment.length > MAX_COMMENT) {
    return res.status(400).json({
      error: `Tu reseña debe tener entre ${MIN_COMMENT} y ${MAX_COMMENT} caracteres.`,
    });
  }

  try {
    // A double-tap on the button would otherwise file the same review twice.
    const duplicate = await client.fetch(
      `count(*[_type == "testimonial" && copyNumber == $copyNumber && comment == $comment])`,
      { copyNumber: cleanNumber, comment: cleanComment }
    );
    if (duplicate > 0) return res.status(200).json({ ok: true });

    // Filed as a draft on purpose. The dataset is readable without a token, so
    // a published-but-unapproved document would expose the copy number and any
    // unmoderated text to anyone querying the API; drafts need a token to read.
    // Publishing it in the studio is what approves it.
    await client.create({
      _id: `drafts.${randomUUID()}`,
      _type: "testimonial",
      name: cleanName,
      copyNumber: cleanNumber,
      comment: cleanComment,
      submittedAt: new Date().toISOString(),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Could not save the testimonial:", err);
    return res.status(500).json({ error: "No se pudo enviar tu reseña. Inténtalo de nuevo." });
  }
}
