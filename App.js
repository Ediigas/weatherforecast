import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { EvilIcons } from '@expo/vector-icons';
import MainCard from './componentes/MainCard';
import InfoCard from './componentes/InfoCard';
import * as Location from 'expo-location';
import getCurrentWeather from './api/ConsultaApi'



export default function App() {


  const [darkTheme, setDarkTheme] = useState(true)
  const [currentTemperature, setCurrentTemperature] = useState('38')
  const [location, setLocation] = useState('BR, São Paulo')
  const [ currentHour, setCurrentHour] = useState('13:00')
 
  const [wind, setWind] = useState('65')
  const [umidity, setUmidity] = useState('80')
  const [tempMin, setTempMin] = useState('21')
  const [tempMax, setTempMax] = useState('40')
  const [locationCoords, setLocationCoords] = useState([])


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkTheme ? '#232634' : '#f2f2f2',
      alignItems: 'center',
    },
    temperature: {
      alignItems: "center",
      flexDirection: "row",
      marginTop: 10,
    },
    temperatureText: {
      color: darkTheme ? '#e0e0e0' : 'black',
      fontSize: 50,
    },
    refreshButton: {
      position: "absolute",
      margin: 30,
      alignSelf: 'flex-start',
    },
    cardView:{
      color: darkTheme ? 'black' : 'white',
      margin: 10,
      flexDirection: 'row',
      alignItems:"center",
      justifyContent: "center",
    },
    info:{
      alignItems: "center",
      backgroundColor: darkTheme ? '#393e54' : '#8f8f8f',
      borderRadius: 20,
      width:350,
      height: 230,
    },
    infoText:{
      color: darkTheme ? '#e0e0e0' : '#f2f2f2',
      margin: 15,
      fontSize: 20,
      fontWeight: 'bold',
    },
    infoCards:{
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    themeButton:{
      margin: 10,
      marginLeft: 300,
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    squareButton:{
      backgroundColor: darkTheme ? '#f2f2f2' : '#8f8f8f',
      justifyContent: "center",
      borderRadius: 20,
      marginRight: 20,
      width: 50,
      height: 25,   
    },
    circleButton: {
      backgroundColor: darkTheme ? '#232634' : '#f2f2f2',
      alignSelf: darkTheme ? 'flex-end' : 'flex-start',
      margin: 5,
      width: 25,
      height: 20,
      borderRadius: 50,    
    } 
  });
 // dados pegos na api de localizaçao que converte 
  async function setCurrentWeather() {
     await getLocation()

    //chama a hora atual
    let date = new Date()
    setCurrentHour(date.getHours() + ':' + date.getMinutes())

    const data = await getCurrentWeather(locationCoords)
    //Current, min, max, location.wind.humidity dados do API DE localizaçao
    setCurrentTemperature(convertKelvinInC(data[0]))
    setTempMin(convertKelvinInC(data[1]))
    setTempMax(convertKelvinInC(data[2]))
    setLocation(data[3])
    setWind(data[4])
    setUmidity(data[5])
  }

  //Funcao que converte a temperatura em kelvin para decimal
  function convertKelvinInC(Kelvin){
    return parseInt(Kelvin - 273)
  }
 // essa function chama a permissão da sau localização atual
  async function getLocation() {
    let { status } = await Location.requestPermissionsAsync()
    if ( status !== 'granted'){
      setErrorMsg('Sem permição')
    }else{
      let location = await Location.getCurrentPositionAsync({})
      await setLocationCoords(location.coords)
     
    }
  }
  useEffect(() => {
    setCurrentWeather()
  }, [])



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setCurrentWeather()} style={styles.refreshButton}>
        <EvilIcons name="refresh" size={50} color={darkTheme ? 'white' : 'black'} />
      </TouchableOpacity>

      <Feather name='sun' style={{ marginTop: 55 }} size={40} color='orange' />
      <View style={styles.temperature}>
        <Text style={styles.temperatureText}>{currentTemperature}</Text>
        <Text style={[styles.temperatureText, { fontSize: 14 }]}>ºC</Text>
      </View>

      <Text style={[styles.temperatureText, {fontSize: 14}]}>{location}, {currentHour}</Text>

      <View style={styles.cardView}>
        <MainCard title={"Manhã"} backgroundColor={darkTheme ? '#ff873d' : '#cc6e30'} temperature={'21º'} icon={'morning'}></MainCard>
        <MainCard title={"Tarde"} backgroundColor={darkTheme ? '#D29600' : '#FCC63F'} temperature={'38º'}  icon={'afternoon'}></MainCard>       
        <MainCard title={"Noite"} backgroundColor={darkTheme ? '#008081' : '#38B7B8'} temperature={'34º'}  icon={'night'}></MainCard>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}> Informaçoes adcionais</Text>
          <View style={styles.infoCards}>
            <InfoCard title={'Vento'} value={wind + 'm/h'}></InfoCard>
            <InfoCard title={'Umidade'} value={umidity + '%'}></InfoCard>
            <InfoCard title={'Tempo.Min'} value={tempMin}></InfoCard>
            <InfoCard title={'Tempo.Max'} value={tempMax }></InfoCard>
          </View>
       </View>

       <View style={styles.themeButton}>
         <View style={styles.squareButton}>
           <TouchableOpacity style={styles.circleButton} onPress={ () => darkTheme ? setDarkTheme(false) : setDarkTheme(true)}>

           </TouchableOpacity>

         </View>
       </View>
    </View>
  );
}


