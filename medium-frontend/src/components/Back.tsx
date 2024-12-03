import React from 'react'
import { useNavigate } from 'react-router-dom'

function Back() {
    const navigate=useNavigate()
  return (
    <button onClick={() => navigate(-1)}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>
  </button>
  )
}

export default Back