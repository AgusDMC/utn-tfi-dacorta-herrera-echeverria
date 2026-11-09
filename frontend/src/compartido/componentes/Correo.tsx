import { Fragment } from 'react'

// Un correo largo, si no entra en una línea, se corta después de la arroba o antes de un punto,
// nunca en medio de una palabra
export default function Correo({ direccion }: { direccion: string }) {
  return direccion.split(/(?<=@)|(?=\.)/).map((parte, indice) => (
    <Fragment key={indice}>
      {indice > 0 && <wbr />}
      {parte}
    </Fragment>
  ))
}
