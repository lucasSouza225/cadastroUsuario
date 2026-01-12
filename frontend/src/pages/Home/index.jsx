import { useEffect, useState } from 'react' 
import './style.css'
import api from '../../services/api'

function Home() {

  // react hocks
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function getUsers() {
    try {
      setLoading(true)
      const response = await api.get('/usuarios') 
      setUsers(response.data) 
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      setError('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='container'>
      <form action="#">
        <h1>Cadastro de Usuário</h1>
        <input type="text" name='nome' placeholder='Digite o Nome' />
        <input type="number" name='idade' placeholder='Digite a Idade' />
        <input type="email" name="email" placeholder='Digite o E-mail' />
        <button type='button'>Cadastrar</button>
      </form>

      <h2>Usuários Cadastrados</h2>

      {/* ✅ Mostrar estados de loading/erro */}
      {loading && <p>Carregando usuários...</p>}
      {error && <p className="error">{error}</p>}

      <div className='users-container'>
        {/* ✅ Verificar se users existe e é array */}
        {users && users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-card-header">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h3>{user.name}</h3>
                </div>
              </div>
              <div className="user-details">
                <p>
                  <span className="user-label">Nome:</span>
                  <span className="user-value">{user.name}</span>
                </p>
                <p>
                  <span className="user-label">Idade:</span>
                  <span className="user-value">
                    {user.age} anos
                    <span className="age-indicator">
                      {user.age < 30 ? "Jovem" : user.age < 50 ? "Adulto" : "Sênior"}
                    </span>
                  </span>
                </p>
                <p>
                  <span className="user-label">Email:</span>
                  <span className="user-value">{user.email}</span>
                </p>
              </div>
              <button className="delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                  <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          !loading && !error && <p>Nenhum usuário cadastrado</p>
        )}
      </div>
    </div>
  )
}

export default Home