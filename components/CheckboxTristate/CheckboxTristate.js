/**
 * Represents a tri-state checkbox group component.
 *
 * @component
 * @param {Object[]} items - The array of items for the checkbox group.
 * @param {string} items[].id - The unique identifier for each item.
 * @param {string} items[].label - The label for each item.
 * @param {string} label - The label for the checkbox group.
 * @returns {JSX.Element} The rendered tri-state checkbox group component.
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Checkbox from "./Checkbox";
import "./CheckboxGroup.css";

const TriStateCheckboxGroup = ({ items, label }) => {
    const [checkedItems, setCheckedItems] = useState(
        new Array(items.length).fill(false)
    );
    const [groupState, setGroupState] = useState(false);

    useEffect(() => {
        const allChecked = checkedItems.every(Boolean);
        const someChecked = checkedItems.some(Boolean);
        setGroupState(allChecked ? true : someChecked ? null : false);
    }, [checkedItems]);

    const handleGroupCheckboxChange = () => {
        if (groupState === true) {
            setCheckedItems(checkedItems.map(() => false));
        } else {
            setCheckedItems(checkedItems.map(() => true));
        }
    };

    const handleCheckboxChange = (index) => {
        setCheckedItems(
            checkedItems.map((item, idx) => (idx === index ? !item : item))
        );
    };

    return (
        <div role="group" aria-labelledby="group-label">
            <h3 id="group-label">{label}</h3>
            <Checkbox
                label="All"
                checked={groupState}
                onChange={handleGroupCheckboxChange}
                isTriState={true}
            />
            {items.map((item, index) => (
                <Checkbox
                    key={item.id}
                    label={item.label}
                    checked={checkedItems[index]}
                    onChange={() => handleCheckboxChange(index)}
                />
            ))}
        </div>
    );
};

TriStateCheckboxGroup.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    label: PropTypes.string.isRequired,
};

export default TriStateCheckboxGroup;
