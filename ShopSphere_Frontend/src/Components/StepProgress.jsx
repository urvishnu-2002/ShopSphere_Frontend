import React from "react";
import { Check } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Step definitions
 */
const steps = [
    {
        title: "Account verification",
        routes: ["/account-verification", "/verify-otp"],
    },
    {
        title: "Verify Tax Details",
        routes: ["/verifyGST", "/verifyPAN"],
    },
    {
        title: "Store Name",
        routes: ["/store-name"],
    },
    {
        title: "Shipping & Pickup",
        routes: [
            "/shipping-address",
            "/shipping-method",
            "/shipping-fee-preferences",
        ],
    },
    {
        title: "Bank Details",
        routes: ["/bank-details"],
    },
];

export default function StepProgress() {
    const location = useLocation();
    const currentPath = location.pathname;

    let currentStepIndex = steps.findIndex(step =>
        step.routes.some(route => currentPath.startsWith(route))
    );

    /**
     * 🔑 FORCE STEP 1 for account verification flow
     */
    if (
        currentPath.startsWith("/account-verification") ||
        currentPath.startsWith("/verify-otp")
    ) {
        currentStepIndex = 0;
    }

    /**
     * SAFETY FALLBACK
     */
    if (currentStepIndex === -1) {
        currentStepIndex = 0;
    }


    const activeIndex = currentStepIndex;

    return (
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-10 px-4">
            {steps.map((step, index) => {
                const isCompleted = index < activeIndex;
                const isActive = index === activeIndex;

                return (
                    <div
                        key={step.title}
                        className={`flex items-center ${index !== steps.length - 1 ? "w-full" : ""
                            }`}
                    >
                        {/* Step Circle */}
                        <div className="flex flex-col items-center relative">
                            <motion.div
                                initial={false}
                                animate={{
                                    backgroundColor:
                                        isCompleted || isActive
                                            ? "#fb923c"
                                            : "#ffffff",
                                    borderColor:
                                        isCompleted || isActive
                                            ? "#fb923c"
                                            : "#fed7aa",
                                    scale: isActive ? 1.1 : 1,
                                }}
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 z-10
                                ${isCompleted || isActive
                                        ? "text-white"
                                        : "text-orange-300"
                                    }`}
                            >
                                {isCompleted ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                    >
                                        <Check size={20} strokeWidth={3} />
                                    </motion.div>
                                ) : (
                                    <span className="text-sm font-bold">
                                        {index + 1}
                                    </span>
                                )}
                            </motion.div>

                            <span
                                className={`absolute -bottom-7 whitespace-nowrap text-xs font-semibold transition-colors duration-300
                                ${isActive
                                        ? "text-orange-400"
                                        : isCompleted
                                            ? "text-gray-500"
                                            : "text-gray-400"
                                    }`}
                            >
                                {step.title}
                            </span>
                        </div>

                        {/* Progress Line */}
                        {index !== steps.length - 1 && (
                            <div className="flex-1 h-1 bg-orange-100 mx-2 relative overflow-hidden rounded-full">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{
                                        width: isCompleted ? "100%" : "0%",
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: "easeInOut",
                                    }}
                                    className="h-full bg-gradient-to-r from-orange-400 to-purple-500 rounded-full"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
