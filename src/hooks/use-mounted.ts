import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * hydration 불일치 방지: 서버에서는 false, 클라이언트 마운트 후 true
 * Zustand persist 스토어 값을 렌더링에 사용할 때 필요
 */
export const useMounted = () =>
  useSyncExternalStore(emptySubscribe, () => true, () => false)
