export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">Project BLNC</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Reshaping the Future. Innovating, Disrupting, Redefining.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-wide">Shop</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li>
                <a href="/products" className="hover:text-neutral-900 transition-colors">
                  All Products
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-neutral-900 transition-colors">
                  Hoodies
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-neutral-900 transition-colors">
                  Pants
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-neutral-900 transition-colors">
                  T-Shirts
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-wide">Info</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li>
                <a href="/about" className="hover:text-neutral-900 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/news" className="hover:text-neutral-900 transition-colors">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neutral-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <p className="text-xs text-neutral-400 text-center">
            © {new Date().getFullYear()} Project BLNC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
