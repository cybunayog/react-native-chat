import firebase from 'react-native-firebase';
import {uniqueNamesGenerator} from 'unique-names-generator';

export const currentUser = () => firebase.auth().currentUser.toJSON();

export const signIn = () => {
  return firebase
    .auth()
    .signInAnonymously()
    .then(({user}) => {
      return user.updateProfile({displayName: uniqueNamesGenerator()});
    });
};

export const listenToMessages = threadId => {
  return firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    .doc(threadId)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc');
};

export const createMessage = async (threadId, text) => {
  const user = firebase.auth().currentUser.toJSON();
  await firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    .doc(threadId)
    .set(
      {
        latestMessage: {
          text,
          createdAt: new Date().getTime(),
        },
      },
      {merge: true},
    );

  return firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    .doc(threadId)
    .collection('MESSAGES')
    .add({
      text,
      createdAt: new Date().getTime(),
      user: {
        _id: user.uid,
        displayName: user.displayName,
      },
    });
};

export const createNewThread = name => {
  return firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    .add({
      name: name,
      latestMessage: {
        text: `${name} created.`,
        createdAt: new Date().getTime(),
      },
    })
    .then(docRef => {
      docRef.collection('MESSAGES').add({
        text: `${name} created.`,
        createdAt: new Date().getTime(),
        system: true,
      });
    });
};

export const listenToThreads = () => {
  return firebase
    .firestore()
    .collection('MESSAGE_THREADS')
    .orderBy('latestMessage.createdAt', 'desc');
};
