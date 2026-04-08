import { useState } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import { sendOtp } from '../api/auth.api'

export default function PhoneScreen({ navigation }: any) {
  const [phone, setPhone] = useState('')

  const handleSend = async () => {
    await sendOtp(phone)
    navigation.navigate('Otp', { phone })
  }

  return (
    <View style={{ marginTop: 80, padding: 20 }}>
      <Text>Enter Phone (+251...)</Text>
      <TextInput value={phone} onChangeText={setPhone} />
      <Button title="Send OTP" onPress={handleSend} />
    </View>
  )
}