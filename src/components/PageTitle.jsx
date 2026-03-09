// src/components/PageTitle.jsx
import { useEffect } from "react";

export default function PageTitle({ title }) {
  useEffect(() => {
    document.title = title ? `DDI | ${title}` : "DDI";
  }, [title]);

  return null;
}
