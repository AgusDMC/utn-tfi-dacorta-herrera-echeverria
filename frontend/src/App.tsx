import { Navigate, Route, Routes } from 'react-router'
import LayoutPublico from './compartido/componentes/LayoutPublico.tsx'
import ContactoPagina from './compartido/paginas/ContactoPagina.tsx'
import NoEncontradaPagina from './compartido/paginas/NoEncontradaPagina.tsx'
import NosotrosPagina from './compartido/paginas/NosotrosPagina.tsx'
import CatalogoPagina from './catalogo/paginas/CatalogoPagina.tsx'
import DetallePagina from './catalogo/paginas/DetallePagina.tsx'
import HomePagina from './catalogo/paginas/HomePagina.tsx'
import LayoutPanel from './panel/componentes/LayoutPanel.tsx'
import RutaProtegida from './panel/componentes/RutaProtegida.tsx'
import ConsultaPagina from './panel/paginas/ConsultaPagina.tsx'
import ConsultasPagina from './panel/paginas/ConsultasPagina.tsx'
import LoginPagina from './panel/paginas/LoginPagina.tsx'
import PanelPagina from './panel/paginas/PanelPagina.tsx'

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

      {/* Panel: todo lo que cuelga de /admin exige sesión */}
      <Route path="admin" element={<RutaProtegida />}>
        <Route element={<LayoutPanel />}>
          <Route index element={<PanelPagina />} />
          <Route path="consultas" element={<ConsultasPagina />} />
          <Route path="consultas/:id" element={<ConsultaPagina />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
