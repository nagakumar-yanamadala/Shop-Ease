import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
function App() {
  return (
    <AuthProvider>
      <div className="bg-[#f3f4f6] min-h-screen p">
        <Header />
        <Outlet />
      </div>
    </AuthProvider>
  );
}

export default App;
