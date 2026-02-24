import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ShoppingBag, Smartphone, Watch, Headphones, Laptop,
    Shirt, Footprints, Gift, CreditCard, Globe,
    Camera, Zap, Tag, Truck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const [fadeOut, setFadeOut] = useState(false);
    const [zoomOut, setZoomOut] = useState(false);
    const [exit, setExit] = useState(false); // ✅ NEW
    const navigate = useNavigate();

    // // 
    // useEffect(() => {
    //     // 🔒 Only run landing logic when user is ACTUALLY on "/"
    //     if (window.location.pathname !== "/") return;

    //     const fadeTimer = setTimeout(() => setFadeOut(true), 4200);
    //     const zoomTimer = setTimeout(() => setZoomOut(true), 4600);

    //     const navigateTimer = setTimeout(() => {
    //         sessionStorage.setItem("hasSeenLanding", "true");
    //         navigate("/home", { replace: true });

    //         setTimeout(() => setExit(true), 300);
    //     }, 5400);

    //     return () => {
    //         clearTimeout(fadeTimer);
    //         clearTimeout(zoomTimer);
    //         clearTimeout(navigateTimer);
    //     };
    // }, [navigate]);
    useEffect(() => {
        const timer = setTimeout(() => {
            sessionStorage.setItem("hasSeenLanding", "true");
            navigate("/home", { replace: true });
        }, 5200);

        return () => clearTimeout(timer);
    }, [navigate]);



    if (exit) return null;

    const products = [
        ShoppingBag, Smartphone, Watch, Headphones, Laptop,
        Shirt, Footprints, Gift, CreditCard, Globe,
        Camera, Zap, Tag, Truck
    ];

    const MarqueeRow = ({ direction = "left", speed = 30 }) => (
        <div className="flex w-full overflow-hidden py-10 opacity-75">
            <motion.div
                className="flex gap-20 shrink-0"
                initial={{ x: direction === "left" ? 0 : "-50%" }}
                animate={{ x: direction === "left" ? "-50%" : 0 }}
                transition={{ repeat: Infinity, ease: "linear", duration: speed }}
            >
                {[...products, ...products, ...products].map((Icon, index) => (
                    <Icon
                        key={index}
                        size={75}
                        strokeWidth={1}
                        className="text-orange-300/40"
                    />
                ))}
            </motion.div>
        </div>
    );

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-[#0d0415] flex items-center justify-center
            transition-opacity duration-300
            ${fadeOut ? "opacity-0" : "opacity-100"}`}
        >
            {/* Background Icons */}
            <div
                className={`absolute inset-0 flex flex-col justify-center space-y-14 rotate-[-5deg] scale-110
                transition-transform duration-1000
                ${zoomOut ? "scale-150" : ""}`}
            >
                <MarqueeRow direction="left" speed={32} />
                <MarqueeRow direction="right" speed={38} />
                <MarqueeRow direction="left" speed={28} />
                <MarqueeRow direction="right" speed={42} />
            </div>

            <div className="absolute inset-0 bg-[#0d0415]/60" />

            <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 30 }}
                animate={{
                    scale: zoomOut ? 7 : 1,
                    opacity: fadeOut ? 0 : 1,
                    y: 0
                }}
                transition={{
                    duration: zoomOut ? 1.2 : 2.2,
                    ease: "easeInOut"
                }}
                className="relative z-10 flex flex-col items-center"
            >
                <img
                    src="/s_logo.png"
                    alt="ShopSphere Logo"
                    className="w-64 h-64 md:w-80 md:h-80 object-contain
                    drop-shadow-[0_0_45px_rgba(249,115,22,0.6)]"
                />

                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "10rem", opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1.4 }}
                    className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                />
            </motion.div>
        </div>
    );
};

export default LandingPage