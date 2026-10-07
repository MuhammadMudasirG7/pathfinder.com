"use client"
import React from 'react'
import { Suspense } from 'react';

import MainSettingPage from './settingComponents/MainSettingPage'

function page() {
  return (
    <Suspense fallback={<div>Loading Settings...</div>}>
      <MainSettingPage />
    </Suspense>

  )
}

export default page