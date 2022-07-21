export interface Word {
    text: string,
    groupId: string
}

export interface SelectOption {
    label: string,
    value: string
}

export type WithClassname<T> = T & { className?: string }
