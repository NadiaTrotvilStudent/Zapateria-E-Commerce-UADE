const currentYear = new Date().getFullYear();

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__content">
        <span>Zapateria E-Commerce UADE</span>
        <span>{currentYear}</span>
      </div>
    </footer>
  );
}

export default Footer;
