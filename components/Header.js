import Link from "next/link";

export default function Header(props) {
  return (
    <header className="header">
      <nav
        className="nav"
        role="navigation"
        aria-label="main navigation"
      >
        <Link href="/">
          <span className="head"><i className="fab fa-bitcoin" style={{ color: '#f7931a' }}></i> 21bitcoin</span>
        </Link>
        <div>
          <Link href={`${typeof window !== "undefined" &&
            window.location.pathname == "/info" ?
            "/" : "/info"}`}>
            <span className="head">{`${typeof window !== "undefined" &&
              window.location.pathname == "/info" ?
              "close" : "info"}`}</span>
          </Link>
        </div>
      </nav>
      <style jsx>
        {`
          .head {
            margin-bottom: 0;
            font-size: 2rem;
            letter-spacing: -1px;
            line-height: 1.1875;
          }
          .head:hover {
            cursor: pointer;
          }
          nav {
            padding: 1.5rem 1.25rem;
            border-bottom: 1px solid #ebebeb;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
          }
          @media (min-width: 768px) {
            .header {
              height: 100vh;
              position: fixed;
              left: 0;
              top: 0;
            }
            .nav {
              padding: 2rem;
              width: 30vw;
              height: 100%;
              border-right: 1px solid #ebebeb;
              border-bottom: none;
              flex-direction: column;
              align-items: flex-start;
            }
          }
        `}
      </style>
    </header>
  );
}

