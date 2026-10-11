import Link from "next/link";
import { useEffect, useState } from "react";
import { PRODUCT_PATH } from "../lib/shop";

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  return (
    <>
      {/* Desktop: the corner buttons sit outside .fixed-top on purpose — that
          element blends with mix-blend-mode: difference as a group, so a child
          cannot opt out of it. Below 991px these give way to the burger. */}
      <Link href={PRODUCT_PATH} className="button nav_button nav_button--left">
        <div>COMPRA LA NOVELA</div>
      </Link>

      <div className="fixed-top">
        <Link href="/" className="name u-text-small">
          J.R. Güemes
        </Link>
        <div className="fixed-center">
          <p className="u-text-small">Fantasía épica y oscura</p>
          <p className="u-text-small">Inspirado en mitología celta y nórdica</p>
        </div>
      </div>

      {/* TODO: open a modal with the contact address — no destination yet. */}
      <button type="button" className="button nav_button nav_button--right">
        <div>CONTACTO</div>
      </button>

      {/* Tablet and below. The data-navigation-status attribute drives every
          transition in CSS, exactly as in the original template; React only
          decides its value instead of a click listener setting it. */}
      <nav
        className="burger-nav"
        data-navigation-status={navOpen ? "active" : "not-active"}
      >
        <div className="burger-nav__bar">
          <button
            type="button"
            className="burger-nav__hamburger"
            data-navigation-toggle="toggle"
            aria-label={navOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
          >
            <div className="burger-nav__hamburger-bar"></div>
            <div className="burger-nav__hamburger-bar"></div>
            <div className="burger-nav__hamburger-bar"></div>
          </button>
        </div>

        <div className="burger-nav__tile">
          <ul className="burger-nav__ul">
            <li className="burger-nav__li">
              <Link
                href={PRODUCT_PATH}
                className="burger-nav__link"
                data-navigation-toggle="close"
                onClick={() => setNavOpen(false)}
              >
                <span className="burger-nav__link-text">COMPRA LA NOVELA</span>
              </Link>
            </li>
            <li className="burger-nav__li">
              <button type="button" className="burger-nav__link">
                <span className="burger-nav__link-text">CONTACTO</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
