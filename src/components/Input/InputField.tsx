import * as React from "react";
import classNames from "classnames";
import {
    CSSProperties, HTMLProps,
    useCallback,
    useState,
} from "react";
import { WithClassname } from "../../types/types";
import "./input_field.scss";

export enum InputType {
    Text = "text",
    Password = "password",
    Number = "number",
}

export interface InputProps extends HTMLProps<HTMLInputElement>{
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    labelOutside?: boolean;
    placeholder?: string;
    name?: string,
    value?: string | ReadonlyArray<string> | number | undefined;
    type?: InputType;
    style?: CSSProperties;
    readonly?: boolean,
    error?: string
}


const InputField = React.forwardRef<HTMLInputElement, WithClassname<InputProps>>(({
                                                                                      onChange,
                                                                                      label,
                                                                                      name,
                                                                                      placeholder,
                                                                                      value = "",
                                                                                      type = InputType.Text,
                                                                                      style = {},
                                                                                      readonly = false,
                                                                                      className,
                                                                                      error,
    ...props
                                                                                  }, ref) => {
    const [focused, setIsFocused] = useState(false);
    const toggleFocus = useCallback(() => setIsFocused(!focused), [focused]);

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {

        // any middle validation can be done here

        onChange(e);
    }, [onChange]);

    const renderLabel = () => {
        return <label className={classNames("input-label")}>
            {label}
        </label>;
    };

    return (
        <div className={classNames("input-field", className, {
            readonly,
            focused,
            error,
            filled: Boolean(value)
        })}
             style={style}>
            <div className="input-container">
                {label && (
                    renderLabel()
                )}

                <div className="inner">
                    <input
                        {...props}
                        readOnly={readonly}
                        onInput={onInputChange}
                        ref={ref}
                        onFocus={toggleFocus}
                        onBlur={() => {
                            toggleFocus();
                        }}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        type={type}
                    />
                </div>
            </div>
            {/*{showErrorText && (*/}
            {/*    <div className="input-error">{error}</div>*/}
            {/*)}*/}
        </div>
    );
});

export default InputField;
