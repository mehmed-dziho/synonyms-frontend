import React, { useRef, useState } from "react";
import { WithClassname, Word } from "../../types/types";
import "./word_list_item.scss";
import GIcon from "../GIcon/GIcon";
import { Utils } from "../../utils/utils";
import classNames from "classnames";
import InputField from "../Input/InputField";
import { API } from "../../api/api";
import { WordsApi } from "../../api/words";
import useHover from "../../utils/hooks/useHover";

interface WordListItemProps {
    word: Word;
}

function WordListItem({ word, className }: WithClassname<WordListItemProps>) {

    const [editMode, setEditMode] = useState(false);
    const [text, setText] = useState("");

    const onEditWord = () => {
        WordsApi.editWord(word, text)
            .then(r => {
                console.log(r);
                // TODO, update synonyms array in App
            });
    };

    const ref = useRef(null);
    const isHovered = useHover(ref);

    return (
        <div className={classNames("word-list-item", className, isHovered && "is-hovered")} ref={ref}>
            {editMode ? (
                <InputField value={text}
                            onChange={(e) => setText(e.target.value)}/>
            ) : (
                <span className="text-lg">{Utils.capitalize(word.text)}</span>
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
                        <GIcon icon={"delete"} className="delete-btn" size={25}/>
                    </div>
                )}

            </div>
        </div>
    );
}

export default WordListItem;