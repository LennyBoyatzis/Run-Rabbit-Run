import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  MapView,
  Dimensions,
  Navigator
} from 'react-native'

const { width, height } = Dimensions.get('window')

class MapViewComponent extends Component {

  constructor(props) {
    super(props)

    this.state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown'
    }
  }

  componentDidMount() {
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
      this.setState({lastPosition})
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <MapView
        region={{
          latitude: -33.8820970,
          longitude: 151.2124680,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5
        }}
        style={styles.map}
        showsUserLocation={true}
        followUserLocation={true}
        overlays={[{
          coordinates:[
            {latitude: -33.8820970, longitude: 151.2124680},
            {latitude: -33.883, longitude: 151.213},
            {latitude: -33.884, longitude: 151.214},
            {latitude: -33.885, longitude: 151.215},
          ],
          strokeColor: '#19B5FE',
          lineWidth: 10,
        }]}
      />
    )
  }
}

const styles = StyleSheet.create({
  map: {
    height: height,
    width: width
  }
})

module.exports = MapViewComponent
