import { useEffect } from "react";

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
        <div className="fixed-top">
          <p className="name u-text-small">J.R. Güemes</p>
          <p className="u-text-small">Fantasía épica y oscura</p>
          <p className="u-text-small">Inspirado en la mitología celta y vikinga</p>
        </div>

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
                  Suscríbete
                  <br />
                  al boletín semanal,
                  <br />
                  conoce de J.R. Güemes,
                  <br />
                  de El Mundo del Orkentros
                  <br />
                  y deja que «Coba» te cuente
                  <br />
                  una leyenda en su cueva.
                </p>
                <div className="button" data-modal-target="modal-a">
                  <div>ÚNETE AQUÍ</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="modal" data-modal-group-status="not-active">
          <div className="modal__dark" data-modal-close></div>
          <div
            className="modal__card"
            data-modal-status="not-active"
            data-modal-name="modal-a"
          >
            <div className="modal__scroll">
              <div className="modal__content">
                <div className="modal__btn-close" data-modal-close>
                  <div className="modal_close">
                    <p className="modal_close-text">x</p>
                  </div>
                </div>
                <h2 className="modal_h2">ÚNETE AQUÍ</h2>
                <div className="substack_form">
                  <iframe
                    src="https://jrguemes.substack.com/embed?transparent=1"
                    width="100%"
                    height="150"
                    style={{ border: 0, background: "transparent" }}
                    frameBorder="0"
                    scrolling="no"
                    title="Suscripción al boletín"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
