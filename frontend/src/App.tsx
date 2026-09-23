import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ListaLivros } from './pages/ListaLivros';
import { DetalhesLivro } from './pages/DetalhesLivro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListaLivros />} />
        <Route path="/livros/:id" element={<DetalhesLivro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;