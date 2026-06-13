import Link from "next/link";

export default function Header() {
  return (
    <div className="fixed-top">
      <p className="name u-text-small">J.R. Güemes</p>
      <div className="fixed-center">
        <p className="u-text-small">Fantasía épica y oscura</p>
        <p className="u-text-small">Inspirado en la mitología celta y vikinga</p>
      </div>
      <Link href="/articles" className="header-link u-text-small">
        Artículos
      </Link>
    </div>
  );
}
