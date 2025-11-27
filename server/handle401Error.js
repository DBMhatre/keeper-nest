// server/handle401Error.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { account, databases } from './appwrite';
import eventEmitter, { EVENTS } from './EventService';

export const handleGlobal401Error = async () => {
  console.log('Global 401 error handler triggered');
  
  try {
    // Clear all stored data
    await AsyncStorage.multiRemove(['rememberMe', 'userEmail']);
    await Keychain.resetGenericPassword({ service: 'KeeperNestApp' });
    
    // Clear Appwrite session
    try {
      await account.deleteSession('current');
    } catch (sessionError) {
      console.log('No active session to delete');
    }
    
    console.log('All credentials cleared due to 401 error');
    
    // Emit event to notify navigation to redirect to login
    eventEmitter.emit(EVENTS.SESSION_EXPIRED);
    
  } catch (error) {
    console.log('Error in 401 handler:', error);
  }
};

export const setupGlobalErrorHandler = () => {
  console.log('Setting up global error handler');
  
  // Wrap Appwrite database methods to handle 401 errors
  const originalMethods = {
    listDocuments: databases.listDocuments,
    createDocument: databases.createDocument,
    updateDocument: databases.updateDocument,
    deleteDocument: databases.deleteDocument
  };

  // Wrap each method with 401 handling
  Object.keys(originalMethods).forEach(methodName => {
    databases[methodName] = async (...args) => {
      try {
        return await originalMethods[methodName].apply(databases, args);
      } catch (error) {
        // Check for 401 error
        if (error.code === 401 || 
            error.response?.code === 401 || 
            error.message?.includes('401') ||
            error.type === 'unauthorized') {
          console.log(`401 error detected in ${methodName}`);
          await handleGlobal401Error();
        }
        throw error;
      }
    };
  });

  // Also wrap account methods
  const originalAccountGet = account.get;
  account.get = async () => {
    try {
      return await originalAccountGet.call(account);
    } catch (error) {
      if (error.code === 401) {
        console.log('401 error in account.get');
        await handleGlobal401Error();
      }
      throw error;
    }
  };
};