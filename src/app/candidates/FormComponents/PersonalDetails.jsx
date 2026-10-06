"use client"
import GlobalDoubleIcon from '@/components/GlobalDoubleIcon'
import GlobalFormBuilder from '@/components/GlobalFormBuilder'

import React, { useState } from 'react'

function PersonalDetails({handleChange,data}) {
    const [isPersonalOpen, setIsPersonalOpen] = useState(true)
    
    const FormFields = [
        { name: "firstName", label: "First Name", type: "input", placeholder: "John", required:true },
        { name: "lastName", label: "Last Name", type: "input", placeholder: "Smith", required:true },
        { name: "email", label: "Email", type: "input", placeholder: "Johnsmith@gmail.com" },
        { name: "phone", label: "Phone Number", type: "input", placeholder: "+92 0000000000", required:true },
        { name: "gender", label : "Gender", type: "dropdown" , placeholder: "Select Gender", options:[
            {label:"Male", value: "male"},
            {label:"Female", value: "female"},
            {label:"Binary", value: "binary"},
            {label:"Prefer Not To Say", value: "prefer not to say"},
        ]},
        {name:"date" , label:"Date" , type:"date" ,placeholder:"DD-MM-YYYY",required:true},
        { name: "fulladdress", label: "Full Address", type: "input", placeholder: "123 Wall ST,Apt 48", required:true,fullWidth :true },
        { name: "city", label: "City", type: "input", placeholder: "London", required:true },
        { name: "suburb", label: "Suburb", type: "input", placeholder: "Enter Suburb" },
        { name: "state", label: "State", type: "input", placeholder: "Enter State" },
        { name: "country", label: "Country", type: "input", placeholder: "Enter Country" },
        { name: "postalcode", label: "Postal Code", type: "input", placeholder: "Postal Code" },
        { name: "willing to relocate", label:"Willing To Relocate", type:"dropdown", placeholder:"Please Select", options:[{value:"yes",label:"Yes"},{value:"no",label:"No"},{value:"maybe",label:"Maybe"},]}
    ];
    
    return (
        <div>
            <div>
                <GlobalDoubleIcon title='Personal Details' isOpen={isPersonalOpen} onToggle={() => setIsPersonalOpen(!isPersonalOpen)} />
                {isPersonalOpen && (
                    <div>
                        <GlobalFormBuilder fields={FormFields} formData={data} onChange={handleChange} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PersonalDetails