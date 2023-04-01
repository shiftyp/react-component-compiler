import React, { useEffect } from 'react'

const customHook = () => {
  useEffect(() => {})
}

const windowUtility = () => window.location.toString()

const globalUtility = () => location.toString()

// Shorthand Property Assignments

const utilityObj = {
  customHook,
  windowUtility,
  globalUtility,
}

export const edgeCase0 = () => {
  utilityObj.customHook()

  return <span>Test</span>
}

export const edgeCase1 = () => {
  return <span>{utilityObj.globalUtility()}</span>
}

export const edgeCase2 = () => {
  return <span>{utilityObj.windowUtility()}</span>
}