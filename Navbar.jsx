import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="bg-primary text-white shadow-md flex flex-col md:flex-row justify-between items-center p-4 md:p-6 rounded-b-3xl">
      {/* Logo in Circle */}
      <a href="/landing" className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-dark flex items-center justify-center shadow-sm overflow-hidden">
          <img
            src={logo}
            alt="MindForge Logo"
            className="h-10 w-10 object-contain"
          />
        </div>
        <span className="text-3xl font-bold hidden sm:inline">MindForgeAI</span>
      </a>

      {/* Navigation Links */}
      <div className="space-x-8 mt-4 md:mt-0">
        <a href="/login" className="hover:text-accent transition">Login</a>
      </div>
    </nav>
  );
}
