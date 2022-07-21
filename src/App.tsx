import React, { useCallback, useEffect, useMemo, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { SelectOption, Word } from "./types/types";
import { debounce } from "lodash";
import { WordsApi } from "./api/words";
import { Utils } from "./utils/utils";
import WordListItem from "./components/WordListItem/WordListItem";
import Button from "./components/Button/Button";
import InputField from "./components/Input/InputField";

function App() {

    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [synonyms, setSynonyms] = useState<Word[]>([]);
    const [loadingSynonyms, setLoadingSynonyms] = useState(false);
    const [addingSynonym, setAddingSynonym] = useState(false);

    const fetchWords = (input: string, callback: (options: SelectOption[]) => void) => {
        WordsApi.fetchWords(input).then(r => {
            callback(r ? r.map(word => ({
                value: word.text,
                label: Utils.capitalize(word.text)
            })) : []);
        });
    };

    const fetchWordsDebounced = debounce(fetchWords, 300);

    const onClickCreateWord = (word: string) => {
        WordsApi.addWord(word)
            .then(r => {
                if (r) {
                    setSelectedWord(r.text);
                }
            });
    };

    useEffect(() => {

        // fetch synonyms for selected word
        if (selectedWord) {
            WordsApi.fetchSynonyms(selectedWord)
                .then(r => {
                    if (r) {
                        setSynonyms(r);
                    }
                });
        }
    }, [selectedWord]);

    console.log(synonyms);

    return (
        <div className="App">
            <span className="text-2xl font-bold w-full text-center">Synonyms App</span>
            <AsyncCreatableSelect
                className="mt-4"
                value={null}
                loadOptions={fetchWordsDebounced}
                onChange={option => {
                    if (option?.value) {
                        setSelectedWord(option.value);
                    }
                }}
                noOptionsMessage={() => "No words found."}
                onCreateOption={onClickCreateWord}
                placeholder={"Search and select a word"}/>
            {selectedWord && (
                <div className="flex-col mt-4">
                    <span className="text-xl font-bold">{Utils.capitalize(selectedWord)}</span>
                    {loadingSynonyms ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="flex-col">
                            {synonyms.length > 0 ? (
                                <div className="flex-col">
                                    <div className="text-xl mt-4">Synonyms:</div>
                                    {synonyms.map(synonym => <WordListItem word={synonym}/>)}
                                </div>
                            ) : (
                                <div className="text-gray-color">No synonyms found for selected word.</div>
                            )}

                            {addingSynonym ? (
                                <div className="flex">
                                    <InputField onChange={() => {
                                    }}/>
                                </div>
                            ) : (
                                <Button className="mt-4" onClick={() => setAddingSynonym(true)}>
                                    Add new synonym
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
