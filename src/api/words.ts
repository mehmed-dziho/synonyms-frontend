import { API, ApiMethod } from "./api";
import { Word } from "../types/types";

export class WordsApi {

    static fetchWords(search?: string) {

        const url = new URL(API.words);

        if (search) {
            url.searchParams.append("search", search);
        }

        return API.apiCall<Word[]>({
            url: url.toString()
        });
    }

    static addWord(word: string, groupId?: string) {
        return API.apiCall<Word>({
            url: API.words,
            method: ApiMethod.POST,
            data: {
                word,
                groupId
            }
        });
    }

    static fetchSynonyms(word: string) {

        const url = new URL(`${API.words}/${word}/synonyms`);

        return API.apiCall<Word[]>({
            url: url.toString()
        });
    }

    static editWord(word: Word, newText: string) {

        const url = new URL(`${API.words}/${word.text}`);

        return API.apiCall<Word>({
            url: url.toString(),
            method: ApiMethod.PUT,
            data: {
                text: newText
            }
        });
    }

    static deleteWord(word: Word) {

        const url = new URL(`${API.words}/${word.text}`);

        return API.apiCall({
            url: url.toString(),
            method: ApiMethod.DELETE
        });
    }
}