import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native';
import KeywordInput from './Components/KeywordInput';
import Button from './Components/Button';
import KeywordList from './Components/KeywordList';
import MainCategory from './Components/MainCategory';
import SubCategory from './Components/SubCategory';
import messaging from '@react-native-firebase/messaging';

let keywordIndex = 0;

// url 직접입력할 때 사용
// const DismissKeyboard = ({ children }) => (
//   <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//     {children}
//   </TouchableWithoutFeedback>
// );

class AddScreen extends Component {
  constructor() {
    super();
    this.state = {
      keywordValue: '',
      keywords: [],
      main_cateValue: '',
      //main_categories: [],
      sub_cateValue: '',
    };
    this.submitKeyword = this.submitKeyword.bind(this);
    this.deleteKeyword = this.deleteKeyword.bind(this);
  }
  keywordChange(keywordValue) {
    this.setState({keywordValue});
  }
  main_cateChange(main_cateValue) {
    this.setState({main_cateValue});
  }
  sub_cateChange(sub_cateValue) {
    this.setState({sub_cateValue});
  }
  submitKeyword() {
    if (
      !this.state.keywordValue ||
      !this.state.main_cateValue ||
      !this.state.sub_cateValue
    ) {
      return Alert.alert('세부사항을 모두 입력해주세요');
    }
    fetch('http://13.125.132.137:3000//keyword/add', {
      method: 'POST',
      headers: {
        'CONTENT-TYPE': 'application/json',
      },
      body: JSON.stringify({
        p_name: this.state.sub_cateValue, //(페이지 이름) 학과명
        keyword: this.state.keywordValue, //(키워드)
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          //console.log(data.r_id);
          //console.log(keywordIndex);
          Alert.alert('키워드 추가 완료');
          //messaging().subscribeToTopic(this.state.keywordValue)
        } else {
          Alert.alert('키워드 추가가 불가능합니다.');
        }
      });
    //.catch((error) => Alert.alert(error));
    Alert.alert('키워드 추가 완료');

    const keyword = {
      title: this.state.keywordValue,
      cate: this.state.sub_cateValue,
      keywordIndex,
    };
    keywordIndex++;
    const keywords = [...this.state.keywords, keyword]; //delete하려면 배열필요함

    messaging().subscribeToTopic(keyword.title); // 입력받은 키워드 값으로 주제구독

    this.setState({keywords, keywordValue: ''});
    this.setState({main_cateValue: ''});
    this.setState({keywords, sub_cateValue: ''});
  }

  deleteKeyword(keywordIndex) {
    let {keywords} = this.state;

    messaging().unsubscribeFromTopic(keywords[keywordIndex].title); // 삭제하려는 키워드 값으로 주제구독취소
    keywords = keywords.filter(
      (keyword) => keyword.keywordIndex !== keywordIndex,
    );

    this.setState({keywords});

    fetch('http://13.125.132.137:3000/keyword/delete', {
      method: 'POST',
      headers: {
        'CONTENT-TYPE': 'application/json',
      },
      body: JSON.stringify({
        r_id: this.state.keywordIndex,
      }),
    })
      .then((response) => {
        //console.log(response);
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          Alert.alert('성공적으로 삭제되었습니다.');
          // 원래 여기가 맞는 자리
          // messaging().unsubscribeFromTopic(keywords[keywordIndex].title); // 삭제하려는 키워드 값으로 주제구독취소
          // keywords = keywords.filter(
          //   (keyword) => keyword.keywordIndex !== keywordIndex,
          // );
        } else {
          //console.log("로그인 실패");
          Alert.alert('삭제가 불가능합니다.');
        }
      });
  }

  render() {
    let {keywordValue, keywords, main_cateValue, sub_cateValue} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_title}>키워드 추가 </Text>
        </View>

        <View style={styles.bottom_container}>
          <KeywordInput
            keywordValue={keywordValue}
            keywordChange={(text) => this.keywordChange(text)}
          />
          <MainCategory
            main_cateValue={main_cateValue}
            main_cateChange={(value) => this.main_cateChange(value)}
          />
          <SubCategory
            main_cateValue={main_cateValue}
            sub_cateValue={sub_cateValue}
            sub_cateChange={(value) => this.sub_cateChange(value)}
          />
          <Button submitKeyword={this.submitKeyword} />

          {/* <View style={{marginTop: 10, borderRadius: 8, width: 320}}>
            <TouchableHighlight
              onPress={() => this.buttonClick()}
              underlayColor={'transparent'}>
              <View style={styles.button}>
                <Text style={styles.buttonTitle}>키워드 불러오기</Text>
              </View>
            </TouchableHighlight>
          </View> */}

          <ScrollView style={styles.scroll}>
            <KeywordList
              deleteKeyword={this.deleteKeyword}
              keywords={keywords}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}
export default AddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 15 : 0, //38
  },
  header: {
    flex: 1,
    borderBottomColor: 'gainsboro', // 회색
    borderBottomWidth: 1.5,
    paddingBottom: 8,
  },
  header_title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: Platform.OS === 'android' ? 0 : 10,
    color: 'dodgerblue',
  },
  bottom_container: {
    flex: 18, //이거 더 증가시키면 헤더 부분 작아짐
    alignItems: 'center',
    paddingBottom: 15,
  },
  button: {
    backgroundColor: 'gainsboro',
    padding: 10,
    borderRadius: 8,
  },
  buttonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
