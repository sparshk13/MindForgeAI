export default function Footer() {
  return (
    <footer className="bg-secondary text-white text-center text-sm py-6 border-t border-border rounded-t-3xl">
      <p className="text-white">© 2025 MindForge AI. All rights reserved.</p>
      <div className="space-x-4 mt-2">
        <a href="#" className="hover:text-accent transition">Privacy Policy</a>
        <a href="#" className="hover:text-accent transition">Terms</a>
        <a href="mailto:support@mindforge.ai" className="hover:text-accent transition">Contact</a>
      </div>
    </footer>
  );
}
