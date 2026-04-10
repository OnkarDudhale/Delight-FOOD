import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const orderId = searchParams.get("orderId");

                if (!orderId) {
                    toast.error("Invalid payment");
                    return navigate("/cart");
                }

                toast.success("Payment successful 🎉");

                setTimeout(() => {
                    navigate("/orders");
                }, 1500);

            } catch (error) {
                console.log(error);
                toast.error("Verification failed");

                setTimeout(() => {
                    navigate("/cart");
                }, 1500);
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            {loading ? (
                <>

                    <div className="w-12 h-12 border-4 border-t-transparent border-[tomato] rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Verifying your payment...</p>
                </>
            ) : (
                <p className="text-gray-600">Redirecting...</p>
            )}
        </div>
    );
};

export default Verify;