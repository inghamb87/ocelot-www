import Link from "next/link";

type Crumb = { href?: string; label: string };

export function PageHead({
  crumbs,
  label,
  title,
  lede,
  children,
}: {
  crumbs?: Crumb[];
  label?: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-head">
      <div className="wrap">
        {crumbs ? (
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label}>{c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
              ))}
            </ol>
          </nav>
        ) : null}
        {label ? <p className="label">{label}</p> : null}
        <h1 className={label ? "mt-1" : undefined}>{title}</h1>
        {lede ? <p className="lede measure">{lede}</p> : null}
        {children}
      </div>
    </header>
  );
}
