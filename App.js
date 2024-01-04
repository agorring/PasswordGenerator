import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Image} from 'react-native';
import * as yup from "yup"
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { Formik } from 'formik';
import {useState} from "react"
import Slider from "@react-native-community/slider"

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
  const [sliderValue, setSliderValue] = useState(10)

  const generatePasswordString = (passwordLength) => {
    let characterList = ""

    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz"
    const digitChars = "0123456789"
    const specialChars = "!@#$%^&*()_+-="

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
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Password Generator</Text>
          <Image source={require('./assets/password.png')}style={styles.image}/>
          
          <View style={styles.passwordBox}>
            {isPassGenerated ? (
            <View style={[styles.card, styles.cardElevated]}>
              <Text selectable style={styles.generatedPassword}>{password}</Text>
            </View>
            ) : null}
          </View>
          </View>
        <View style={styles.formContainer}>
          <Formik
      initialValues={{ passwordLength: 10 }}
        validationSchema={PasswordSchema}
        onSubmit={ values => {
          generatePasswordString(Number(values.passwordLength))
        }}
    >
      {({
        values,
        isValid,
        handleChange,
        handleSubmit,
        handleReset
      }) => (
        <>
        <View style={styles.sliderValueContainer}>
            <Text style={styles.sliderValueText}>Length</Text>
            <Text style={styles.sliderValueText}>{values.passwordLength}</Text>
          </View>
          <View style={styles.slider}>
          <Slider
            style={{ width: 300, height: 40}}
            step={1}
            minimumValue={4}
            maximumValue={16}
            value={values.passwordLength}  // Update the value from Formik values
            onValueChange={(value) => {
              handleChange("passwordLength")(String(value));  // Update Formik values
            }}
            minimumTrackTintColor='#7676ff'
          />
        </View>
        <View style={styles.inputWrapper}>
          <BouncyCheckbox 
            disableBuiltInState 
            isChecked={lowerCase} 
            onPress={() => setLowerCase(!lowerCase)} 
            fillColor='#7676ff'
            borderColor='transparent'
            iconStyle={{ borderRadius: 5 }}
            innerIconStyle={{ borderRadius: 5, backgroundColor: 'transparent' }}
/>
          <Text style={styles.heading}>Lowercase Letters</Text>
        </View>
        <View style={styles.inputWrapper}>
          <BouncyCheckbox disableBuiltInState isChecked={upperCase} onPress={() => setUpperCase(!upperCase)} fillColor='#7676ff' borderColor='transparent'
            iconStyle={{ borderRadius: 5 }}
            innerIconStyle={{ borderRadius: 5, backgroundColor: 'transparent' }}/>
          <Text style={styles.heading}>Uppercase Letters</Text>
        </View>
        <View style={styles.inputWrapper}>
          <BouncyCheckbox disableBuiltInState isChecked={numbers} onPress={() => setNumbers(!numbers)} fillColor='#7676ff' borderColor='transparent'
            iconStyle={{ borderRadius: 5 }}
            innerIconStyle={{ borderRadius: 5, backgroundColor: 'transparent' }}/>
          <Text style={styles.heading}>Numbers</Text>
        </View>
        <View style={styles.inputWrapper}>
          <BouncyCheckbox disableBuiltInState isChecked={symbols} onPress={() => setSymbols(!symbols)} fillColor='#7676ff' borderColor='transparent'
            iconStyle={{ borderRadius: 5 }}
            innerIconStyle={{ borderRadius: 5, backgroundColor: 'transparent' }}/>
          <Text style={styles.heading}>Symbols</Text>
        </View>
        <View style={styles.formActions}>
          <TouchableOpacity disabled={!isValid} style={styles.primaryBtn} onPress={handleSubmit}>
            <Text style={styles.primaryBtnText}>Generate</Text>
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
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appContainer: {flex: 1, flexDirection: "column", marginTop: 75},
  infoContainer: {alignItems: "center"},
  title: {fontSize: 32, fontWeight: "bold" },
  image: {height: 100, width: 100, marginTop: 40, marginBottom: 30},
  passwordBox: {marginBottom: 40, borderColor: "#EEEEEE", borderWidth: 2, width: 300, height: 60, borderRadius: 10, alignItems: "center", justifyContent: "center"},
  formContainer: {flex: 1,},
  inputWrapper: {flex: 1, flexDirection: "row", marginBottom: 20, marginLeft: 50},
  slider: {alignItems: "center", marginBottom: 30},
  sliderValueContainer: {flex: 1, flexDirection: "row", justifyContent: "space-between", marginHorizontal: 30},
  sliderValueText: {fontWeight: "500", fontSize: 16},
  heading: {fontWeight: "500", marginLeft: 10, fontSize: 16},
  formActions: {flex: 1, flexDirection: "row", marginTop: 20, justifyContent: "space-between", marginHorizontal: 50},
  primaryBtn: {backgroundColor: "#7676ff", width: 180, height: 70, borderRadius: 15, justifyContent: "center", alignItems: "center"},
  primaryBtnText: {color: "white", fontWeight:"bold"},
  secondaryBtn: {backgroundColor: "#d8d8ff", width: 100, height: 70, borderRadius: 15, justifyContent: "center", alignItems: "center"},
  secondaryBtnText: {}

});
