import { useState } from 'react'
import './admin.css'
import { auth } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'

export default function Admin() {
  const [tarefasInput, setTarefasInput] = useState('')

  function handleRegister(e) {
    e.preventDefault()
  }

  async function handleLogout() {
    await signOut(auth)
  }

  return (
    <div className="admin-container">
      <h1>Suas tarefas</h1>

      <form className="form" onSubmit={handleRegister}>
        <textarea
          placeholder="Digite aqui suas tarefas..."
          value={tarefasInput}
          onChange={e => setTarefasInput(e.target.value)}
        />

        <button type="submit" className="btn-register">
          Registrar tarefa
        </button>
      </form>

      <article className="list">
        <p>Estudar e praticar React</p>
        <div>
          <button>Editar tarefa</button>
          <button className="btn-delete">Concluir</button>
        </div>
      </article>

      <button className="btn-logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  )
}
