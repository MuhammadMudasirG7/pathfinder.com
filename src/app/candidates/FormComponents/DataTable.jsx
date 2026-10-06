import React, { useState,useEffect } from 'react';
import {
    Columns,
    FilterIcon,
    Pencil,
    UserStarIcon
} from 'lucide-react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import ShowHideColumns from './ShowHideColumns';
import CandidateQuickView from '../quick-view/CandidateQuickView';

function CanDataTable({
    data,
    selectedCandidates,
    setSelectedCandidates,
    onCreateNote
}) {
    // Quick View Modal State
    const [selectedQuickView, setSelectedQuickView] = useState(null);

    // =====================================================
    // TABLE COLUMNS
    // =====================================================
    const columns = [
        { field: 'id', header: 'ID' },
        { field: 'firstName', header: 'Name', visibleKey: 'name' },
        { field: 'email', header: 'Email' },
        { field: 'phone', header: 'Phone' },
        { field: 'owner', header: 'Owner' },
        { field: 'lucas', header: 'Source' },
        { field: 'city', header: 'City' },
        { field: 'suburb', header: 'Suburb' },
        { field: 'state', header: 'State' },
        { field: 'country', header: 'Country' },
        { field: 'postalcode', header: 'Postal Code' },
        { field: 'experience', header: 'Experience In Years' },
        { field: 'currentemployer', header: 'Current Employer' },
        { field: 'currentjobtitle', header: 'Current Job Title' },
        { field: 'currentsalary', header: 'Current Salary' },
        { field: 'expectedsalary', header: 'Expected Salary' },
        { field: 'JohnDoe', header: 'Created By' },
        { field: 'SarahJenkins', header: 'Modified By' },
        { field: 'gender', header: 'Gender' },
        { field: 'date', header: 'Birth Date' },
        { field: 'currentlypursuing', header: 'Currently Pursuing' },
        { field: 'employmentstatus', header: 'Employment Status' },
        { field: 'notice', header: 'Notice Period' },
        { field: 'availabefrom', header: 'Available From' }
    ];

    // =====================================================
    // SHOW / HIDE COLUMNS
    // =====================================================
    const [visibleColumn, setVisibleColumn] = useState({
        id: true,
        name: true,
        email: true,
        phone: true,
        owner: true,
        lucas: true,
        city: true,
        suburb: true,
        state: true,
        country: true,
        postalcode: true,
        experience: true,
        currentemployer: true,
        currentjobtitle: true,
        currentsalary: true,
        expectedsalary: true,
        JohnDoe: true,
        SarahJenkins: true,
        gender: true,
        date: true,
        currentlypursuing: true,
        employmentstatus: true,
        notice: true,
        availabefrom: true
    });

    // =====================================================
    // SHOW / HIDE POPUP
    // =====================================================
    const [showColumns, setShowColumns] = useState(false);

    // =====================================================
    // VALUE FORMAT FUNCTION
    // =====================================================
    const renderValue = (value) => {
        if (value === null || value === undefined) {
            return '';
        }

        if (value instanceof Date) {
            return value.toLocaleDateString();
        }

        if (typeof value === 'object') {
            return value.label || value.name || '';
        }

        return value;
    };

    // =====================================================
    // BODY TEMPLATE
    // =====================================================
    const bodyTemplate = (rowData, field) => {
        return renderValue(rowData[field]);
    };

    // =====================================================
    // PAGINATOR
    // =====================================================
    const paginatorTemplate = {
        layout: 'CurrentPageReport RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        CurrentPageReport: (options) => {
            return (
                <span className="text-sm font-medium text-gray-600">
                    Showing {options.first} to {options.last} of {options.totalRecords} results
                </span>
            );
        }
    };

    // =====================================================
    // QUICK VIEW BUTTON
    // =====================================================
    const columnsQuickView = (rowData) => (
        <button
            type="button"
            onClick={() => setSelectedQuickView(rowData)}
            className="p-1.5 rounded-full bg-gray-100 text-gray-600 transition-colors mx-auto hover:bg-gray-800 hover:text-white flex items-center justify-center cursor-pointer"
            title="Quick View"
        >
            <UserStarIcon className="w-3 h-3" />
        </button>
    );

    // =====================================================
    // EDIT BUTTON
    // =====================================================
    const editBodyTemplate = () => (
        <button
            type="button"
            className="p-1.5 rounded-full bg-gray-100 text-gray-600 transition-colors mx-auto hover:bg-gray-800 hover:text-white flex items-center justify-center"
        >
            <Pencil className="w-3 h-3" />
        </button>
    );

    // =====================================================
    // FILTER BUTTON
    // =====================================================
    const filterIcon = () => (
        <button
            type="button"
            className="p-1.5 rounded-full bg-gray-100 text-gray-600 transition-colors mx-auto hover:bg-gray-800 hover:text-white flex items-center justify-center"
        >
            <FilterIcon className="w-3 h-3" />
        </button>
    );

    // =====================================================
    // SHOW / HIDE BUTTON
    // =====================================================
    const ShowHideButton = () => (
        <div className="relative">
            <button
                type="button"
                onClick={() => setShowColumns(!showColumns)}
                className="p-1.5 rounded-full bg-gray-100 text-gray-800 transition-colors mx-auto hover:bg-gray-800 hover:text-white flex items-center justify-center"
            >
                <Columns className="w-3 h-3" />
            </button>

            {showColumns && (
                <ShowHideColumns
                    columns={columns}
                    visibleColumn={visibleColumn}
                    setVisibleColumn={setVisibleColumn}
                    onClose={() => setShowColumns(false)}
                />
            )}
        </div>
    );
    useEffect(() => {
    // Modal open hone par background page ko scroll hone se rokein
    document.body.style.overflow = 'hidden';

    // Modal close/unmount hone par scroll wapas normal karein
    return () => {
        document.body.style.overflow = 'auto';
    };
}, []);

    
    return (
        <div className="w-full mt-2 p-5 border border-gray-200 rounded-xl bg-white relative ">
            <DataTable
                paginatorTemplate={paginatorTemplate}
                paginatorClassName="custom-paginator flex items-center justify-between pt-2 border-t border-gray-200 text-sm text-gray-600"
                dataKey="id"
                selection={selectedCandidates}
                onSelectionChange={(e) => setSelectedCandidates(e.value)}
                paginator
                rows={7}
                rowsPerPageOptions={[1, 10, 15, 20]}
                scrollHeight="330px"
                value={data}
                scrollable
                className="candidate-table"
            >
                {/* Selection */}
                <Column selectionMode="multiple" headerStyle={{ width: '50px' }} bodyStyle={{ textAlign: 'center' }} />

                {/* Filter */}
                <Column header={filterIcon} body={editBodyTemplate} style={{ width: '60px' }} />

                {/* Show / Hide & Quick View */}
                <Column header={ShowHideButton} body={columnsQuickView} style={{ width: '60px', marginRight: '6px' }} />

                {/* Dynamic Columns */}
                {columns.map((column) => {
                    const visibleKey = column.visibleKey || column.field;

                    if (!visibleColumn[visibleKey]) {
                        return null;
                    }

                    return (
                        <Column
                            key={column.field}
                            field={column.field}
                            header={column.header}
                            body={(rowData) => bodyTemplate(rowData, column.field)}
                            style={{ minWidth: '180px' }}
                        />
                    );
                })}
            </DataTable>

            {/* Quick View Side Drawer Modal */}
            {selectedQuickView && (
                <CandidateQuickView
                    candidate={selectedQuickView}
                    onClose={() => setSelectedQuickView(null)}
                    onCreateNote={(noteData) => {
                        if (typeof onCreateNote === 'function') {
                            onCreateNote(noteData);
                        }
                    }}
                />
            )}
        </div>
    );
}

export default CanDataTable;