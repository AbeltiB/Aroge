import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import axios from 'axios'

export default function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    axios
      .get('http://192.168.1.4:3001/hello') // ← replace with YOUR IP
      .then((res) => setMessage(res.data.message))
      .catch((err) => {
        console.log(err)
        setMessage('Error connecting to API')
      })
  }, [])

  return (
    <View style={{ marginTop: 80, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Mobile App
      </Text>
      <Text style={{ marginTop: 20 }}>{message}</Text>
    </View>
  )
}