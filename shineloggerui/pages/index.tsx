import type { NextPage } from 'next'
import { useEffect,useState,useCallback,useContext,useMemo } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [count, setCount] = useState(0)

    const increment = useCallback(() => {
        setCount(prevState => {
            return prevState + 1
        })
    }
    ,[count])

    const decrement = useCallback(() => {
        if(count > 0){
            setCount(prevState => {
                return prevState - 1
            })
        }
    }   ,[count])

  return (
  <>
    <div className={`flex justify-center`}>
      <h2 className={`text-7xl`}>{count}</h2>
        <button onClick={increment} className={`text-5xl text-blue-50 rounded pl-5 pr-5 pt-1 pb-1 m-2 border-amber-900 border-2 bg-green-300`}>+</button>
        <button onClick={decrement} className={`text-5xl text-blue-50 rounded pl-5 pr-5 pt-1 pb-1 m-2 border-red-600 border-2 bg-red-400`}>-</button>
    </div>
  </>
  )
}

export default Home
