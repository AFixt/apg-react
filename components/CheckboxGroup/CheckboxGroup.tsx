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
import React, { useId, useState, useEffect } from "react";
import Checkbox from "../Checkbox/Checkbox";
import "./CheckboxGroup.css";

interface CheckboxGroupItem {
    id: string;
    label: string;
}

interface CheckboxGroupProps {
    items: CheckboxGroupItem[];
    label: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ items, label }) => {
    const uid = useId();
    const groupLabelId = `checkbox-group-label-${uid}`;
    const [checkedItems, setCheckedItems] = useState(
        new Array(items.length).fill(false)
    );
    const [groupState, setGroupState] = useState<boolean | null>(false);

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

    const handleCheckboxChange = (index: number) => {
        setCheckedItems(
            checkedItems.map((item, idx) => (idx === index ? !item : item))
        );
    };

    return (
        <div className="checkbox-group" role="group" aria-labelledby={groupLabelId}>
            <h3 id={groupLabelId}>{label}</h3>
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

export default CheckboxGroup;
