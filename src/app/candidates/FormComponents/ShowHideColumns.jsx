import React, { useState } from 'react';

import {
    Search,
    X,
    GripVertical
} from 'lucide-react';


function ShowHideColumns({
    columns,
    visibleColumn,
    setVisibleColumn,
    onClose
}) {

    const [search, setSearch] = useState('');


    // =====================================================
    // CHECKBOX CHANGE
    // =====================================================

    const handleChange = (key) => {

        setVisibleColumn({

            ...visibleColumn,

            [key]: !visibleColumn[key]

        });

    };


    // =====================================================
    // SELECT ALL
    // =====================================================

    const handleSelectAll = () => {

        const newColumns = {
            ...visibleColumn
        };


        columns.forEach((column) => {

            const key =
                column.visibleKey || column.field;

            newColumns[key] = true;

        });


        setVisibleColumn(newColumns);

    };


    // =====================================================
    // DESELECT ALL
    // =====================================================

    const handleDeselectAll = () => {

        const newColumns = {
            ...visibleColumn
        };


        columns.forEach((column) => {

            const key =
                column.visibleKey || column.field;

            newColumns[key] = false;

        });


        setVisibleColumn(newColumns);

    };


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredColumns = columns.filter((column) =>

        column.header
            .toLowerCase()
            .includes(search.toLowerCase())

    );


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <div
            className="
                fixed
                top-6
                left-10
                z-[9999]
                w-[320px]
                bg-white
                border
                border-gray-200
                rounded-lg
                shadow-xl
            "
        >

            {/* Header */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    border-b
                    border-gray-200
                "
            >

                <span className="text-sm font-medium text-blue-950">

                    Show / Hide Columns

                </span>


                <button
                    onClick={onClose}
                    className="
                        text-gray-500
                        hover:text-gray-800
                        cursor-pointer
                    "
                >

                    <X size={18} />

                </button>

            </div>


            {/* Search */}

            <div className="p-4">

                <div className="relative">

                    <Search
                        size={17}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-500
                        "
                    />


                    <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full
                            h-10
                            pl-10
                            pr-3
                            border
                            border-gray-300
                            rounded-md
                            outline-none
                            text-sm
                        "
                    />

                </div>

            </div>


            {/* Select / Deselect */}

            <div className="flex px-4">

                <button
                    onClick={handleSelectAll}
                    className="
                        flex-1
                        py-2
                        bg-purple-600
                        text-white
                        text-sm
                        font-semibold
                    "
                >

                    Select All

                </button>


                <button
                    onClick={handleDeselectAll}
                    className="
                        flex-1
                        py-2
                        bg-white
                        text-gray-700
                        text-sm
                        border
                        border-gray-300
                    "
                >

                    Deselect All

                </button>

            </div>


            {/* Columns */}

            <div
                className="
                    px-4
                    py-4
                    max-h-[440px]
                    overflow-y-auto
                "
            >

                <div className="flex flex-col gap-2">

                    {filteredColumns.map((column) => {

                        const key =
                            column.visibleKey || column.field;


                        return (

                            <div
                                key={column.field}
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    px-4
                                    py-3
                                    border
                                    border-gray-200
                                    rounded-md
                                "
                            >

                                {/* Icon + Label */}

                                <div className="flex items-center gap-4">

                                    <GripVertical
                                        size={18}
                                        className="text-gray-500"
                                    />


                                    <span
                                        className="
                                            text-sm
                                            text-blue-950
                                        "
                                    >

                                        {column.header}

                                    </span>

                                </div>


                                {/* Checkbox */}

                                <input
                                    type="checkbox"
                                    checked={
                                        visibleColumn[key] || false
                                    }
                                    onChange={() =>
                                        handleChange(key)
                                    }
                                    className="
                                        w-4
                                        h-4
                                        accent-purple-600
                                        cursor-pointer
                                    "
                                />

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );

}


export default ShowHideColumns;