import { useCallback, useEffect, useState } from 'react'

export function useSearchParam(key: string, defaultValue: string = '') {
  const getValue = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get(key) ?? defaultValue
  }, [key, defaultValue])

  const [value, setValue] = useState<string>(getValue)

  useEffect(() => {
    const handlePopState = () => setValue(getValue())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [getValue])

  const setSearchParam = useCallback((newValue: string) => {
    const params = new URLSearchParams(window.location.search)
    if (!newValue || newValue === defaultValue) {
      params.delete(key)
    } else {
      params.set(key, newValue)
    }
    const search = params.toString()
    const url = search ? `${window.location.pathname}?${search}` : window.location.pathname
    window.history.replaceState({}, '', url)
    setValue(newValue)
  }, [key, defaultValue])

  return [value, setSearchParam] as const
}
