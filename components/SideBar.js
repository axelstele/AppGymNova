import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon, Text } from 'react-native-elements';

const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider1: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    marginTop: 15,
  },
  divider2: {
    width: '100%',
    height: 1,
    backgroundColor: '#e2e2e2',
  }
});

export default class SideBar extends Component {
  constructor(props) {
    super(props);

    this.items = [
      {
        navOptionThumb: 'home',
        navOptionName: 'Inicio',
        screenToNavigate: 'Home',
      },
      {
        navOptionThumb: 'sign-out',
        navOptionName: 'Salir',
        screenToNavigate: 'Login',
      }
    ];
  }

  render() {
    return (
      <View style={styles.sideMenuContainer}>
        {/*Top Large Image */}
        <View style={styles.sideMenuHeader}>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            Gimnasio Nova
          </Text>
        </View>
        <View style={styles.divider1}/>
        <View style={{ width: '100%' }}>
          {this.items.map((item, key) => (
            <TouchableOpacity
              key={key}
              onPress={() => {global.currentScreenIndex = key; this.props.navigation.closeDrawer(); this.props.navigation.navigate(item.screenToNavigate)}}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff',
                }}
              >
                <View style={{ marginRight: 10, marginLeft: 20 }}>
                  <Icon name={item.navOptionThumb} size={25} color="#808080" type='font-awesome'/>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {item.navOptionName}
                </Text>
              </View>
              <View style={styles.divider2}/>
            </TouchableOpacity>
          ))}
        </View>
        {/*<View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../img/app.png')}
            style={{height: 200, width: 200, resizeMode: 'contain', flex: 1, justifyContent: 'flex-end' }}
          />
        </View>*/}
      </View>
    );
  }
}
