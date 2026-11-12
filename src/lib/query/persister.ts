import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'FORGEFIT_REACT_QUERY_CACHE',
  throttleTime: 1000,
});

export const persistOptions = {
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // * 7 days
  dehydrateOptions: {
    shouldDehydrateMutation: (mutation: any) =>
      mutation.state.status === 'paused',
  },
};
