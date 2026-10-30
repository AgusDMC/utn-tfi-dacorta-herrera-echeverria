import { useSyncExternalStore } from 'react'

// Dice si una media query se cumple y se actualiza cuando cambia (por ejemplo, al girar el celular)
export function useMediaQuery(consulta: string): boolean {
  return useSyncExternalStore(
    (avisar) => {
      const lista = window.matchMedia(consulta)
      lista.addEventListener('change', avisar)
      return () => lista.removeEventListener('change', avisar)
    },
    () => window.matchMedia(consulta).matches,
    () => false,
  )
}
