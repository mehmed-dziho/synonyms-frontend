export class Utils {

    static capitalize(text: string) {

        if (!text?.length) {
            return text;
        }

        return text[0].toUpperCase() + text.slice(1);
    }

    static onlyLetters(str: string) {
        return /^[a-zA-Z]+$/.test(str);
    }
}