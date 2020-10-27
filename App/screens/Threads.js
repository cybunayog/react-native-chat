import React from 'react';
import {FlatList} from 'react-native';

import {ThreadRow, Separator} from '../components/ThreadRow';
import {listenToThreads} from 'Chat/App/firebase';

export default class Threads extends React.Component {
  state = {
    threads: [],
  };

  componentDidMount() {
    this.removeThreadListener = listenToThreads().onSnapshot(querySnapshot => {
      // returns array of threads
      const threads = querySnapshot.docs.map(doc => {
        console.log(doc.id, doc.data());
        return {
          _id: doc.id,
          name: '',
          latestMessage: {text: ''},
          ...doc.data(),
        };
      });

      this.setState({threads});
    });
  }

  componentWillUnmount() {
    if (this.removeThreadListener) {
      this.removeThreadListener();
    }
  }

  render() {
    return (
      <FlatList
        data={this.state.threads}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <ThreadRow
            {...item}
            onPress={() =>
              this.props.navigation.navigate('Messages', {thread: item})
            }
            unread={item.unread}
          />
        )}
        ItemSeparatorComponent={() => <Separator />}
      />
    );
  }
}
