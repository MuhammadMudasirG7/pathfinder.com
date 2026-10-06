"use client"

import React, { useEffect, useState } from 'react'

function ProfileSection() {
  const [editing, setEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "", lastName: "", email: "", jobTitle: "",
    companyName: "", role: "", contactNumber: "", timeZone: "",
    city: "", state: "", country: "", currency: "", profileImage: ""
  })

  const getProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile")
      const data = await response.json()

      if (data.success) {
        const user = data.user
        setProfileData({
          firstName: user.firstName || "Not available",
          lastName: user.lastName || "Not available",
          email: user.email || "Not available",
          jobTitle: user.jobTitle || "Agency",
          companyName: user.company || "Not available",
          role: user.role || "Account Owner",
          contactNumber: user.phone || "Not available",
          timeZone: user.timeZone || "Not available",
          city: user.city || "Not available",
          state: user.state || "Not available",
          country: user.country || "Not available",
          currency: user.currency || "Not available",
          profileImage: user.profileImage || ""
        })
      }
    } catch (error) {
      console.log("GET PROFILE ERROR:", error)
    }
  }

  useEffect(() => {
    getProfile()
  }, [])

  // INPUT CHANGE HANDLER
  const handleChnage = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const render = new FileReader()
    render.onloadend = async () => {
      const image = render.result
      setProfileData({ ...profileData, profileImage: image })
      try {
        const response = await fetch("/api/auth/profile", {
          method:"PUT",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            profileImage:image
          })
        })
        const data = await response.json()
        if (data.success) {
          console.log("Profile image Uploaded successfully")
        }
      } catch (error) {
        console.log(error)
      }
    }
    render.readAsDataURL(file)
  }
  const handleSave = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          jobTitle: profileData.jobTitle,
          company: profileData.companyName,
          phone: profileData.contactNumber,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          currency: profileData.currency,
        })
      })
      const data = await response.json()
      if (data.success) {
        console.log("Profile Updated Successfully")
        setEditing(false)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", error)
    }
  }
  const getInitials = () => {
    const first = profileData.firstName && profileData.firstName !== "Not available" ? profileData.firstName[0] : ""
    const last = profileData.lastName && profileData.lastName !== "Not available" ? profileData.lastName[0] : ""
    return (first + last).toUpperCase() || "U"
  }
  const labelClass = "text-[12px] font-medium text-gray-500 mb-1 font-sans"
  const inputClass = "px-2 py-1.5 w-full text-[11px] text-gray-700 font-medium font-sans border border-gray-200 outline-none hover:shadow-[0_0_3px_rgba(99,102,241,0.42)] rounded"
  const valueClass = "text-[12px] font-medium text-gray-700"
  const readOnlyInputClass = "px-2 py-1.5 w-full text-[11px] text-gray-500 font-medium font-sans border border-gray-200 bg-gray-50 cursor-not-allowed outline-none rounded"

  const formFields = [
    { label: 'First Name', name: 'firstName', type: 'text' },
    { label: 'Last Name', name: 'lastName', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Job Title', name: 'jobTitle', type: 'text' },
    { label: 'Company Name', name: 'companyName', type: 'text' },
    { label: 'Role', name: 'role', type: 'text' }, // Role field add ki gayi hai form fields mein
    { label: 'Contact Number', name: 'contactNumber', type: 'text' },
    { label: 'City', name: 'city', type: 'text' },
    { label: 'State', name: 'state', type: 'text' },
    { label: 'Country', name: 'country', type: 'text' },
    { label: 'Currency', name: 'currency', type: 'text' },
  ]

  return (
    <div className='p-4'>
      
      <div className='p-3 border border-gray-200 rounded'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-8'>
            <div className='px-4 py-3 flex items-center justify-center rounded bg-gray-100'>
              <div className='flex items-center justify-center w-12 h-12 rounded-full bg-white'>
                {profileData.profileImage ? (
                  <img src={profileData.profileImage} alt="profileimage" className='w-full h-full object-cover' />
                ) : <span>{getInitials()}</span>}
              </div>
            </div>
            <div className='flex flex-col'>
              <span className='text-[14px] text-gray-800 font-medium font-sans'>
                {profileData.firstName} {profileData.lastName}
              </span>
              <span className='text-[12px] text-gray-500 font-medium font-sans'>
                {profileData.jobTitle}
              </span>
            </div>
          </div>

          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className='px-8 mt-5 py-2 text-xs font-sans font-medium text-white bg-indigo-700 hover:bg-indigo-500 cursor-pointer rounded'
          >
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        <label className='text-[11px] text-gray-500 font-sans mt-1.5 ml-2 hover:underline hover:text-indigo-700 cursor-pointer'>
          {profileData.profileImage ? "Change Photo" : "Upload Photo"}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className='hidden'
          />
        </label>
      </div>

      {/* Form Fields Grid */}
      <div className='p-4 grid grid-cols-2 gap-5 border border-gray-200 mt-3'>
        {formFields.map((field) => {
          // Company Name aur Role ko yahan disable/read-only kar diya gaya hai
          const isEditable = field.name !== 'companyName' && field.name !== 'role';

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
                  readOnly={!isEditable}
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

export default ProfileSection