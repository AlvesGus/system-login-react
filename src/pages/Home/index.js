import { useState } from 'react'
import './home.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { auth } from '../../firebaseConnection'
import { signInWithEmailAndPassword } from 'firebase/auth'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    // se email for diferente de vazio && (e) password for diferente de vazio caimos no case
    if (email !== '' && password !== '') {
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate('/admin', { replace: true })
        })
        .catch(error => {
          alert('Erro ao fazer login ' + error)
        })
    } else {
      alert('Preencha todos os campos')
    }
  }

  return (
    <div className="home-container">
      <h1>Lista de tarefas</h1>
      <span>Gerencie sua agenda de forma simples e prática</span>

      <form className="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Digite seu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="**********"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button type="submit">Acessar</button>
      </form>
      <Link className="btn-link" to="/register">
        Não tem conta? Cadastre-se
      </Link>
    </div>
  )
}
