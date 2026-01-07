import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Mask() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/processing");
  }, [navigate]);

  return null;
}
