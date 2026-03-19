export default function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-bg">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-text-secondary">
        <p>Data sourced from the U.S. Census Bureau, American Community Survey 5-Year Estimates.</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} ZipScope. All rights reserved.</p>
      </div>
    </footer>
  );
}
