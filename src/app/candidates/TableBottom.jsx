const TableBottom = () => {
    return (
        <div className="w-full h-16 border border-gray-300 bg-white flex items-center justify-between px-5">

            {/* Left */}
            <div className="text-sm text-slate-500">
                Showing 1 to 1 of 1 results
            </div>

            {/* Center */}
            <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">
                    Rows per page
                </span>

                <select
                    className="
                        h-9
                        w-20
                        px-3
                        border
                        border-gray-300
                        rounded-md
                        bg-white
                        text-sm
                        text-slate-700
                        outline-none
                        focus:border-violet-500
                    "
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

                <span className="text-sm text-slate-500 mr-2">
                    Page 1 of 1
                </span>

                {/* First */}
                <button
                    className="
                        w-10
                        h-9
                        flex
                        items-center
                        justify-center
                        border
                        border-gray-300
                        rounded-md
                        bg-white
                        text-slate-500
                        hover:bg-gray-50
                        disabled:opacity-50
                    "
                    disabled
                >
                    <i className="pi pi-angle-double-left" />
                </button>

                {/* Previous */}
                <button
                    className="
                        w-10
                        h-9
                        flex
                        items-center
                        justify-center
                        border
                        border-gray-300
                        rounded-md
                        bg-white
                        text-slate-500
                        hover:bg-gray-50
                        disabled:opacity-50
                    "
                    disabled
                >
                    <i className="pi pi-angle-left" />
                </button>

                {/* Next */}
                <button
                    className="
                        w-10
                        h-9
                        flex
                        items-center
                        justify-center
                        border
                        border-gray-300
                        rounded-md
                        bg-white
                        text-slate-500
                        hover:bg-gray-50
                    "
                >
                    <i className="pi pi-angle-right" />
                </button>

                {/* Last */}
                <button
                    className="
                        w-10
                        h-9
                        flex
                        items-center
                        justify-center
                        border
                        border-gray-300
                        rounded-md
                        bg-white
                        text-slate-500
                        hover:bg-gray-50
                    "
                >
                    <i className="pi pi-angle-double-right" />
                </button>

            </div>

        </div>
    );
};

export default TableBottom;