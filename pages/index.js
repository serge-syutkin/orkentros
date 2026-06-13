import Head from "next/head";
import { useEffect } from "react";
import Header from "../components/Header";

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
      if (modalGroup) {
        modalGroup.setAttribute("data-modal-group-status", "active");
      }
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllModals();
  });

  function closeAllModals() {
    modalTargets.forEach((t) => t.setAttribute("data-modal-status", "not-active"));
    if (modalGroup) {
      modalGroup.setAttribute("data-modal-group-status", "not-active");
    }
  }
}

export default function Home() {
  useEffect(() => {
    initModalBasic();

    let scrollTriggerRef;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { SplitText } = await import("gsap/SplitText");
      gsap.registerPlugin(ScrollTrigger, SplitText);
      scrollTriggerRef = ScrollTrigger;

      // === PAGE LOAD ANIMATIONS ===
      // Title: opacity + scale, expo out, 0.2s delay, 4s
      gsap.fromTo(
        ".hero_title_wrap",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 4, delay: 0.2, ease: "expo.out" }
      );
      // Small text: opacity only, power1 out, 1.7s delay, 1.5s
      gsap.fromTo(
        ".u-text-small",
        { opacity: 0 },
        { opacity: 1, duration: 1.5, delay: 1.7, ease: "power1.out" }
      );
      // Button: opacity only, power1 out, 1.7s delay, 1.5s
      gsap.fromTo(
        ".button",
        { opacity: 0 },
        { opacity: 1, duration: 1.5, delay: 1.7, ease: "power1.out" }
      );
      // Shape blobs: opacity + scale, power1 out, 2s delay, 4s, infinite yoyo pulse
      gsap.fromTo(
        ".shape",
        { opacity: 0, scale: 0 },
        {
          opacity: 0.6,
          scale: 1,
          duration: 4,
          delay: 2,
          ease: "power1.out",
          repeat: -1,
          yoyo: true,
        }
      );

      // === SCROLL ANIMATIONS ===
      await document.fonts.ready;

      const wraps = document.querySelectorAll('[data-sticky-title="wrap"]');
      wraps.forEach((wrap) => {
        const inner = wrap.querySelector(".sticky-title-inner");
        if (!inner) return;

        const units = [];
        Array.from(inner.children).forEach((child) => {
          if (child.matches('[data-sticky-title="group"], .item-wrapper')) {
            const headings = Array.from(
              child.querySelectorAll('[data-sticky-title="heading"]')
            );
            if (headings.length) units.push({ container: child, headings });
          } else if (child.matches('[data-sticky-title="heading"]')) {
            units.push({ container: child, headings: [child] });
          }
        });

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top 40%",
            end: "bottom bottom",
            scrub: true,
          },
        });

        const revealDuration = 0.4;
        const revealStagger = 0.6;
        const fadeOutDuration = 0.4;
        const fadeOutStagger = 0.6;
        const overlapOffset = 0.15;
        const revealTotal = revealStagger + revealDuration;

        units.forEach((unit, index) => {
          const animConfigs = unit.headings.map((heading) => {
            heading.setAttribute("aria-label", heading.textContent);
            const animType = heading.dataset.stickyAnim || "chars";
            if (animType === "fade") {
              return { targets: [heading], useStagger: false };
            }
            const split = new SplitText(heading, { type: "words,chars" });
            split.words.forEach((word) => word.setAttribute("aria-hidden", "true"));
            const targets = animType === "words" ? split.words : split.chars;
            return { targets, useStagger: true };
          });

          gsap.set(unit.container, { visibility: "visible" });
          const unitTl = gsap.timeline();

          animConfigs.forEach(({ targets, useStagger }) => {
            unitTl.from(
              targets,
              {
                autoAlpha: 0,
                duration: useStagger ? revealDuration : revealTotal,
                ease: "power2.out",
                stagger: useStagger ? { amount: revealStagger, from: "start" } : 0,
              },
              0
            );
          });

          if (index < units.length - 1) {
            animConfigs.forEach(({ targets, useStagger }) => {
              unitTl.to(
                targets,
                {
                  autoAlpha: 0,
                  duration: useStagger
                    ? fadeOutDuration
                    : fadeOutStagger + fadeOutDuration,
                  ease: "power2.in",
                  stagger: useStagger ? { amount: fadeOutStagger, from: "end" } : 0,
                },
                revealTotal
              );
            });
          }

          if (index === 0) {
            masterTl.add(unitTl);
          } else {
            masterTl.add(unitTl, `-=${overlapOffset}`);
          }
        });
      });
    })();

    return () => {
      if (scrollTriggerRef) {
        scrollTriggerRef.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>El Universo de Orkentros</title>
        <meta name="description" content="" />
        <meta property="og:title" content="El Universo de Orkentros" />
        <meta property="og:description" content="" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="El Universo de Orkentros" />
        <meta name="twitter:description" content="" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="page-wrapper" data-page="home">
        <div className="main-wrapper">
          <Header />

          <section className="hero_section u-section">
            <div className="hero_wrap">
              <div
                className="hero_middle"
                id="w-node-bb3ce898-d49a-aa83-5aff-53e9688d6c50-59937189"
              >
                <div className="hero_descr-wrap">
                  <p className="hero_blend u-text-small">
                    Compra la primera novela
                    <br />
                    de la saga de la Llama Azul.
                    <br />
                    Pero antes déjame contarte algo
                    <br />
                    de este mundo, de sus héroes, de sus traidores, de las bestias oscuras,
                    <br />
                    de los Dioses y de la magia.
                  </p>
                  <div className="shape"></div>
                </div>
                <div className="hero_title_wrap">
                  <h1 className="hero_heading">
                    el mundo
                    <br />
                    del orkentros
                    <br />
                  </h1>
                </div>
                <div className="hero_descr-wrap">
                  <p className="hero_blend u-text-small">
                    Verás que es
                    <br />
                    como una cultura
                    <br />
                    y una mitología del mundo
                    <br />
                    antiguo que todo este tiempo
                    <br />
                    estuvo enterrada y apenas
                    <br />
                    ha sido descubierta.
                  </p>
                  <div className="shape"></div>
                </div>
              </div>
              <div className="hero_bottom">
                <p className="u-text-small">
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
          </section>

          <section
            className="content_section u-section"
            data-sticky-title="wrap"
          >
            <div className="sticky-title-container">
              <div className="sticky-title-inner">
                <div className="item-wrapper" data-sticky-title="group">
                  <div className="item_top">
                    <p
                      className="u-text-regular"
                      data-sticky-anim="fade"
                      data-sticky-title="heading"
                    >
                      Las leyes y la forma
                      <br />
                      de este mundo no me gustaban.
                      <br />
                      Quizás nací en el mundo
                      <br />
                      o tiempo incorrecto.
                      <br />
                      (¿O no?)
                    </p>
                    <p
                      className="u-text-large"
                      data-sticky-title="heading"
                      data-sticky-anim="chars"
                    >
                      Así que me inventé
                      <br />
                      un nuevo mundo, cultura
                      <br />
                      y mitología, con sus propias reglas,
                      <br />
                      con su propio lenguaje, con sus propios héroes,
                      <br />
                      con su propia oscuridad y maldad.
                    </p>
                  </div>
                  <p
                    className="rune_count u-text-large"
                    data-sticky-title="heading"
                    data-sticky-anim="chars"
                  >
                    ᚠ
                  </p>
                </div>

                <div
                  className="item-wrapper is--stacked"
                  data-sticky-title="group"
                >
                  <div className="item_top">
                    <p
                      className="u-text-regular"
                      data-sticky-anim="fade"
                      data-sticky-title="heading"
                    >
                      No sé
                      <br />
                      cómo autores
                      <br />
                      como George R.R. Martin
                      <br />
                      o Patrick Rothfuss no terminan
                      <br />
                      sus sagas. Tienen la atención del público,
                      <br />
                      pero no suben al estrado
                      <br />
                      para el último acto.
                      <br />
                      Yo no pienso
                      <br />
                      hacer eso.
                    </p>
                    <p
                      className="u-text-large"
                      data-sticky-title="heading"
                      data-sticky-anim="chars"
                    >
                      Cada semana
                      <br />
                      cuento en mi boletín semanal
                      <br />
                      qué estoy escribiendo, qué hay en mis pensamientos,
                      <br />
                      qué estoy viviendo… que tenga que ver
                      <br />
                      con el Orkentros.
                    </p>
                  </div>
                  <p
                    className="rune_count u-text-large"
                    data-sticky-title="heading"
                    data-sticky-anim="chars"
                  >
                    ᚢ
                  </p>
                </div>

                <div
                  className="item-wrapper is--stacked"
                  data-sticky-title="group"
                >
                  <div className="item_top">
                    <p
                      className="u-text-regular"
                      data-sticky-anim="fade"
                      data-sticky-title="heading"
                    >
                      Este soy yo:
                    </p>
                    <p
                      className="u-text-large"
                      data-sticky-title="heading"
                      data-sticky-anim="chars"
                    >
                      Escribo novelas de fantasía.
                      <br />
                      &quot;Escribir no es una carrera seria.
                      <br />
                      Ni siquiera es una profesión..&quot;
                    </p>
                    <p
                      className="u-text-regular"
                      data-sticky-anim="fade"
                      data-sticky-title="heading"
                    >
                      Es lo que me dijeron y quisieron hacer creer.
                      <br />
                      Así que tuve que inventármelo.
                    </p>
                  </div>
                  <p
                    className="rune_count u-text-large"
                    data-sticky-title="heading"
                    data-sticky-anim="chars"
                  >
                    ᚦ
                  </p>
                </div>

                <div
                  className="item-wrapper is--stacked"
                  data-sticky-title="group"
                >
                  <div className="item_top">
                    <p
                      className="u-text-large"
                      data-sticky-title="heading"
                      data-sticky-anim="chars"
                    >
                      Soy escritor,
                      <br />
                      me dedico a escribir
                      <br />
                      el Mundo del Orkentros
                      <br />
                      y me gano la vida con ello.
                    </p>
                    <p
                      className="u-text-regular"
                      data-sticky-anim="fade"
                      data-sticky-title="heading"
                    >
                      También entreno; el cuerpo en el gimnasio
                      <br />
                      y la mente en levantarme cada día
                      <br />
                      de cama para luchar.
                    </p>
                  </div>
                  <p
                    className="rune_count u-text-large"
                    data-sticky-title="heading"
                    data-sticky-anim="chars"
                  >
                    ᚯ
                  </p>
                </div>

                <div
                  className="item-wrapper is--stacked"
                  data-sticky-title="group"
                >
                  <div className="item_top">
                    <p
                      className="u-text-regular"
                      data-sticky-anim="fade"
                      data-sticky-title="heading"
                    >
                      A la vida he venido
                      <br />
                      a escribir y a luchar.
                      <br />
                      A luchar cuando el mundo
                      <br />
                      me dijo que no lo haga,
                      <br />
                      como lo hace Belard,
                      <br />
                      mi protagonista.
                    </p>
                    <p
                      className="u-text-large"
                      data-sticky-title="heading"
                      data-sticky-anim="chars"
                    >
                      Practico el estoicismo.
                      <br />
                      No tengo redes sociales,
                      <br />
                      solo mis boletines.
                    </p>
                    <p
                      className="u-text-regular"
                      data-sticky-anim="fade"
                      data-sticky-title="heading"
                    >
                      Este soy yo.
                      <br />
                      No has visto ni leído
                      <br />
                      nada como esto
                      <br />
                      ¿O sí?
                    </p>
                  </div>
                  <p
                    className="rune_count u-text-large"
                    data-sticky-title="heading"
                    data-sticky-anim="chars"
                  >
                    ᚱ
                  </p>
                </div>
              </div>
            </div>
          </section>

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
            <div
              className="modal__card"
              data-modal-status="not-active"
              data-modal-name="modal-b"
            >
              <div className="modal__scroll">
                <div className="modal__content">
                  <h2 className="modal_close-text">Modal B</h2>
                </div>
              </div>
              <div className="modal__btn-close" data-modal-close>
                <div className="modal__btn-close-bar"></div>
                <div className="modal__btn-close-bar is--second"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
