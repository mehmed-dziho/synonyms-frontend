import classNames from "classnames";
import * as React from "react";
import Spinner from "../Spinner/Spinner";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";
import './button.scss';

export interface ButtonProps {
    readonly onClick?: MouseEventHandler<HTMLButtonElement>,
    readonly children?: ReactNode,
    readonly style?: CSSProperties,
    readonly className?: string,
    readonly loading?: boolean,
    readonly disabled?: boolean,
    readonly spinnerColor?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
                                                                     onClick,
                                                                     children,
                                                                     style = {},
                                                                     className,
                                                                     loading = false,
                                                                     disabled = false,
                                                                     spinnerColor,
                                                                 }: ButtonProps, ref) => {
    return (
        <button
            className={classNames("synonyms", className, loading && "loading")}
            style={style}
            ref={ref}
            onClick={onClick}
            disabled={disabled || loading}>
            {children}
            {loading && <Spinner size={14} color={spinnerColor}/>}
        </button>
    );
});

export default Button;
