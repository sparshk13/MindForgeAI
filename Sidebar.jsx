import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-secondary p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-6">Dashboard</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:text-primary">Home</Link>
        <Link to="/skillscan" className="hover:text-primary">SkillScan</Link>
        <Link to="/confusion" className="hover:text-primary">Confusion Detector</Link>
        <Link to="/concept-cards" className="hover:text-primary">Concept Cards</Link>
        <Link to="/knowledge-decay" className="hover:text-primary">Knowledge Tracker</Link>
        {/* <Link to="/admin" className="hover:text-primary">Admin Panel</Link> */}
      </nav>
    </div>
  );
}
