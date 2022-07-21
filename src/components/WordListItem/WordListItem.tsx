import React from "react";
import { Word } from "../../types/types";
import "./word_list_item.scss";

interface WordListItemProps {
    word: Word;
}

function WordListItem({ word }: WordListItemProps) {
    return (
        <div className="word-list-item">
            {word.text}
        </div>
    );
}

export default WordListItem;