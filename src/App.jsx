import { BrowserRouter as Router, useLocation } from "react-router-dom"
import { Toaster } from "sonner";
import AppRouters from "./Router";
import { ModalVideoProvider } from "./Components/Video/ModalVideoContext";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Navbar from "./Components/Header/header";
import Footer from "./Components/Footer/footer";
import Sidebar from "./Components/Sidebar/sidebar";

const AppContent = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

    return (
        <>
            <Toaster position="top-right" richColors />
            {!isAuthPage && <Navbar />}
            {!isAuthPage && <Sidebar />}
            <ModalVideoProvider>
                <AppRouters />
            </ModalVideoProvider>
            {!isAuthPage && <Footer />}
        </>
    );
};

const App = () => {
    return(
        <AuthProvider>
            <SocketProvider>
                <Router>
                    <AppContent />
                </Router>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App

