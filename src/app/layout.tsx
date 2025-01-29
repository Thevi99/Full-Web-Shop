import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./contexts/UserContext";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import dbConnect from "@/lib/mongo";
import configsettingModel from "../models/configsettingModel";
export async function generateMetadata(): Promise<Metadata> {
  try {
    // เชื่อมต่อฐานข้อมูล
    await dbConnect();

    // ดึงข้อมูลจากฐานข้อมูล
    const config = await configsettingModel.findOne(); // สมมติว่ามีเอกสารเดียว
    if (config) {
      return {
        title: config.title || "Default Title",
        description: config.description || "Default Description",
        icons: {
          icon: config.logo,
          shortcut: config.logo, // ไฟล์ที่ใช้เป็น shortcut icon
           apple: config.logo, // ไฟล์สำหรับ Apple devices
        },
      };
    }
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }

  // กรณีเกิดข้อผิดพลาดหรือไม่มีข้อมูล
  return {
    title: "Fallback Title",
    description: "Fallback Description",
  };
}



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://atugatran.github.io/FontAwesome6Pro/css/all.min.css"
        />
      </head>
      <body
        className={`antialiased`}
      >
        <UserProvider>
          <Theme appearance="dark">
            <Toaster position="bottom-center" />
            {children}
            <Footer />
          </Theme>
        </UserProvider>
      </body>
    </html>
  );
}
