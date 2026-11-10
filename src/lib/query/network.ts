import { onlineManager } from '@tanstack/react-query';
import * as Network from 'expo-network';

export function setupNetworkManager() {
  onlineManager.setEventListener((setOnline) => {
    let initialized = false;

    const subscription = Network.addNetworkStateListener((state) => {
      initialized = true;
      setOnline(!!state.isConnected);
    });

    Network.getNetworkStateAsync()
      .then((state) => {
        if (!initialized) setOnline(!!state.isConnected);
      })
      .catch(() => {
        if (!initialized) setOnline(false);
      });

    return () => subscription.remove();
  });
}
