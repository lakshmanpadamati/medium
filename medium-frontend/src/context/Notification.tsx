import { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
interface nofitficationInterface {
  notify: (message: string, type: "error" | "success") => void;
}

const NotificationContext = createContext<nofitficationInterface|undefined>(undefined);
function NotificationProvider() {
    const notify = (message: string, type: string) => {
        if (type == "error") {
          toast.error(message);
          return;
        }
    
        else {
          toast.success(message);
          return
        }}
      
  return (
    <NotificationContext.Provider value={{ notify }}>
        <ToastContainer autoClose={1000}/>
     <Outlet/>
    </NotificationContext.Provider>
  );
}
 export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a notificationProvider");
  }
  return context;
};

export default NotificationProvider;
