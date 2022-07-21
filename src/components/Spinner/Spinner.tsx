import ClipLoader from "react-spinners/ClipLoader";
import classNames from "classnames";
import "./spinner.scss";

export interface SpinnerProps {
    readonly invert?: boolean,
    readonly color?: string,
    readonly small?: boolean,
    readonly size?: number,
    readonly containerClass?: string,
}

const Spinner = ({ color, size, small = false, containerClass, invert = false }: SpinnerProps) => {
    return (
        <div className={classNames("spinner-container", containerClass)}>
            <ClipLoader color={color ?? (invert ? "#FFFFFF" : "#13A68A")}
                        loading={true}
                        size={size ?? (small ? 20 : 60)}/>
        </div>
    );
};

export default Spinner;
