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
    const navigate = useNavigate();

    useEffect(() => {
        // Start fade
        const fadeTimer = setTimeout(() => setFadeOut(true), 4200);

        // Start full zoom
        const zoomTimer = setTimeout(() => setZoomOut(true), 4600);

        // Navigate AT PEAK ZOOM
        const navigateTimer = setTimeout(() => {
            navigate("/home");
        }, 5400);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(zoomTimer);
            clearTimeout(navigateTimer);
        };
    }, []);

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
                        className="text-violet-300/40"
                    />
                ))}
            </motion.div>
        </div>
    );

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-[#0d0415] flex items-center justify-center
      transition-opacity duration-1000 ease-in-out
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

            {/* Overlay */}
            <div className="absolute inset-0 bg-[#0d0415]/60" />

            {/* Glow */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-900/30 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[140px]" />
            </div>

            {/* LOGO */}
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
          drop-shadow-[0_0_45px_rgba(139,92,246,0.6)]"
                />

                {/* Loading line */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "10rem", opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1.4 }}
                    className="mt-3 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                />
            </motion.div>
        </div>
    );
};

export default LandingPage;
