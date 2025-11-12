import { Notebook, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full px-4 py-2 bg-stone-950 border-2 text-white flex items-center">
      <div className="flex items-center gap-2">
        <Notebook></Notebook>
        <button className="font-bold select-none cursor-pointer" onClick={() => navigate("/")}>EasyCourse</button>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-4">
        <button className="px-4 py-1 rounded hover:bg-stone-800 transition cursor-pointer" onClick={() => navigate("/course")}>Learn</button>
        <button className="px-4 py-1 rounded hover:bg-stone-800 transition cursor-pointer" onClick={() => navigate("/dashboard")}>Create</button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="px-4 py-1 rounded hover:bg-stone-800 transition cursor-pointer flex items-center gap-2">
          <Settings size={16} />
          Account
        </button>
      </div>
    </div>
  )
}
