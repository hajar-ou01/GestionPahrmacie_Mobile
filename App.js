import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import Component from './Components/component';

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Component />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
