import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Actions, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);

  const pickImage = () => {
    const options = {
      noData: true,
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.uri) {
        const newMessage = {
          _id: messages.length + 1,
          text: '',
          createdAt: new Date(),
          user: {
            _id: 1,
            name: 'User',
          },
          image: response.uri,
        };
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));
      }
    });
  };

  const renderActions = (props) => (
    <Actions
      {...props}
      options={{
        ['Choisir depuis la bibliothèque']: pickImage,
      }}
      icon={() => <Icon name="photo" size={30} color="#007aff" />}
    />
  );

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <Icon name="send" size={30} color="#007aff" />
      </View>
    </Send>
  );

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      placeholder="Écrivez un message..."
    />
  );

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { ...styles.bubbleRight },
        left: { ...styles.bubbleLeft },
      }}
      textStyle={{
        right: { ...styles.textRight },
        left: { ...styles.textLeft },
      }}
    />
  );

  const renderChatFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Burba Discussion</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Icon name="settings" size={30} color="#007aff" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Paramètres</Text>
            <TouchableHighlight
              style={styles.openButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Fermer</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderChatFooter()}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: 1 }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderActions}
        renderSend={renderSend}
        timeFormat='LT'
        dateFormat='LL'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    backgroundColor: '#ffffff',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  bubbleRight: {
    backgroundColor: '#007aff',
    borderRadius: 15,
    padding: 5,
  },
  bubbleLeft: {
    backgroundColor: '#e5e5ea',
    borderRadius: 15,
    padding: 5,
  },
  textRight: {
    color: '#ffffff',
  },
  textLeft: {
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ChatScreen;
