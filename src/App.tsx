import React, { useCallback, useEffect, useMemo, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { WordOption, Word } from "./types/types";
import { debounce } from "lodash";
import { WordsApi } from "./api/words";
import { Utils } from "./utils/utils";
import WordListItem from "./components/WordListItem/WordListItem";
import Button from "./components/Button/Button";
import InputField from "./components/Input/InputField";
import GIcon from "./components/GIcon/GIcon";

function App() {

    const [selectedWord, setSelectedWord] = useState<Word | null>(null);
    const [synonyms, setSynonyms] = useState<Word[]>([]);
    const [loadingSynonyms, setLoadingSynonyms] = useState(false);
    const [addingSynonym, setAddingSynonym] = useState(false);
    const [newSynonym, setNewSynonym] = useState("");

    const fetchWords = (input: string, callback: (options: WordOption[]) => void) => {
        WordsApi.fetchWords(input).then(r => {
            callback(r ? r.map(word => ({
                value: word.text,
                label: Utils.capitalize(word.text),
                groupId: word.groupId
            })) : []);
        });
    };

    const fetchWordsDebounced = debounce(fetchWords, 300);

    const onClickCreateWord = (word: string) => {
        WordsApi.addWord(word)
            .then(r => {
                if (r) {
                    setSelectedWord(r);
                }
            });
    };

    const onClickCreateSynonym = () => {
        WordsApi.addWord(newSynonym, selectedWord?.groupId)
            .then(r => {
                if (r) {
                    setSynonyms([...synonyms, r]);
                    setAddingSynonym(false);
                    setNewSynonym("");
                }
            });
    };

    useEffect(() => {

        // fetch synonyms for selected word
        if (selectedWord) {
            WordsApi.fetchSynonyms(selectedWord.text)
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
                classNamePrefix="select-field"
                value={null}
                loadOptions={fetchWordsDebounced}
                onChange={option => {
                    if (option?.value) {
                        setSelectedWord({
                            text: option.value,
                            groupId: option.groupId
                        });
                    }
                }}
                noOptionsMessage={() => "No words found."}
                onCreateOption={onClickCreateWord}
                placeholder={"Search and select a word"}/>
            {selectedWord && (
                <div className="flex-col mt-4">
                    <span className="text-xl font-bold">{Utils.capitalize(selectedWord.text)}</span>
                    {loadingSynonyms ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="flex-col">
                            {synonyms.length > 0 ? (
                                <div className="flex-col">
                                    <div className="text-xl mt-4 text-gray-color font-bold ">Synonyms:</div>
                                    {synonyms.map(synonym => <WordListItem word={synonym}/>)}
                                </div>
                            ) : (
                                <div className="text-gray-color">No synonyms found for selected word.</div>
                            )}

                            <div className="mt-4">
                                {addingSynonym ? (
                                    <div className="flex items-center">
                                        <InputField
                                            value={newSynonym}
                                            placeholder={"New synonym..."}
                                            onChange={e => {
                                                setNewSynonym(e.target.value);
                                            }}/>
                                        <GIcon icon={"check_circle"}
                                               size={30}
                                               className="confirm-synonym-btn ml-2"
                                               onClick={onClickCreateSynonym}
                                        />
                                        <GIcon icon={"cancel"}
                                               size={30}
                                               className="cancel-synonym-btn ml-1"
                                               onClick={() => setAddingSynonym(false)}
                                        />
                                    </div>
                                ) : (
                                    <Button onClick={() => setAddingSynonym(true)}>
                                        Add new synonym
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
