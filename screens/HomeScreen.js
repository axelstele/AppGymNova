import React, { Component } from 'react';
import { View, Text, Button, AsyncStorage, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Header, ListItem  } from 'react-native-elements';
import CalendarStrip from 'react-native-calendar-strip';
import moment from "moment";
import Toast from 'react-native-root-toast';
import axios from 'axios';

import Constants from "expo-constants";
const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:8000`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      showToast: false,
      textToast: '',
      selectedDate: new Date(),
      clases: [],
      selectedClase: -1,
      id_usuario: -1
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true }, async () => {
      let id_usuario = await AsyncStorage.getItem('id_usuario');
      id_usuario = parseInt(id_usuario, 10);
      this.setState({ id_usuario }, async () => {
        await this.refreshClases();
        this.setState({ isLoading: false });
      })
    })
  }

  async refreshClases() {
    const { selectedDate } = this.state;

    try {
      let res = await axios.post(uri + '/api/get_clases', {
        dia: selectedDate,
        empresa: '1'
      });
      this.setState({ clases: res.data });
    }
    catch(error) {
      console.log(error);
    }
  }

  onChangeDate(selectedDate) {
    this.setState({ isLoading: true, selectedDate }, async () => {
      await this.refreshClases();
      this.setState({ isLoading: false });
    })
  }

  cerrarSesion() {
    this.setState({ isLoading: true }, async () => {
      await AsyncStorage.removeItem('isLogged');
      await AsyncStorage.removeItem('id_usuario');
      this.setState({ isLoading: false }, () => {
        this.props.navigation.navigate('Auth');
      })
    })
  }

  onPressActividad(clase) {
    Alert.alert(
      'Confirmación',
      '¿Está seguro que desea adherirse a la clase de ' + clase.clase_actividad +' en el horario de las ' + clase.clase_hora_inicio + '?',
      [
        { text: 'Confirmar', onPress: () => this.adherirClase(clase) },
        {
          text: 'Cancel', style: 'cancel',
        },

      ],
      { cancelable: false }
    )
  }

  adherirClase(clase) {
    const { id_usuario } = this.state;

    this.setState({ isLoading: true }, async () => {
      try {
        let res = await axios.post(uri + '/api/adherir_clase', {
          empresa: '1',
          id_clase: clase.id,
          id_usuario: id_usuario
        });

        this.setState({ textToast: res.data.message, showToast: true }, async () => {
          await this.refreshClases();
          this.setState({ isLoading: false });
        })
      }
      catch(error) {
        console.log(error);
      }
    })
  }

  render() {
    const { showToast, textToast, isLoading, selectedDate, selectedClase, clases } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={{ text: 'Clases', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <CalendarStrip
          selectedDate={selectedDate}
          calendarAnimation={{type: 'sequence', duration: 100}}
          daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white'}}
          calendarHeaderStyle={{color: 'white'}}
          calendarColor={'#7743CE'}
          dateNumberStyle={{color: 'white'}}
          dateNameStyle={{color: 'white'}}
          highlightDateNumberStyle={{color: 'yellow'}}
          highlightDateNameStyle={{color: 'yellow'}}
          disabledDateNameStyle={{color: 'grey'}}
          disabledDateNumberStyle={{color: 'grey'}}
          onDateSelected={(date) => this.onChangeDate(date)}
          style={{height:150, paddingTop: 20, paddingBottom: 10}}
          refreshing={isLoading}
          locale={{
            name:'es',
            config: {
              months : 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
              monthsShort : 'ene._feb._mar_abr._may_jun_jul._ago_sep._oct._nov._dic.'.split('_'),
              weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
              weekdaysShort : 'dom_lun_mar_mie_jue_vie_sab'.split('_'),
              weekdaysMin : 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),}
          }}
        />
        <FlatList
          data={clases}
          renderItem={({item}) =>
            <ListItem
              title={item.clase_actividad}
              subtitle={item.clase_hora_inicio}
              bottomDivider
              onPress={() => this.onPressActividad(item)}
              titleStyle={{ flex: 1, justifyContent: 'center' }}
              disabled={(item.clase_cupos_actual >= item.clase_cupos) || item.clase_cancelada || !item.clase_activo}
              disabledStyle={{ backgroundColor: 'grey' }}
              badge={{ value: item.clase_cupos_actual + '/' + item.clase_cupos, containerStyle: { marginTop: -20 } }}
            />
          }
          keyExtractor={item => item.id.toString()}
        />
        <Toast
          visible={showToast}
          position={50}
          shadow={false}
          animation={false}
          hideOnPress={true}
        >
          {textToast}
        </Toast>
        { isLoading &&
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',
              backgroundColor: 'rgba(52, 52, 52, 0.7)'
            }}>
              <ActivityIndicator color='#000' />
            </View>
        }
      </View>
    )
  }
}
