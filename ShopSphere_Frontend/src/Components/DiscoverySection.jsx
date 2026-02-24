import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./DiscoverySection.css";

const DiscoverySection = () => {
    const images = [
        {
            id: 1,
            url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
            className: "col-span-1 row-span-1",
            title: "Smart Tech",
        },
        {
            id: 2,
            url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2070&auto=format&fit=crop",
            className: "col-span-1 row-span-2",
            title: "Modern Home",
        },
        {
            id: 3,
            url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070&auto=format&fit=crop",
            className: "col-span-2 row-span-2",
            title: "E-Mobility",
        },
        {
            id: 4,
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
            className: "col-span-1 row-span-1",
            title: "Premium Audio",
        },
    ];

    return (
        <section className="discovery-section-wrapper">
            <div className="discovery-container">
                <div className="discovery-content">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="discovery-text-column"
                    >
                        <h2 className="discovery-title">
                            <span className="text-yellow-400 underline decoration-orange-400">Discover</span> ideas and inspiration for your next adventure.
                        </h2>
                        <p className="discovery-description">
                            Explore our curated selection of premium products designed to elevate your lifestyle and fuel your passions.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="discovery-cta"
                        >
                            Start exploring <ArrowRight size={20} />
                        </motion.button>
                    </motion.div>

                    <div className="discovery-grid-column">
                        <div className="discovery-grid">
                            {images.map((img, index) => (
                                <motion.div
                                    key={img.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`discovery-grid-item ${img.className}`}
                                >
                                    <div className="discovery-image-wrapper">
                                        <img
                                            src={img.url}
                                            alt={img.title}
                                            className="discovery-image"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop";
                                            }}
                                        />
                                        <div className="discovery-image-overlay">
                                            <span className="discovery-image-label">{img.title}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DiscoverySection;
