import React, { MouseEventHandler } from "react";
import classnames from "classnames";
import { WithStyleAndClassname } from "../../types/types";
import "./gicon.scss";

export interface GIconProps {
    icon: string
    outlined?: boolean
    size?: number
    color?: string
    readonly onClick?: MouseEventHandler<HTMLButtonElement>,
}

function GIcon({ icon, className, outlined = true, style, size, color, onClick }: WithStyleAndClassname<GIconProps>) {

    const classNames = classnames("g-icon", outlined ? "material-icons-outlined" : "material-icons", className);

    return (
        <span className={classNames} style={{ ...style, fontSize: size + "px", color: color }} onClick={onClick}>
            {icon}
        </span>
    );
}

export default GIcon;