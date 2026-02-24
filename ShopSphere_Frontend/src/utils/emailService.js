import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_0a1vbhw";
const TEMPLATE_ID = "template_j4gsffe";
const PUBLIC_KEY = "Ch-Wgw8L8R5zWGNme";

/**
 * Send order confirmation email using the EmailJS SDK.
 * The SDK handles CORS and network issues internally.
 */
export const sendOrderConfirmationEmail = async (orderData) => {
    try {
        const {
            email,
            orderNumber,
            items,
            subtotal,
            tax,
            shipping,
            total,
            address,
            paymentMode
        } = orderData;

        // Format items list for the email body
        const itemsList = items.map(item =>
            `${item.name} x ${item.quantity} - Rs.${item.price}`
        ).join("\n");

        const templateParams = {
            email: email,
            order_id: orderNumber,
            order_items: itemsList,
            subtotal: `Rs.${subtotal.toFixed(2)}`,
            tax: `Rs.${tax.toFixed(2)}`,
            shipping: shipping === 0 ? "FREE" : `Rs.${shipping.toFixed(2)}`,
            total_amount: `Rs.${total.toFixed(2)}`,
            customer_name: address?.name || "Customer",
            shipping_address: `${address?.address || ""}, ${address?.city || ""}, ${address?.state || ""} - ${address?.pincode || ""}`,
            payment_mode: paymentMode,
        };

        console.log("Sending order confirmation email to:", email);

        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );

        console.log("Order confirmation email sent successfully!", response.status, response.text);
        return response;
    } catch (error) {
        console.error("EmailJS Error:", {
            status: error?.status,
            text: error?.text,
            message: error?.message
        });
        throw error;
    }
};
