import Footer from '@/components/Footer.jsx';
import Navbar from '@/components/Navbar.jsx';

function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
