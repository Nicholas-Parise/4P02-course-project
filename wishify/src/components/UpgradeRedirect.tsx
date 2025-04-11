import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    isLoggedIn: boolean;
}

const UpgradeRedirect = ({ isLoggedIn }: Props) => {
    const token = localStorage.getItem('token') || '';
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            // User is logged in, proceed directly to upgrade page
            navigate("/upgrade");
        } else {
            // User not logged in, store upgrade intent and redirect to login
            sessionStorage.setItem("upgrade_redirect", "true");
            navigate("/login");
        }
    }, [isLoggedIn, navigate, token]);

    return (
        <section className="flex justify-center">
            <CircularProgress className="mt-10" />
        </section>
    );
};

export default UpgradeRedirect;