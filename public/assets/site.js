// Testata con bordo quando si scorre
const testata = document.querySelector(".testata");
const aggiorna = () => testata && testata.classList.toggle("staccata", window.scrollY > 8);
window.addEventListener("scroll", aggiorna, { passive: true });
aggiorna();

// Modulo contatti
const modulo = document.getElementById("modulo");
if (modulo) {
  const esito = modulo.querySelector(".esito");
  const bottone = modulo.querySelector("button[type=submit]");

  modulo.addEventListener("submit", async (e) => {
    e.preventDefault();
    esito.className = "esito";
    esito.textContent = "";

    let primoErrore = null;
    for (const campo of modulo.querySelectorAll("[required]")) {
      const vuoto = campo.type === "checkbox" ? !campo.checked : !campo.value.trim();
      campo.setAttribute("aria-invalid", vuoto ? "true" : "false");
      if (vuoto && !primoErrore) primoErrore = campo;
    }
    if (primoErrore) {
      esito.classList.add("errore");
      esito.textContent = primoErrore.type === "checkbox"
        ? "Per inviare serve il consenso al trattamento dei dati."
        : "Compila nome, telefono e motivo della richiesta.";
      primoErrore.focus();
      return;
    }

    const dati = Object.fromEntries(new FormData(modulo));
    dati.privacy = modulo.privacy.checked;
    bottone.disabled = true;
    bottone.textContent = "Invio in corso…";
    try {
      const r = await fetch("/api/contatto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(dati),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.errore || "Invio non riuscito.");
      modulo.reset();
      esito.classList.add("ok");
      esito.textContent = "Richiesta inviata. Ti ricontatterò al più presto.";
    } catch (err) {
      esito.classList.add("errore");
      esito.textContent = err.message + " Riprova tra poco.";
    } finally {
      bottone.disabled = false;
      bottone.textContent = "Invia la richiesta";
    }
  });
}

// Comparsa dei contenuti quando entrano nello schermo
const daRivelare = document.querySelectorAll("[data-rivela]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (voci) => voci.forEach((v) => {
      if (v.isIntersecting) { v.target.classList.add("visibile"); io.unobserve(v.target); }
    }),
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  daRivelare.forEach((el) => io.observe(el));
} else {
  daRivelare.forEach((el) => el.classList.add("visibile"));
}
