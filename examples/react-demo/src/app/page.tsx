'use client'

import {useEthSSOModal, createEthSSOModal} from "@chainsafe/eth-sso-react"
import { useCallback, useEffect } from "react"

export default function Home() {

  useEffect(()=>{
    createEthSSOModal({
      providers: [
        //TODO: enable passing just url instead of object
        {url: "localhost:3000"},
        {url: "sso.chainsafe.io"},
        {url: "mpetrunic.eth"},
        {url: "sso.wallet.connect.com"}
      ]
    })
    void (useEthSSOModal().onProviderSelected((url) => {
      console.log("Selected provider: ", url)
    }))
  },[])

  const openModal = useCallback(async () => {
    await (useEthSSOModal().open())
  }, [])

  const closeModal = useCallback(async () => {
    await (useEthSSOModal().close())
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <button onClick={openModal}>Open Modal</button>
      <button onClick={closeModal}>Close Modal</button>

    </main>
  )
}