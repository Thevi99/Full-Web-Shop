"use client";

import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import Link from "next/link";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({});

  useEffect(() => {
    const fetchConfigSetting = async () => {
      try {
        const response = await axios.get(`/api/config`);
          console.log(response.data);
          setConfig(response.data);
      } catch (error) {
          console.error("Error fetching config settings:", error);
      } finally {
        setLoading(false);
      }
  };
    const fetchDataAPI = async () => {
      try {
        const response = await axios.get("/api/faq", {
          headers: {
            "Cache-Control": "no-cache", // ป้องกันการใช้แคช
          },
        });
        console.log(response.data);

        // ตรวจสอบว่า DataFeatures มีข้อมูลหรือไม่
        if (response.data && response.data.DataTarget) {
            setData(response.data.DataTarget);
        } else {
          console.error("No features found in the response");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchConfigSetting();
    fetchDataAPI();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-purple-400">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="text-center text-white">ไม่มีหมวดหมู่ในขณะนี้</p>;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #1e3a8a, #000000)",
        color: "white",
      }}
    >
      <Nav />
      <div className="relative z-10 container mx-auto pt-28 pb-24 px-4">
        <div className="flex justify-center mb-8">
          <div className="animate__animated animate__faster animate__zoomIn">
            <h1 className="text-8xl w-fit font-bold text-blue-500 -skew-x-12 tracking-tighter">
              RoyX
            </h1>
            <p className="text-2xl w-fit font-bold uppercase -skew-x-12 -translate-y-4 translate-x-8 tracking-[10px]">
              FAQ
            </p>
          </div>
        </div>
        <h1 className="text-center text-2xl font-bold mb-8 animate__animated animate__faster animate__zoomIn">วีธีการ<span className="text-blue-500 allowFullScreen">ใช้งานเว็บไซต์</span></h1>
        <div className="flex justify-center mb-6"><iframe className="w-[960px] h-[540px]" src={"https://www.youtube.com/embed/6HVy1sW6lVA"} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen=""></iframe></div>
        {data.map((item, index) => (
          <div key={index} className="space-y-16">
            <Accordion type="single" collapsible>
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
