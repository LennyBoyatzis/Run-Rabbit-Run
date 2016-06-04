/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  MapView,
  Dimensions,
  StatusBarIOS
} from 'react-native'

const { width, height } = Dimensions.get('window')

class MapViewProject extends Component {

  constructor(props) {
    super(props)

    this.state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      routeCoordinates: []
    }
  }

  componentDidMount() {
    StatusBarIOS.setStyle('light-content')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position)
        this.setState({initialPosition})
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let lastPosition = JSON.stringify(position);
      if (lastPosition === this.state.lastPosition) {
        console.log("No Change")
        return
      }
      console.log("Change");
      this.setState({
        lastPosition,
        routeCoordinates: this.state.routeCoordinates.concat(lastPosition)
      })
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  generateRouteCoordinates() {
    return this.state.routeCoordinates.reduce((acc, coord) => {
      try {
        let { latitude, longitude } = JSON.parse(coord).coords
        return acc.concat({ latitude: latitude, longitude: longitude })
      } catch (e) {
        return
      }
    }, [])
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          region={{
            latitude: -33.8820970,
            longitude: 151.2124680,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5
          }}
          mapType='satellite'
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={true}
          overlays={[{
            coordinates: this.generateRouteCoordinates(),
            strokeColor: '#19B5FE',
            lineWidth: 10,
          }]}
        />
        <View style={styles.topBar}><Text style={styles.navText}>Run Rabbit Run</Text></View>
        <View style={styles.stats}>
          <View style={styles.statsInfoGroup}>
            <Text style={styles.statsTextHeader}>DISTANCE</Text>
            <Text style={styles.statsTextContent}>13.9 km</Text>
          </View>
          <View style={styles.statsInfoGroup}>
            <Text style={styles.statsTextHeader}>TIME</Text>
            <Text style={styles.statsTextContent}>1hr 30m</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  topBar: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    height: 64,
    width: width,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  navText: {
    color: '#19B5FE',
    fontSize: 16,
    fontWeight: "700",
    textAlign: 'center',
    paddingTop: 30
  },
  map: {
    flex: 0.7,
    width: width,
    height: height
  },
  stats: {
    position: 'absolute',
    height: 100,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: width,
    padding: 20,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  statsInfoGroup: {
    flex: 1
  },
  statsTextHeader: {
    color: '#fff',
    fontWeight: "400",
    textAlign: 'center'
  },
  statsTextContent: {
    color: '#fff',
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    color: '#19B5FE',
    textAlign: 'center'
  },
});

AppRegistry.registerComponent('MapViewProject', () => MapViewProject);
