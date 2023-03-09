import React, { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

const TOKEN_ADDRESS = '0x28fDA76721a8077A5dE802Ab0212849B8c38429E'
const API_KEY = 'BJSI8GT581MKCIXWI6VEPE4IC8IQS7IJVSE'

interface Transaction {
  blockNumber: string
  timeStamp: string
  hash: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  isError: string
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage] = useState(10)
  const [gasPriceUSD, setGasPriceUSD] = useState(0)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${TOKEN_ADDRESS}&apikey=${API_KEY}`
      )
      const data = await response.json()
      const latestTransactions = data.result.slice(0, 10000).reverse() // Reverse the results to show the most recent transaction first
      setTransactions(latestTransactions)
      setIsLoading(false)
    }
    fetchTransactions()
  }, [])

  useEffect(() => {
    const fetchGasPriceUSD = async () => {
      const response = await fetch(
        'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=BJSI8GT581MKCIXWI6VEPE4IC8IQS7IJVS'
      )
      const data = await response.json()
      setGasPriceUSD(parseFloat(data.result.SafeGasPrice))
    }
    fetchGasPriceUSD()
  }, [])

  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction)

  const renderValue = (value: string) => {
    const start = value.slice(0, 4)
    const end = value.slice(-4)
    const middle = '...'
    return (
      <span title={value}>
        {start}
        {middle}
        {end}
      </span>
    )
  }

  const formatWei = (value: string) => {
    const units = ['wei', 'kwei', 'Mwei', 'Gwei', 'Arv']
    let val = parseFloat(value)
    let unitIndex = 0
    while (val >= 1000 && unitIndex < units.length - 1) {
      val /= 1000
      unitIndex++
    }
    return (val / 1000000).toFixed(val < 1 ? 12 : val < 1000 ? 9 : 8) + ' ' + units[unitIndex]
  }

  const renderTransactions = () => {
    return (
      <div>
        <table className={styles.transactions}>
          <thead className={styles.tableshell}>
            <tr>
              <th>Trans Hash</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
              {/* <th>Gas Used</th>
              <th>Gas Price</th> */}
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((tx) => (
              <tr key={tx.hash}>
                <td>
                  <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                    {renderValue(tx.hash)}
                  </a>
                </td>
                <td>{renderValue(tx.from)}</td>
                <td>{renderValue(tx.to)}</td>
                <td>{formatWei(tx.value)}</td>
                {/* <td>{tx.gas}</td>
                <td>{formatWei(tx.gasPrice)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderPagination = () => {
    const pageNumbers = []
    const totalPages = Math.ceil(transactions.length / transactionsPerPage)
    const maxPages = 5
    let startPage = 1
    let endPage = totalPages

    if (totalPages > maxPages) {
      const offset = Math.floor(maxPages / 5)
      startPage = currentPage - offset
      endPage = currentPage + offset

      if (startPage < 1) {
        endPage += Math.abs(startPage) + 1
        startPage = 1
      }

      if (endPage > totalPages) {
        startPage -= endPage - totalPages
        endPage = totalPages
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className={styles.pagination1}>
        {/* {pageNumbers.map((number) => (
          <span key={number}>
            <button onClick={() => setCurrentPage(number)}>{number}</button>
          </span>
        ))} */}
      </div>
    )
  }

  return (
    <div className={styles.titleloader}>
      <h3>Latest Transactions</h3>
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : (
        <div>
          {renderTransactions()}
          {renderPagination()}
        </div>
      )}
    </div>
  )
}

export default Transactions