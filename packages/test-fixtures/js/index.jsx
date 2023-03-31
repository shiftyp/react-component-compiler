import React, { useEffect }  from 'react'

const aliasedLocation = location

const customHook = () => {
  useEffect(() => {})
}

const windowUtility = () => window.location.toString()

const globalUtility = () => location.toString()

const utilityObj = {
  customHook: () => {
    useEffect(() => {})
  },
  windowUtility: () => window.location.toString(),
  globalUtility: () => location.toString(),
}

export const client0 = () => {
  useEffect(() => {})

  return <span>Test</span>
}

export const client1 = () => {
  return <span>{window.location.toString()}</span>
}

export const client2 = () => {
  return <span>{location.toString()}</span>
}

export const client3 = () => {
  return <span>{aliasedLocation.toString()}</span>
}

export const client4 = () => {
  customHook()

  return <span>Test</span>
}

export const client5 = () => {
  return <span>{globalUtility()}</span>
}

export const client6 = () => {
  return <span>{windowUtility()}</span>
}

export const client7 = () => {
  utilityObj.customHook()

  return <span>Test</span>
}

export const client8 = () => {
  return <span>{utilityObj.globalUtility()}</span>
}

export const client9 = () => {
  return <span>{utilityObj.windowUtility()}</span>
}