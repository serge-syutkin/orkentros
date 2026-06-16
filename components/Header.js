import Link from "next/link";

export default function Header() {
  return (
    <div className="fixed-top">
      <Link href="/" className="name u-text-small">
        J.R. Güemes
      </Link>
      <div className="fixed-center">
        <p className="u-text-small">Fantasía épica y oscura</p>
        <p className="u-text-small">Inspirado en la mitología celta y vikinga</p>
      </div>
    </div>
  );
}
