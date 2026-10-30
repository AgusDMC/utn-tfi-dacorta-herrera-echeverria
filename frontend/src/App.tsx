import { Route, Routes } from 'react-router'
import LayoutPublico from './compartido/componentes/LayoutPublico.tsx'
import NoEncontradaPagina from './compartido/paginas/NoEncontradaPagina.tsx'
import CatalogoPagina from './catalogo/paginas/CatalogoPagina.tsx'
import DetallePagina from './catalogo/paginas/DetallePagina.tsx'
import LoginPagina from './panel/paginas/LoginPagina.tsx'

export default function App() {
  return (
    <Routes>
      {/* Sitio público: comparte header y footer */}
      <Route element={<LayoutPublico />}>
        <Route index element={<CatalogoPagina />} />
        <Route path="propiedades/:id" element={<DetallePagina />} />
        <Route path="*" element={<NoEncontradaPagina />} />
      </Route>

      {/* Acceso administrativo: pantalla propia, sin el layout público */}
      <Route path="admin/login" element={<LoginPagina />} />
    </Routes>
  )
}
