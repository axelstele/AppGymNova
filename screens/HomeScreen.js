import React, { Component } from 'react';
import { View, Text, Button, AsyncStorage, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Header, ListItem  } from 'react-native-elements';
import CalendarStrip from 'react-native-calendar-strip';
import moment from "moment";
import Toast from 'react-native-root-toast';

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
      actividad: 'Fútbol',
      showToast: false,
      textToast: ''
    }
  }

  onChangeDate(date) {
    this.setState({ actividad: 'otra' })
  }

  cerrarSesion() {
    this.setState({ isLoading: true }, async () => {
      await AsyncStorage.removeItem('isLogged');
      this.props.navigation.navigate('Auth');
      this.setState({ isLoading: false });
    })
  }

  onPressActividad(actividad) {
    Alert.alert(
      'Confirmación',
      '¿Está seguro que desea adherirse a la clase de XXXXX en el horario ' + actividad + '?',
      [
        { text: 'Confirmar', onPress: () => this.cargarActividad() },
        {
          text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel',
        },

      ],
      { cancelable: false }
    );
  }

  cargarActividad() {
    this.setState({ textToast: 'Adherido lince!', showToast: true })
  }

  render() {
    const { actividad, showToast, textToast, isLoading } = this.state;

    return (
      <View>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={{ text: 'HOME', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
        />
        <CalendarStrip
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
          data={[{key: '00:00'}, {key: '01:00'}, {key: '02:00'}, {key: '03:00'}, {key: '04:00'}, {key: '05:00'}, {key: '06:00'}, {key: '07:00'},
                 {key: '08:00'}, {key: '09:00'}, {key: '10:00'}, {key: '11:00'}, {key: '12:00'}, {key: '13:00'}, {key: '14:00'}, {key: '15:00'},
                 {key: '16:00'}, {key: '17:00'}, {key: '18:00'}, {key: '19:00'}, {key: '20:00'}, {key: '21:00'}, {key: '22:00'}, {key: '23:00'},
                 {key: '24:00'}]}
          renderItem={({item, index}) =>
            <ListItem
              key={index}
              title={actividad}
              subtitle={item.key}
              bottomDivider
              onPress={() => this.onPressActividad(item.key)}
              titleStyle={{ flex: 1, justifyContent: 'center' }}
            />
          }
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
