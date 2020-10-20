import { atom } from 'recoil';

export interface IConnectorState {
  connected: boolean;
  ws?: WebSocket;
}
export const connectorState = atom<IConnectorState>({
  key: 'connectorState', // unique ID (with respect to other atoms/selectors)
  default: {
    connected: false,
  },
});
