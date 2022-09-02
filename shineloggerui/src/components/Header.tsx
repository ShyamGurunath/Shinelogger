import Image from "next/image";

// A header with Title & logo using Tailwind CSS
const Header = () => {

    return (
        <div className="flex justify-between items-center bg-gray-900">
            <div className="flex items-center">
                <Image src="/logo.png" alt="logo" width={100} height={100} />
                <span className="ml-1 text-xl font-bold text-white">ShineLogger Studio</span>
            </div>
        </div>
    )


}

export default Header;