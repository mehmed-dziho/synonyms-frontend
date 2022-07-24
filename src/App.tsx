import React, { useEffect, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { WordOption, Word, WordUtils } from "./types/types";
import { debounce } from "lodash";
import { WordsApi } from "./api/words";
import { Utils } from "./utils/utils";
import WordListItem from "./components/WordListItem/WordListItem";
import Button from "./components/Button/Button";
import InputField from "./components/Input/InputField";
import GIcon from "./components/GIcon/GIcon";
import { SwalUtils } from "./utils/swal_utils";
import { components, OptionProps } from "react-select";

function App() {

    const [selectedWord, setSelectedWord] = useState<Word | null>(null);
    const [synonyms, setSynonyms] = useState<Word[]>([]);
    const [loadingSynonyms, setLoadingSynonyms] = useState(false);
    const [addingSynonym, setAddingSynonym] = useState(false);
    const [newSynonym, setNewSynonym] = useState("");
    const [submitAsync, setSubmitAsync] = useState(false);

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

        if (submitAsync) {
            return;
        }

        const prepared = word.trim();

        // validate
        if (!WordUtils.isWordValid(prepared)) {
            SwalUtils.showWarningSwalToast("Word can only contains letters.");
            return;
        }

        setSubmitAsync(true);
        WordsApi.addWord(prepared)
            .then(r => {
                if (r) {
                    setSelectedWord(r);
                }
            }).finally(() => setSubmitAsync(false));
    };

    const onSuccessEditSelectedWord = (originalName: string, word: Word) => {

        if (selectedWord) {
            setSelectedWord({
                text: word.text,
                groupId: selectedWord.groupId
            });
        }
    };

    const onSuccessDeleteWord = () => {
        setSelectedWord(null);
    };


    const handleCreateSynonym = () => {

        if (submitAsync) {
            return;
        }

        const prepared = newSynonym.trim();

        // validate
        if (!WordUtils.isWordValid(prepared)) {
            SwalUtils.showWarningSwalToast("Synonym can only contains letters.");
            return;
        }

        setSubmitAsync(true);
        WordsApi.addWord(prepared, selectedWord?.groupId)
            .then(r => {
                if (r) {
                    setSynonyms([...synonyms, r]);
                    setAddingSynonym(false);
                    setNewSynonym("");
                }
            }).finally(() => setSubmitAsync(false));
    };

    const onSuccessEditSynonym = (originalName: string, word: Word) => {
        const clone = [...synonyms];

        const synonym = clone.find(s => s.text === originalName);

        if (synonym) {
            synonym.text = word.text;
            setSynonyms(clone);
        }
    };

    const onSuccessDeleteSynonym = (word: Word) => {
        const clone = [...synonyms];

        const idx = clone.findIndex(s => s.text === word.text);

        if (idx !== -1) {
            clone.splice(idx, 1);
            setSynonyms(clone);
        }
    };

    useEffect(() => {

        // fetch synonyms for selected word
        if (selectedWord) {
            setLoadingSynonyms(true);
            WordsApi.fetchSynonyms(selectedWord.text)
                .then(r => {
                    if (r) {
                        setSynonyms(r);
                    }
                })
                .finally(() => setLoadingSynonyms(false));
        }
    }, [selectedWord]);

    const CustomOptionComponent = ({ children, ...props }: OptionProps<WordOption, false>) => {
        const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
        const newProps = Object.assign(props, { innerProps: rest });
        return (
            <components.Option
                {...newProps}
                className="custom-option"
            >
                {children}
            </components.Option>
        );
    };

    return (
        <div className="App">
            <span className="text-2xl font-bold w-full text-center">Synonyms App</span>
            <AsyncCreatableSelect
                className="mt-4"
                components={{
                    Option: CustomOptionComponent         // override to increase performance
                }}
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
                filterOption={null}                             // performance boost on large sets
                placeholder={"Search and select a word"}/>
            {selectedWord && (
                <div className="flex flex-col flex-1 mt-4">

                    <WordListItem word={selectedWord}
                                  onSuccessEdit={onSuccessEditSelectedWord}
                                  onSuccessDelete={onSuccessDeleteWord}
                                  className="selected-word"/>
                    {/*<span className="text-xl font-bold">{Utils.capitalize(selectedWord.text)}</span>*/}

                    {loadingSynonyms ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="flex flex-col flex-1 mt-4 l">
                            {synonyms.length > 0 ? (
                                <div className="flex flex-col flex-1">
                                    <div className="text-xl mb-4 text-gray-color synonyms-label">
                                        Synonyms
                                    </div>
                                    <div className="basis-0 flex-grow overflow-y-auto">
                                        {synonyms.map(synonym => <WordListItem word={synonym}
                                                                               key={synonym.text}
                                                                               onSuccessEdit={onSuccessEditSynonym}
                                                                               onSuccessDelete={onSuccessDeleteSynonym}
                                                                               className="mb-2"/>)}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-color">No synonyms found for selected word.</div>
                            )}

                            <div className="mt-4">
                                {addingSynonym ? (
                                    <div className="flex items-center justify-between">
                                        <InputField
                                            value={newSynonym}
                                            autoFocus
                                            onKeyDown={event => {
                                                if (event.code === "Enter") {
                                                    handleCreateSynonym();
                                                } else if (event.code === "Escape") {
                                                    setAddingSynonym(false);
                                                }
                                            }}
                                            placeholder={"New synonym..."}
                                            onChange={e => {
                                                setNewSynonym(e.target.value);
                                            }}/>
                                        <div>
                                            <GIcon icon={"check_circle"}
                                                   size={25}
                                                   className="confirm-synonym-btn ml-2"
                                                   onClick={handleCreateSynonym}
                                            />
                                            <GIcon icon={"cancel"}
                                                   size={25}
                                                   className="cancel-synonym-btn ml-1"
                                                   onClick={() => setAddingSynonym(false)}
                                            />
                                        </div>
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
