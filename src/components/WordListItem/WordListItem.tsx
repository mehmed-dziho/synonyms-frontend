import React, { useRef, useState } from "react";
import { WithClassname, Word, WordUtils } from "../../types/types";
import "./word_list_item.scss";
import GIcon from "../GIcon/GIcon";
import { Utils } from "../../utils/utils";
import classNames from "classnames";
import InputField from "../Input/InputField";
import { WordsApi } from "../../api/words";
import useHover from "../../utils/hooks/useHover";
import { SwalUtils } from "../../utils/swal_utils";

interface WordListItemProps {
    word: Word;
    onSuccessEdit?: (originalName: string, word: Word) => void;
    onSuccessDelete?: (word: Word) => void;
}

function WordListItem({ word, className, onSuccessEdit, onSuccessDelete }: WithClassname<WordListItemProps>) {

    const [editMode, setEditMode] = useState(false);
    const [text, setText] = useState("");
    const [async, setAsync] = useState(false);

    const onEditWord = () => {

        if (async) {
            return;
        }

        const prepared = text.trim();

        // validate
        if (!WordUtils.isWordValid(prepared)) {
            SwalUtils.showWarningSwalToast("Word can only contains letters.");
            return;
        }

        setAsync(true);

        WordsApi.editWord(word, prepared)
            .then(r => {
                if (onSuccessEdit && r) {
                    onSuccessEdit(word.text, r);
                    setEditMode(false);
                    setText("");
                }
            }).finally(() => setAsync(false));
    };

    const onDeleteWord = () => {

        if (async) {
            return;
        }

        setAsync(true);
        WordsApi.deleteWord(word)
            .then(() => {
                if (onSuccessDelete) {
                    onSuccessDelete(word);
                }
            }).finally(() => setAsync(false))
    };

    const ref = useRef(null);
    const isHovered = useHover(ref);

    return (
        <div className={classNames("word-list-item", className, isHovered && "is-hovered")} ref={ref}>
            {editMode ? (
                <InputField value={text}
                            autoFocus
                            onKeyDown={event => {
                                if (event.code === "Enter") {
                                    onEditWord();
                                } else if (event.code === "Escape") {
                                    setEditMode(false);
                                }
                            }}
                            onChange={(e) => setText(e.target.value)}/>
            ) : (
                <span className="text-lg word-text">{Utils.capitalize(word.text)}</span>
            )}
            <div className="flex">
                {editMode ? (
                    <>
                        <GIcon icon={"check_circle"}
                               size={25}
                               className="confirm-synonym-btn ml-2"
                               onClick={onEditWord}
                        />
                        <GIcon icon={"cancel"}
                               size={25}
                               className="cancel-synonym-btn ml-1"
                               onClick={() => {
                                   setEditMode(false);
                                   setText("");
                               }}
                        />
                    </>
                ) : (
                    <div className="">
                        <GIcon icon={"edit"} className="mr-1 edit-btn" size={25} onClick={() => {
                            setEditMode(true);
                            setText(Utils.capitalize(word.text));
                        }}/>
                        <GIcon icon={"delete"}
                               className="delete-btn"
                               onClick={onDeleteWord}
                               size={25}/>
                    </div>
                )}

            </div>
        </div>
    );
}

export default WordListItem;