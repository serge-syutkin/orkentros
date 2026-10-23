import { useEffect } from "react";
import Header from "./Header";
import Modals from "./Modals";

function initModalBasic() {
  const modalGroup = document.querySelector("[data-modal-group-status]");
  const modals = document.querySelectorAll("[data-modal-name]");
  const modalTargets = document.querySelectorAll("[data-modal-target]");

  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener("click", function () {
      const modalTargetName = this.getAttribute("data-modal-target");
      modalTargets.forEach((t) => t.setAttribute("data-modal-status", "not-active"));
      modals.forEach((m) => m.setAttribute("data-modal-status", "not-active"));
      document
        .querySelector(`[data-modal-target="${modalTargetName}"]`)
        .setAttribute("data-modal-status", "active");
      document
        .querySelector(`[data-modal-name="${modalTargetName}"]`)
        .setAttribute("data-modal-status", "active");
      if (modalGroup) modalGroup.setAttribute("data-modal-group-status", "active");
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });

  function closeAllModals() {
    modalTargets.forEach((t) => t.setAttribute("data-modal-status", "not-active"));
    if (modalGroup) modalGroup.setAttribute("data-modal-group-status", "not-active");
  }
}

export default function Layout({ children }) {
  useEffect(() => {
    initModalBasic();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="main-wrapper">
        <Header />

        {children}

        <section className="footer u-section">
          <div className="u-container-100">
            <div className="footer_layout">
              <div className="footer_title_wrap">
                <h1 className="hero_heading">
                  El mundo
                  <br />
                  del orkentros
                </h1>
              </div>
              <div className="footer_bottom">
                <p className="cta_intro u-text-small">
                  Suscríbete gratis
                  <br />
                  al blog semanal de
                  <br />
                  J.R. Güemes, entra a
                  <br />
                  El Mundo del Orkentros
                  <br />
                  y recibe en tu email
                  <br />
                  una leyenda contada
                  <br />
                  por «Coba».
                </p>
                <div className="button" data-modal-target="modal-a">
                  <div>ÚNETE AQUÍ</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Modals />
      </div>
    </div>
  );
}
