import { useEffect, useRef } from 'react'

export  default function usePrevRender(value) {
  const prevRef = useRef()
  useEffect(() => {
    prevRef.current = value
  })
  return prevRef.current
}