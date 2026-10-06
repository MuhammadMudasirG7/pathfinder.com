import React from "react";
import { Dropdown } from "primereact/dropdown";

function DurationPicker({ value = {}, onChange }) {

    const months = [
        { label: "Jan", value: "01" },
        { label: "Feb", value: "02" },
        { label: "Mar", value: "03" },
        { label: "Apr", value: "04" },
        { label: "May", value: "05" },
        { label: "Jun", value: "06" },
        { label: "Jul", value: "07" },
        { label: "Aug", value: "08" },
        { label: "Sep", value: "09" },
        { label: "Oct", value: "10" },
        { label: "Nov", value: "11" },
        { label: "Dec", value: "12" },
    ];

    const currentYear = new Date().getFullYear();

    const years = Array.from(
        { length: 50 },
        (_, index) => {
            const year = currentYear - index;

            return {
                label: String(year),
                value: String(year)
            };
        }
    );

    const handleChange = (name, selectedValue) => {
        onChange?.({
            ...value,
            [name]: selectedValue
        });
    };

    return (
        <div className="duration-picker">

            {/* FROM MONTH */}
            <Dropdown
                value={value.fromMonth || null}
                options={months}
                optionLabel="label"  
                optionValue="value"
                placeholder="Month"
                onChange={(e) =>
                    handleChange("fromMonth", e.value)
                }
                className="duration-dropdown"
                panelClassName="duration-dropdown-panel"
            />

            {/* FROM YEAR */}
            <Dropdown
                value={value.fromYear || null}
                options={years}
                optionLabel="label"
                optionValue="value"
                placeholder="Year"
                onChange={(e) =>
                    handleChange("fromYear", e.value)
                }
                className="duration-dropdown"
                panelClassName="duration-dropdown-panel"
            />

            {/* TO */}
            <span className="duration-to">
                To
            </span>

            {/* TO MONTH */}
            <Dropdown
                value={value.toMonth || null}
                options={months}
                optionLabel="label"
                optionValue="value"
                placeholder="Month"
                onChange={(e) =>
                    handleChange("toMonth", e.value)
                }
                className="duration-dropdown"
                panelClassName="duration-dropdown-panel"
            />

            {/* TO YEAR */}
            <Dropdown
                value={value.toYear || null}
                options={years}
                optionLabel="label"
                optionValue="value"
                placeholder="Year"
                onChange={(e) =>
                    handleChange("toYear", e.value)
                }
                className="duration-dropdown"
                panelClassName="duration-dropdown-panel"
            />

        </div>
    );
}

export default DurationPicker;


