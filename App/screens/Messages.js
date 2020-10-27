import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';

import {listenToMessages, createMessage, currentUser} from 'Chat/App/firebase';

export default class Messages extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    const thread = this.props.navigation.getParam('thread');
    this.removeMessagesListener = listenToMessages(thread._id).onSnapshot(
      querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          // System message
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          // If message didn't come from the system
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName,
            };
          }

          return data;
        });

        this.setState({messages});
      },
    );
  }

  componentWillUnmount() {
    if (this.removeMessagesListener) {
      this.removeMessagesListener();
    }
  }

  handleSend = async messages => {
    const text = messages[0].text;
    // Locates the thread being used to send a message.
    const thread = this.props.navigation.getParam('thread');

    createMessage(thread._id, text);
  };

  render() {
    const user = currentUser();

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.handleSend}
        user={{_id: user.uid}}
      />
    );
  }
}
