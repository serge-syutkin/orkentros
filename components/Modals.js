// The newsletter modal lives here rather than inline in Layout and index,
// which carried identical copies of this markup. initModalBasic binds
// [data-modal-target] to [data-modal-name] on mount, so nothing else is
// needed to open it.
export default function Modals() {
  return (
    <div className="modal" data-modal-group-status="not-active">
      <div className="modal__dark" data-modal-close></div>

      <div className="modal__card" data-modal-status="not-active" data-modal-name="modal-a">
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
  );
}
