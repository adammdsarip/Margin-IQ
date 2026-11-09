import Calculator from './calculator/Calculator.jsx';

export default function App() {
  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <span className="brand">MARGINIQ</span>
          <span className="brand__tagline">Know your numbers. Make smarter decisions.</span>
        </div>
      </header>
      <main className="container">
        <Calculator />
      </main>
      <footer className="container footer">
        Figures are estimates. Your numbers stay on this device.
      </footer>
    </>
  );
}
