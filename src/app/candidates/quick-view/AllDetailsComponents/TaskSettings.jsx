import React, { useState } from 'react';
import CustomDropdown from './CustomDropdown';

function TaskSettings() {
    
    const [priority, setPriority] = useState("None");
    const [status, setStatus] = useState("To Do");
    const [category, setCategory] = useState("Bug");

    return (
        <div className="p-6 space-y-4 max-w-md">
            
            <CustomDropdown
                label="Task Priority"
                options={["None", "Low", "Medium", "High"]}
                selected={priority}
                onSelect={setPriority}
            />

            
            <CustomDropdown
                label="Task Status"
                options={["To Do", "In Progress", "Completed"]}
                selected={status}
                onSelect={setStatus}
            />

            
            <CustomDropdown
                label="Category"
                options={["Bug", "Feature", "Improvement"]}
                selected={category}
                onSelect={setCategory}
            />
        </div>
    );
}

export default TaskSettings;