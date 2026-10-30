import { Route, Routes } from 'react-router'
import LayoutPublico from './compartido/componentes/LayoutPublico.tsx'
import ContactoPagina from './compartido/paginas/ContactoPagina.tsx'
import NoEncontradaPagina from './compartido/paginas/NoEncontradaPagina.tsx'
import NosotrosPagina from './compartido/paginas/NosotrosPagina.tsx'
import CatalogoPagina from './catalogo/paginas/CatalogoPagina.tsx'
import DetallePagina from './catalogo/paginas/DetallePagina.tsx'
import HomePagina from './catalogo/paginas/HomePagina.tsx'
import LoginPagina from './panel/paginas/LoginPagina.tsx'

export default function App() {
  return (
    <Routes>
      {/* Sitio público: comparte header y footer */}
      <Route element={<LayoutPublico />}>
        <Route index element={<HomePagina />} />
        <Route path="propiedades" element={<CatalogoPagina />} />
        <Route path="propiedades/:id" element={<DetallePagina />} />
        <Route path="nosotros" element={<NosotrosPagina />} />
        <Route path="contacto" element={<ContactoPagina />} />
        <Route path="*" element={<NoEncontradaPagina />} />
      </Route>

      {/* Acceso administrativo: pantalla propia, sin el layout público */}
      <Route path="admin/login" element={<LoginPagina />} />
    </Routes>
  )
}
