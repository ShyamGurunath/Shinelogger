import Image from "next/image";
import {useRouter} from "next/router";

// A header with Title & logo using Tailwind CSS
const Header = () => {

    const router = useRouter();

    const handleIconNameClick = () => {
        router.push("/home");
    }

    const handleLandinPageClick = () => {
        router.push("/");
    }

    return (
        <div className="flex justify-between items-center bg-gray-900">
            <div className="flex items-center">
                <Image src="/logo.png" alt="logo" width={100} height={100} onClick={handleLandinPageClick} className="cursor-pointer"  />
                <span className="ml-1 text-3xl font-bold text-white cursor-pointer" style={{fontFamily:"times"}} onClick={handleIconNameClick}>ShineLogger Studio</span>
            </div>
        </div>
    )


}

export default Header;