import Inputcomponent from "../components/Inputcomponent";
import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

function Avatar({ s }: { s: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-black text-white w-10 h-10 flex items-center justify-center rounded-full shadow-md">
        <span className="text-2xl font-semibold">{s}</span>
      </div>
    </div>
  );
}
function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate=useNavigate()
const [searchParams] = useSearchParams();
const handleSearch=(event: React.KeyboardEvent<HTMLInputElement>)=>{
  if(event.key==='Enter' && search.trim()!==""){
    navigate(`/?q=${search}`)
  }
}
const [search,setSearch]=useState(searchParams.get('q')||'')
  const initial = user?.fullname ? user.fullname[0].toUpperCase() : "?";
  return (
    <>
      <div className="flex items-center justify-between p-5">
        <div className="flex gap-3">
          <img
            alt="Your Company"
            src="https://logos-world.net/wp-content/uploads/2023/07/Medium-Logo.png"
            className="mx-auto h-10 w-auto"
          />
          <div className="1/2">
            <Inputcomponent
              inputLable=""
              type="search"
              onChange={(e) => setSearch(e.target.value)}
         onKeyDown={handleSearch}
              value={search}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          {user && <button onClick={logout}>Logout</button>}
          {location.pathname === "/new-story" ? null : (
            <Link to="/new-story" className="text-white bg-black rounded-md p-1">
              New Story
            </Link>
          )}
          <Avatar s={initial} />
        </div>
      </div>

      {/* Pass search query as a prop */}
      <Outlet context={{ search }} />
    </>
  );
}

export default Dashboard;
