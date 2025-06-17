// /src/components/ConnectGoogleFit.tsx — v2.5.0
import React from "react";
import { useSession } from "../context/SessionContext";

export default function ConnectGoogleFit() {
  const { accessToken } = useSession();

  const handleConnect = () => {
    if (!accessToken) return;

    const state = btoa(localStorage.getItem("initDataRaw") || "");
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent("https://api.fitmine.vip/api/oauth/callback");

    const scope = encodeURIComponent([
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.location.read",
      "https://www.googleapis.com/auth/fitness.body.read"
    ].join(" "));

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&response_type=code` +
      `&scope=${scope}` +
      `&access_type=offline` + // ✅ обязательно для получения refresh_token
      `&prompt=consent` +      // ✅ принудительно возвращает refresh_token
      `&state=${state}`;

    window.open(authUrl, "_blank");
  };

  return (
    <button
      onClick={handleConnect}
      className="mt-3 px-5 py-2 bg-emerald-600 text-white rounded-full shadow hover:bg-emerald-700 transition"
    >
      🔐 Подключить Google Fit
    </button>
  );
}