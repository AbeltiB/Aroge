import { useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { verifyOtp } from '../api/auth.api'
import * as SecureStore from 'expo-secure-store'

export default function OtpScreen({ route }: any) {
  const { phone } = route.params
  const [code, setCode] = useState('')

  const handleVerify = async () => {
    const res = await verifyOtp(phone, code)
    await SecureStore.setItemAsync('token', res.data.token)
    alert('Logged in!')
  }

  return (
    <View style={{ marginTop: 80, padding: 20 }}>
      <Text>Enter OTP</Text>
      <TextInput value={code} onChangeText={setCode} />
      <Button title="Verify" onPress={handleVerify} />
    </View>
  )
}