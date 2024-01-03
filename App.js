import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';
import * as yup from "yup"
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Formik } from 'formik';
import {useState} from "react"

const PasswordSchema = yup.object().shape({
  passwordLength: yup.number().min(4, "Should be a min of 4 characters").max(16, "Should be a max of 16 characters").required("Length is required")
})

export default function App() {

  const [password, setPassword] = useState("")
  const [isPassGenerated, setIsPassGenerated] = useState(false)

  const [lowerCase, setLowerCase] = useState(true)
  const [upperCase, setUpperCase] = useState(false)
  const [numbers, setNumbers] = useState(false)
  const [symbols, setSymbols] = useState(false)

  const generatePasswordString = (passwordLength) => {
    let characterList = ""

    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz"
    const digitChars = "0123456789"
    const specialChars = "!@#$%^&*()_+"

    if(upperCase) {
      characterList+= upperCaseChars
    }
    if(lowerCase) {
      characterList+= lowerCaseChars
    }
    if(numbers) {
      characterList+= digitChars
    }
    if(symbols) {
      characterList+= specialChars
    }

    const passwordResult = createPassword(characterList, passwordLength)

    setPassword(passwordResult)
    setIsPassGenerated(true)

  }

  const createPassword = (characters, passwordLength) => {
      let result = ""
      for (let i = 0; i < passwordLength; i++) {
        const characterIndex = Math.round(Math.random() * characters.length)
        result += characters.charAt(characterIndex)
      }
      return result
  }

  const resetPasswordState = () => {
    setPassword("")
    setIsPassGenerated(false)
    setLowerCase(true)
    setUpperCase(false)
    setNumbers(false)
    setSymbols(false)
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Password Generator</Text>
          <Formik
       initialValues={{ passwordLength: "" }}
        validationSchema={PasswordSchema}
        onSubmit={ values => {
          console.log("hi")
          console.log(values)
          generatePasswordString(Number(values.passwordLength))
        }}
     >
       {({
         values,
         errors,
         touched,
         isValid,
         handleChange,
         handleSubmit,
         handleReset
       }) => (
        <>
        <View style={styles.inputWrapper}>
          <View style={styles.inputColumn}>
            <Text style={styles.heading}>Password Length</Text>
            {touched.passwordLength && errors.passwordLength && (
              <Text style={styles.errorText}>{errors.passwordLength}</Text>
            )}
          </View>
          <TextInput 
            style={styles.inputStyle} 
            value={values.passwordLength} 
            onChangeText={handleChange("passwordLength")} 
            placeholder='Ex. 8' 
            keyboardType='numeric'
            />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.heading}>Include lowercase</Text>
          <BouncyCheckbox disableBuiltInState isChecked={lowerCase} onPress={() => setLowerCase(!lowerCase)} fillColor='#29AB87'/>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.heading}>Include uppercase</Text>
          <BouncyCheckbox disableBuiltInState isChecked={upperCase} onPress={() => setUpperCase(!upperCase)} fillColor='#FED85D'/>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.heading}>Include numbers</Text>
          <BouncyCheckbox disableBuiltInState isChecked={numbers} onPress={() => setNumbers(!numbers)} fillColor='#C9A0DC'/>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.heading}>Include special characters</Text>
          <BouncyCheckbox disableBuiltInState isChecked={symbols} onPress={() => setSymbols(!symbols)} fillColor='#FC80A5'/>
        </View>
        <View style={styles.formActions}>
          <TouchableOpacity disabled={!isValid} style={styles.primaryBtn} onPress={handleSubmit}>

            <Text style={styles.primaryBtnText}>Generate Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => {
            handleReset()
            resetPasswordState()
          }}>
            <Text style={styles.secondaryBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>
        </>
       )}
          </Formik>
        </View>
        {isPassGenerated ? (
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.subtitle}>Result:</Text>
            <Text style={styles.description}>Long press to copy</Text>
            <Text selectable style={styles.generatedPassword}>{password}</Text>
          </View>
        ) : null}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appContainer: {flex: 1, flexDirection: "column"},
  formContainer: {},
  title: {},
  inputWrapper: {flex: 1, flexDirection: "row"},
  heading: {},
  primaryBtn: {},
  primaryBtnText: {}
});
