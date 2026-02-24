import React from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import "./Newsletter.css";

const Newsletter = () => {
    return (
        <section className="newsletter-section">
            <div className="newsletter-container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="newsletter-card"
                >
                    <div className="newsletter-info">
                        <h2 className="newsletter-title">Join our inner circle</h2>
                        <p className="newsletter-subtitle">
                            Get exclusive access to new drops, secret sales, and adventure inspiration.
                        </p>
                    </div>

                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="newsletter-input-group">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="newsletter-input"
                                required
                            />
                            <button type="submit" className="newsletter-button">
                                Subscribe <Send size={18} />
                            </button>
                        </div>
                        <p className="newsletter-privacy">
                            By subscribing, you agree to our <a href="/privacy">Privacy Policy</a>
                        </p>
                    </form>

                    {/* Abstract blobs for decor */}
                    <div className="newsletter-blob blob-1"></div>
                    <div className="newsletter-blob blob-2"></div>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
