"use client";

import React, { useEffect } from "react";
import ToastContainer from "../components/ToastContainer";
import {toast} from "react-hot-toast";

const LoginPage = () => {
  const handleDiscordLogin = () => {
    // Redirect to Discord OAuth2 login page
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1322189908319801374";
    const redirectUri = encodeURIComponent(
      process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || "http://localhost:3000/api/auth/callback/discord"
    );
    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`;

    // Redirect user to Discord OAuth URL
    window.location.href = oauthUrl;
  };

  const handleCallback = async (code: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // เก็บ JWT Token ใน LocalStorage
      localStorage.setItem("authToken", data.token);
      toast.success('Login successful!!', {
        duration: 2000,
        position: 'top-right',
      });
    } catch (err: any) {
      console.error("Error handling login callback:", err);
    }
  };

  // ใช้ useEffect ในการตรวจสอบ URL และดึง code เมื่อใช้ใน client-side
  useEffect(() => {
    if (typeof window !== "undefined") {  // ตรวจสอบว่าเราอยู่ใน client-side
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        handleCallback(code);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-gray-900 to-black text-white">
      <div className="w-full max-w-sm p-6 bg-black bg-opacity-75 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Log in</h1>
        <button
          onClick={handleDiscordLogin}
          className="flex items-center justify-center w-full py-2 mb-4 text-white bg-purple-600 rounded hover:bg-purple-700"
        >
          Login with Discord
        </button>
      </div>
      <footer className="mt-6 text-center text-sm text-gray-400">
        <p>© 2024 Xzer Hub</p>
        <p>
          Built by{" "}
          <a href="https://twitter.com/yourhandle" className="underline">
            Your Name
          </a>
        </p>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
