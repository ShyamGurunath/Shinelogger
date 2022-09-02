import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect} from "react";
import { motion } from 'framer-motion';

const InitPage : NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/home');
        }, 3000);
    });
    return (
        <div className="w-screen h-screen bg-gray-900">
            <div className="flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <img src="/logo.png" alt="logo" className="w-50 h-50"/>
                    <motion.h1
                        animate={{  opacity: 1, scale: 1 }}
                        transition={{
                            duration: 1,
                            delay: 0.3,
                            ease: [0.5, 0.71, 1, 1.5],
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ scale: 1.2 }}
                        className="text-white text-3xl font-bold mt-5"
                    >
                        ShineLogger Studio
                    </motion.h1>
                </div>
            </div>
        </div>
    )
}

export default InitPage;