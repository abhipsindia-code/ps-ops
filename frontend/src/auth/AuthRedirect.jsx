import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roleBasePath } from "./roleBasePath";

export default function AuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const path = roleBasePath(role);
    navigate(path);
  }, []);

  return null;
}
