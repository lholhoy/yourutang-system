import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import DefaultLayout from "./components/Layout/DefaultLayout";
import GuestLayout from "./components/Layout/GuestLayout";
import Dashboard from "./pages/Dashboard";
import BorrowerList from "./pages/Borrowers/BorrowerList";
import BorrowerForm from "./pages/Borrowers/BorrowerForm";
import BorrowerDetails from "./pages/Borrowers/BorrowerDetails";
import LoanList from "./pages/Loans/LoanList";
import LoanForm from "./pages/Loans/LoanForm";
import Profile from "./pages/Profile";
import HistoryLogs from "./pages/HistoryLogs";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/borrowers",
                element: <BorrowerList />,
            },
            {
                path: "/borrowers/new",
                element: <BorrowerForm />,
            },
            {
                path: "/borrowers/:id/edit",
                element: <BorrowerForm />,
            },
            {
                path: "/borrowers/:id",
                element: <BorrowerDetails />,
            },
            {
                path: "/loans",
                element: <LoanList />,
            },
            {
                path: "/loans/new",
                element: <LoanForm />,
            },
            {
                path: "/loans/:id/edit",
                element: <LoanForm />,
            },
            {
                path: "/profile",
                element: <Profile />,
            },
            {
                path: "/history",
                element: <HistoryLogs />,
            }
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "/password-reset/:token",
                element: <ResetPassword />,
            },
        ],
    },
]);

export default router;
