import { db, auth } from './firebaseConnection'
import {
  doc, //modificar documento no firebase
  setDoc, //armazenar o doc
  collection, //acessar uma coleção dentro do nosso fb trazendo tudo que está nele
  addDoc, //adicionar um novo documento firebase
  getDoc, //buscar UM documento no firebase
  getDocs, //buscar todos os documento no firebase
  updateDoc, //atualizar docs existentes com paramentros (id)
  deleteDoc, //excluir algum doc existente com um paramentro (id)
  onSnapshot //monitoramento realtime do nosso firebase
} from 'firebase/firestore' // usar o doc e modificar o doc ==> do  nosso firebase

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import './app.css'
import { useState, useEffect } from 'react'
import { wait } from '@testing-library/user-event/dist/utils'

function App() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost] = useState('')
  const [posts, setPosts] = useState([])

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState([])

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, 'posts'), snapshot => {
        let listaPost = []

        snapshot.forEach(doc => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })
        setPosts(listaPost)
      })
    }
    loadPosts()
  }, [])

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, user => {
        if (user) {
          //se usuario esta logado
          setUser(true)
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        } else {
          // se usuario nao esta logado
          setUser(false)
          setUserDetail({})
        }
      })
    }

    checkLogin()
  }, [])

  //função assincrona (pois espera requisao externa) e await (espera para realizar a funçõa)
  async function handleAdd() {
    /* //    mod.Doc(doc(nossoBD, caminho, novo post))
    await setDoc(doc(db, 'posts', '12345'), {
      //passamos o que queremos acrescentar ==> funcao que guarda o que queremos acrescentar
      titulo: titulo,
      autor: autor
    })
      //função promise que aguarda uma situação de erro ou não (TRUE/FALSE)
      .then(() => {
        //Função caso de TRUE usamos o .THEN
        console.log('DADOS REGISTRADOS COM SUCESSO')
      })
      .catch(error => {
        //Função em caso de FALSE usamos o .CATCH
        console.log('Gerou Erro' + error)
      })*/
    await addDoc(collection(db, 'posts'), {
      titulo: titulo,
      autor: autor
    })
      .then(() => {
        alert('CADASTRO REALIZADO COM SUCESSO')
        setAutor('')
        setTitulo('')
      })
      .catch(error => {
        alert('ERRO' + error)
      })
  }

  async function buscarPost() {
    /* const postRef = doc(db, 'posts', '12345')

    await getDoc(postRef)
      .then(snapshot => {
        setAutor(snapshot.data().autor)
        setTitulo(snapshot.data().titulo)
      })
      .catch(error => {
        alert('ERRO' + error)
      })*/
    const postsRef = collection(db, 'posts')
    await getDocs(postsRef)
      .then(snapshot => {
        let lista = []

        snapshot.forEach(doc => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })

        setPosts(lista)
      })
      .catch(error => {
        alert('Deu algum erro, tente novamente...')
      })
  }

  async function editarPost() {
    const docRef = doc(db, 'post', idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
      .then(() => {
        alert('Atualizou com sucesso')
        setIdPost('')
        setAutor('')
        setTitulo('')
      })
      .catch(() => {
        console.log('error')
      })
  }

  async function excluirPost(id) {
    const docRef = doc(db, 'posts', id)

    await deleteDoc(docRef).then(() => {
      alert('post deletado com sucesso')
    })
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert('deu certo')
        setEmail('')
        setSenha('')
      })
      .catch(error => {
        if (error.code === 'auth/weak-password') {
          alert('Senha fraca')
        } else if (error.code === 'auth/email-already-in-use') {
          alert('Email já cadastrado')
        }
      })
  }

  async function loginUser() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert('Logado')
        setUserDetail({
          uid: user.uid,
          email: user.email
        })
        setUser(true)

        setEmail('')
        setSenha('')
      })
      .catch(() => {
        alert('Erro ao tentar fazer login')
      })
  }

  async function fazerLogout() {
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  return (
    <div>
      <h1>Teste React + Firebase</h1>

      {user && (
        <div>
          <strong>Seja bem-vindo(a) (Você está logado)</strong>
          <span>
            ID: {userDetail.uid} - Email: {userDetail.email}
          </span>
          <button onClick={fazerLogout}>Sair</button>
          <br />
          <br />
        </div>
      )}

      <div className="container">
        <h2>Usuariosn</h2>
        <label>Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Digite seu email"
        />
        <label>Senha</label>
        <input
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          placeholder="Digite sua senha"
        />
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={loginUser}>Login</button>
      </div>
      <br />
      <br />
      <hr />

      <div className="container">
        <label>Digite o ID do Post</label>
        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={e => setIdPost(e.target.value)}
        />
        <label>Titulo</label>
        <textarea
          type="text"
          placeholder="Digite seu titulo"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <label>Autor</label>
        <textarea
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={e => setAutor(e.target.value)}
        />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar posts</button> <br />
        <button onClick={editarPost}>Atualizar Post</button>
        <ul>
          {posts.map(post => {
            return (
              <li key={post.id}>
                <span>ID Post: {post.id}</span> <br />
                <span>Titulo: {post.titulo}</span> <br />
                <span>Autor: {post.autor}</span> <br /> <br />
                <button onClick={() => excluirPost(post.id)}>
                  Excluir
                </button>{' '}
                <br /> <br />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App
