import React, { Component } from 'react';
import { View, Text, AsyncStorage, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Header, Card } from 'react-native-elements';
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

export default class MisClasesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      clasesMiembro: [],
      id_usuario: -1
    }
  }

  componentDidMount() {
    let id_empresa = this.props.navigation.getParam('id_empresa');
    this.setState({ isLoading: true }, async () => {
      let id_usuario = await AsyncStorage.getItem('id_usuario');
      id_usuario = parseInt(id_usuario, 10);
      this.setState({ id_usuario: id_usuario }, async () => {
        await Promise.all([this.refreshClasesMiembro()]);
        this.setState({ isLoading: false });
      })
    })
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

  render() {
    const { isLoading, clasesMiembro } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.openDrawer() }}
          centerComponent={{ text: 'Mis clases', style: { color: '#fff' } }}
          backgroundColor="#212529"
        />
        { clasesMiembro.length == 0 ?
            <Text h3 style={{ textAlign: 'center' }}>No se encontraron clases</Text>
          :
            <FlatList
              data={clasesMiembro}
              extraData={this.state}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) =>
                <Card
                  title={item.clase_actividad}
                  containerStyle={{ backgroundColor: moment(item.clase_fecha+ " " + item.clase_hora_inicio).format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm') ? '#edf0f3' : 'white',
                    borderWidth: moment(item.clase_fecha+ " " + item.clase_hora_inicio).format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm') ? 2 : 0, borderColor: 'black' }}
                  titleStyle={{ backgroundColor: moment(item.clase_fecha+ " " + item.clase_hora_inicio).format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm') ?
                    '#18bc9c' : '#f8cdc8', color: 'black'
                  }}
                >
                  <Text>
                    <Text style={{ fontWeight: 'bold' }}>
                      Fecha:
                    </Text>
                    <Text>{" " + moment(item.clase_fecha).format('DD/MM/YYYY')}</Text>
                  </Text>
                  <Text>
                    <Text style={{ fontWeight: 'bold' }}>
                      Hora inicio:
                    </Text>
                    <Text>{" " +item.clase_hora_inicio}</Text>
                  </Text>
                </Card>
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
