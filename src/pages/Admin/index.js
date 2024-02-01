import { useState, useEffect } from 'react'
import './admin.css'
import { auth, db } from '../../firebaseConnection'
import { signOut } from 'firebase/auth'

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where
} from 'firebase/firestore'

export default function Admin() {
  const [tarefasInput, setTarefasInput] = useState('')
  const [user, setUser] = useState({})

  const [tarefas, setTarefas] = useState([])

  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem('@detailUser')
      setUser(JSON.parse(userDetail))

      if (userDetail) {
        //buscando o conteudo dentro do nosso storage JSON e transformando em arquivo
        const data = JSON.parse(userDetail)
        //criando a  const referencia (para facilitar o caminho)
        const tarefaRef = collection(db, 'tarefas')
        //  criando nossa query, passando a referencia de caminho, ordenando pela categoria (created), ordenando a busca,
        //  com a condição de userUid (do banco) é igual ao uid logado no "data" (OBS usasse '?' para não crashar a aplicacao)
        const q = query(
          tarefaRef,
          orderBy('created', 'desc'),
          where('userUid', '==', data?.uid)
        )
        const unsub = onSnapshot(q, snapshot => {
          let lista = []

          snapshot.forEach(doc => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid
            })
          })
          console.log(lista)
          setTarefas(lista)
        })
      }
    }
    loadTarefas()
  }, [])

  async function handleRegister(e) {
    e.preventDefault()

    if (tarefasInput === '') {
      alert('digite sua tarefa...')
      return
    }

    await addDoc(collection(db, 'tarefas'), {
      tarefa: tarefasInput,
      created: new Date(),
      userUid: user?.uid
    })
      .then(() => {
        console.log('Tarefa cadastrada com sucesso ')
        setTarefasInput('')
      })
      .catch(error => {
        alert('Erro ao registrar')
      })
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
