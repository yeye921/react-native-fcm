import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
const KeywordInput = ({keywordValue, keywordChange}) => (
  <View style={styles.keword_in}>
    <TextInput
      value={keywordValue}
      fontSize={16}
      textAlign="center"
      placeholder="알림을 받아보고 싶은 키워드를 입력하세요."
      placeholderTextColor="rgba(0,0,0,0.6)"
      onChangeText={keywordChange}
    />
  </View>
);
const styles = StyleSheet.create({
  keword_in: {
    height: Platform.OS === 'android' ? 45 : 50,
    width: Platform.OS === 'android' ? 320 : 330,
    backgroundColor: 'whitesmoke',
    marginTop: Platform.OS === 'android' ? 15 : 20,
    borderRadius: Platform.OS === 'android' ? 0 : 6,
  },
});
export default KeywordInput;
