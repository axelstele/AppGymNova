import React, { Component } from 'react';
import { View, Text, Button, AsyncStorage, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Header, ListItem, Icon } from 'react-native-elements';
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
      selectedDate: moment(),
      clases: [],
      selectedClase: -1,
      id_usuario: -1,
      clasesMiembro: []
    }
  }

  componentDidMount() {
    let id_empresa = this.props.navigation.getParam('id_empresa');
    this.setState({ isLoading: true }, async () => {
      let id_usuario = await AsyncStorage.getItem('id_usuario');
      id_usuario = parseInt(id_usuario, 10);
      this.setState({ id_usuario: id_usuario }, async () => {
        await Promise.all([this.refreshClases(), this.refreshClasesMiembro()]);
        this.setState({ isLoading: false });
      })
    })
  }

  async refreshClases() {
    const { selectedDate } = this.state;

    try {
      const res = await axios.post(uri + '/api/get_clases', {
        dia: selectedDate.format('YYYY-MM-DD'),
        empresa: '1'
      });

      this.setState({ clases: res.data });
    }
    catch(error) {
      console.log(error);
    }

  }

  async refreshClasesMiembro() {
    const { id_usuario } = this.state;

    try {
      const res = await axios.post(uri + '/api/get_clases_miembro', {
        empresa: '1',
        id_usuario: id_usuario
      });

      this.setState({ clasesMiembro: res.data });
    }
    catch(error) {
      console.log(error);
    }
  }

  onChangeDate(selectedDate) {
    this.setState({ isLoading: true, selectedDate }, async () => {
      await Promise.all([this.refreshClases(), this.refreshClasesMiembro()]);
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
      let res = await axios.post(uri + '/api/adherir_clase', {
        empresa: '1',
        id_clase: clase.id,
        id_usuario: id_usuario
      });

      // Add a Toast on screen.
      let toast = Toast.show(res.data.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        textColor: 'black',
        backgroundColor: '#18bc9c'
      });

      await Promise.all([this.refreshClases(), this.refreshClasesMiembro()]);
      this.setState({ isLoading: false });
    })
  }

  onCancelarClase(clase) {
    Alert.alert(
      'Confirmación',
      '¿Está seguro que desea eliminarse de la clase de ' + clase.clase_actividad +' en el horario de las ' + clase.clase_hora_inicio + '?',
      [
        { text: 'Confirmar', onPress: () => this.confirmarCancelarClase(clase) },
        {
          text: 'Cancel', style: 'cancel',
        },

      ],
      { cancelable: false }
    )
  }

  confirmarCancelarClase(clase) {
    const { id_usuario } = this.state;

    this.setState({ isLoading: true }, async () => {
      let res = await axios.post(uri + '/api/cancelar_clase', {
        empresa: '1',
        id_clase: clase.id,
        id_usuario: id_usuario
      });

      // Add a Toast on screen.
      let toast = Toast.show(res.data.message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        textColor: 'black',
        backgroundColor: '#18bc9c'
      });

      await Promise.all([this.refreshClases(), this.refreshClasesMiembro()]);
      this.setState({ isLoading: false });
    })
  }

  render() {
    const { isLoading, selectedDate, selectedClase, clases, clasesMiembro } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={{ text: 'Clases', style: { color: '#fff' } }}
          backgroundColor="#212529"
        />
        <CalendarStrip
          selectedDate={selectedDate}
          calendarAnimation={{type: 'sequence', duration: 100}}
          daySelectionAnimation={{type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'black'}}
          calendarHeaderStyle={{color: 'black'}}
          calendarColor={'white'}
          dateNumberStyle={{color: 'black'}}
          dateNameStyle={{color: 'black'}}
          highlightDateNumberStyle={{color: 'black'}}
          highlightDateNameStyle={{color: 'black'}}
          disabledDateNameStyle={{color: 'grey'}}
          disabledDateNumberStyle={{color: 'grey'}}
          onDateSelected={(date) => this.onChangeDate(date)}
          style={{height:100, paddingTop: 10, paddingBottom: 10}}
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
        { clases.length == 0 ?
            <Text h3 style={{ textAlign: 'center' }}>No se encontraron clases</Text>
          :
            <FlatList
              data={clases}
              extraData={this.state}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) =>
                <ListItem
                  title={item.clase_actividad}
                  containerStyle={{ backgroundColor: 'white' }}
                  subtitle={item.clase_hora_inicio + " hs."}
                  bottomDivider
                  onPress={() => this.onPressActividad(item) }
                  titleStyle={{ flex: 1, justifyContent: 'center' }}
                  disabled={ (item.clase_cupos - item.clase_cupos_actual >= item.clase_cupos) || item.clase_cancelada || !item.clase_activo ||
                    moment(item.clase_fecha+ " " + item.clase_hora_inicio).format('YYYY-MM-DD HH:mm') < moment().format('YYYY-MM-DD HH:mm') ||
                    clasesMiembro.some(claseMiembro => claseMiembro.clase_id == item.id)
                  }
                  disabledStyle={{ backgroundColor: clasesMiembro.some(claseMiembro => claseMiembro.clase_id == item.id) &&
                    moment(item.clase_fecha+ " " + item.clase_hora_inicio).format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm') ? '#18bc9c' : 'grey' }}
                  badge={moment(item.clase_fecha+ " " + item.clase_hora_inicio).format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm') ?
                    { value: item.clase_cupos - item.clase_cupos_actual + '/' + item.clase_cupos,
                      textStyle: { color: 'black'}, badgeStyle: { backgroundColor: 'white'} } : undefined}
                  rightIcon={
                    clasesMiembro.some(claseMiembro => claseMiembro.clase_id == item.id) &&
                      moment(item.clase_fecha+ " " + item.clase_hora_inicio).format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm') ?
                      <Icon
                        size={32}
                        onPress={() => this.onCancelarClase(item)}
                        name='times-circle'
                        type='font-awesome'
                      />
                    : null
                  }
                />
              }
            />
        }
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
