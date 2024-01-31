import { useState, useEffect } from 'react'
import { auth } from '../../firebaseConnection'
import { onAuthStateChanged } from 'firebase/auth'
import { Navigate } from 'react-router-dom'

export default function Private({ children }) {
  //useState para armazenar o login/signed
  const [loading, setLoading] = useState(true)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    //funcao responsavel pela verificacao se o user está logado...
    async function checkLogin() {
      //operador firebase para fazer realtime do DB
      const unsub = onAuthStateChanged(auth, user => {
        //se o user(usuario) estiver logado, vamos "pegar" (destruction) o UID e Email
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email
          }
          //pós "pegar" os dados vamos armazenar na storage, com o nome @detailUser e alteramos o signed (responsavel por verificar se está logado ou nao) para true (dizendo que está logado e então podemos acessar a pagina ADMIN)
          localStorage.setItem('@detailUser', JSON.stringify(userData))
          setLoading(false)
          setSigned(true)
        } else {
          //caso não estejamos logado, vamos manter os dois states em  false, fazendo com que o user não consiga acessar a pagina ADMIN
          setLoading(false)
          setSigned(false)
        }
      })
    }
    //Chamamos a function a checked
    checkLogin()
  }, [])

  if (loading) {
    return <div></div>
  }

  if (!signed) {
    return <Navigate to="/" />
  }
  return children
}
