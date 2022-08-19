import classnames from "classnames";
import {FC} from "react";

export type ButtonProps = {
    label: string;
    onClick? : () => void;
    backgroundcolor: string;
}

const Button: FC<ButtonProps> = ({ label, onClick, backgroundcolor }) => {
    const buttonclass = classnames(backgroundcolor, 'rounded', 'p-4', 'text-3xl');
    return (
        <button
            onClick={onClick}
            className={`bg-${backgroundcolor}-500 text-white font-bold py-2 px-4 rounded`}>
            {label}
        </button>
    )
}


export default Button;

