import type { JSX } from "react";
import { Navigate } from "react-router-dom";



interface AuthGuradProps {
    children: JSX.Element;
}

const AuthGuard = ({children}: AuthGuradProps) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');

    if (!token || !user) {
        return <Navigate to="/login" replace/>;

    }else {
        return children;

    }
};

export default AuthGuard;



