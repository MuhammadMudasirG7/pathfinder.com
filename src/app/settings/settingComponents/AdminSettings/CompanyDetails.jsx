"use client"
import React, { useEffect, useState } from 'react'

function CompanyDetails() {
  const [editing, setEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    companyName: "", accountType: "", country: "", email: "",
    companyWebsite: "", timeZone: "", accountOwner: "",
    currency: "", accountId: "", createOn: "", companyImage: ""
  })
  const getProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile")
      const data = await response.json()
      if (data.success) {
        const user = data.user
        setProfileData({
          companyName: user.company || "unavailable",
          accountType: user.accountType || "unavailable",
          country: user.country || "unavailable",
          email: user.email || "unavailable",
          companyWebsite: user.companyWebsite || "unavailable",
          timeZone: user.timeZone || "unavailable",
          accountOwner: `${user.firstName || ""} ${user.lastName || ""}`,
          currency: user.currency || "unavailable",
          accountId: user.accountId || "unavailable",
          createOn: user.createdAt || "unavailable",
          companyImage: user.companyImage || "",
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getProfile()
  }, [])
  const formFields = [
    { label: 'Company Name', name: 'companyName', type: 'text' },
    { label: 'Account Type', name: 'accountType', type: 'text' },
    { label: 'Country', name: 'country', type: 'text' },
    { label: 'Email', name: 'email', type: 'text' },
    { label: 'Company Website', name: 'companyWebsite', type: 'text' },
    { label: 'Time Zone', name: 'timeZone', type: 'text' },
    { label: 'Account Owner / Admin', name: 'accountOwner', type: 'text' },
    { label: 'Currency', name: 'currency', type: 'text' },
    { label: 'Account ID', name: 'accountId', type: 'text' },
    { label: 'Create On', name: 'createOn', type: 'text' },
  ];
  const handleChnage = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    const render = new FileReader()

    render.onloadend = async () => {
      const image = render.result

      // Pehle screen par new image show karo
      setProfileData({
        ...profileData,
        companyImage: image
      })

      try {
        const response = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            companyImage: image
          })
        })

        const data = await response.json()

        if (data.success) {
          console.log("Company Image Updated Successfully")
          getProfile()
        } else {
          console.log(data.message)
        }

      } catch (error) {
        console.log("IMAGE UPDATE ERROR:", error)
      }
    }

    render.readAsDataURL(file)
  }
  const updateProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: profileData.email,
          companyWebsite: profileData.companyWebsite,
          companyImage: profileData.companyImage
        })
      })

      const data = await response.json()

      if (data.success) {
        console.log("Company Settings updated successfully")
        setEditing(false)
        getProfile()
      } else {
        console.log(data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }
  const labelClass = "text-[12px] font-medium text-gray-500 mb-1 font-sans"


  const inputClass = "px-2 py-1.5 w-full text-[11px] text-gray-700 font-medium font-sans border border-gray-200 outline-none hover:shadow-[0_0_3px_rgba(99,102,241,0.42)] rounded"


  const readOnlyInputClass = "px-2 py-1.5 w-full text-[11px] text-gray-500 font-medium font-sans border border-gray-200 bg-gray-50 cursor-not-allowed outline-none rounded"

  const valueClass = "text-[12px] font-medium  text-gray-700"
  return (
    <div className='p-4'>

      <div className='p-3 border border-gray-200 rounded'>
        <div className='flex items-center justify-between '>
          <div className='flex items-center gap-8'>
            <div className='px-4 py-3 flex items-center justify-center  rounded bg-gray-100'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full bg-white  '>
                {profileData.companyImage ? (
                  <img src={profileData.companyImage} alt="company" className='w-full h-full object-cover' />
                ) : <span>JD</span>}
              </div>
            </div>
            <div className='flex flex-col'>
              <span className='text-[14px] text-gray-800 font-medium font-sans'>{profileData.companyName}</span>
              <span className='text-[12px] text-gray-500 font-medium font-sans'>{profileData.accountType}</span>
            </div>
          </div>
          <button onClick={() => {
            if (editing) {
              updateProfile()
              setEditing(false) // Save hone ke baad wapis view mode par le aane ke liye
            } else {
              setEditing(true)
            }
          }} className='px-8 mt-5 py-2 text-xs font-sans font-medium  text-white bg-indigo-700 hover:bg-indigo-500 cursor-pointer rounded'>
            {editing ? "Save" : "Edit"}
          </button>
        </div>
        <label className='text-[11px] text-gray-500 font-sans mt-1.5 ml-2 hover:underline hover:text-indigo-700 cursor-pointer'>
          {profileData.companyImage ? "Change Photo" : "Upload Photo"}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className='hidden'
          />
        </label>
      </div>

      <div className='p-4 grid grid-cols-2 space-y-5 space-x-5 border border-gray-200 mt-3'>
        {formFields.map((field) => {
          // Check kiya ke yeh field editable hai ya nahi (sirf email aur companyWebsite editable hain aapke PUT API ke mutabiq)
          const isEditable = field.name === 'email' || field.name === 'companyWebsite';

          return (
            <div className='flex flex-col' key={field.name}>
              <label className={labelClass}>{field.label}</label>
              {editing ? (
                <input
                  className={isEditable ? inputClass : readOnlyInputClass}
                  type={field.type}
                  name={field.name}
                  onChange={handleChnage}
                  value={profileData[field.name]}
                  readOnly={!isEditable} // HTML level par bhi uneditable kar diya taake user type na kar sakay
                />
              ) : (
                <p className={valueClass}>{profileData[field.name]}</p>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default CompanyDetails