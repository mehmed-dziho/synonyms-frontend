import { CSSProperties } from "react";
import { Utils } from "../utils/utils";

export interface Word {
    text: string,
    groupId: string
}

export interface WordOption {
    label: string,
    value: string,
    groupId: string
}

export type WithStyle<T> = T & { style?: CSSProperties }
export type WithClassname<T> = T & { className?: string }
export type WithStyleAndClassname<T> = T & WithStyle<T> & WithClassname<T>

export class WordUtils {

    static isWordValid(word: string) {
        return Utils.onlyLetters(word);
    }
}
