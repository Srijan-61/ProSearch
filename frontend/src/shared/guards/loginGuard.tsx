import type { JSX } from "react";
import { Navigate } from "react-router-dom";

//this page navigate user to home page if the user is already logged in and redirect user to login if user is not logged in

// kasto data aaunxa tyo declare in interface of loginguard


interface LoginGuardProps {
    children: JSX.Element;
}

const LoginGuard = ({children}: LoginGuardProps) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
        return <Navigate to="/home" replace/>; // replace removes the other route from history and replace the other routes to home page

    }else {
        return children;

    }
};

export default LoginGuard;



