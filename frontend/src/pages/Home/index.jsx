import { useEffect, useState, useRef } from 'react'
import './style.css'
import api from '../../services/api'

function Home() {

  // states
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // refs
  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  // Buscar usuários
  async function getUsers() {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get('/usuarios')
      setUsers(response.data)

    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      setError('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  // Criar usuário
  async function createUsers() {
    // 🔹 VALIDAÇÃO DE CAMPOS VAZIOS
    if (!inputName.current.value.trim() || 
        !inputAge.current.value.trim() || 
        !inputEmail.current.value.trim()) {
      setError('Preencha todos os campos!')
      return
    }

    // 🔹 Validação de idade (número)
    if (isNaN(inputAge.current.value) || Number(inputAge.current.value) <= 0) {
      setError('Idade inválida! Digite um número positivo.')
      return
    }

    // 🔹 Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inputEmail.current.value)) {
      setError('Email inválido!')
      return
    }

    try {
      // Limpa erro anterior
      setError(null)

      await api.post('/usuarios', {
        name: inputName.current.value,
        age: inputAge.current.value,
        email: inputEmail.current.value
      })

      // 🔹 Limpar campos após cadastrar
      inputName.current.value = ''
      inputAge.current.value = ''
      inputEmail.current.value = ''

      getUsers()
    } catch (err) {
      console.error('Erro ao criar usuário:', err)
      setError('Erro ao cadastrar usuário')
    }
  }

  // Deletar usuário
  async function deleteUsers(id) {
    if (!window.confirm('Deseja realmente excluir este usuário?')) return

    try {
      setError(null)

      await api.delete(`/usuarios/${id}`)
      getUsers()

    } catch (err) {
      console.error('Erro ao deletar usuário:', err)
      setError('Erro ao deletar usuário')
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className='container'>
      <form>
        <h1>Cadastro de Usuário</h1>

        <input
          type="text"
          placeholder='Digite o Nome'
          ref={inputName}
        />

        <input
          type="number"
          placeholder='Digite a Idade'
          ref={inputAge}
          min="1"
        />

        <input
          type="email"
          placeholder='Digite o E-mail'
          ref={inputEmail}
        />

        <button type='button' onClick={createUsers}>
          Cadastrar
        </button>
      </form>

      <h2>Usuários Cadastrados</h2>

      {loading && <p>Carregando usuários...</p>}
      
      {/* 🔹 MENSAGEM DE ERRO */}
      {error && (
        <div className="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className='users-container'>
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="user-card">

              <div className="user-card-header">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h3>{user.name}</h3>
              </div>

              <div className="user-details">
                <p><strong>Nome:</strong> {user.name}</p>
                <p>
                  <strong>Idade:</strong> {user.age} anos
                </p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteUsers(user.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                </svg>
              </button>

            </div>
          ))
        ) : (
          !loading && <p>Nenhum usuário cadastrado</p>
        )}
      </div>
    </div>
  )
}

export default Home