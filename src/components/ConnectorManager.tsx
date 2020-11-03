import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { connectorState } from '../atoms/connector';
import { jobState } from '../atoms/job';
import { IJobState } from '../interfaces/Job.interface';

const wsAddress = process.env.REACT_APP_WS_ADDRESS || 'ws://localhost:8080';

function ConnectorManager() {
  const [connector, setConnector] = useRecoilState(connectorState);
  const [, setJob] = useRecoilState<IJobState>(jobState);
  useEffect(
    () => {
      let ws: WebSocket | undefined;
      if (!connector.connected) {
        ws = new WebSocket(wsAddress);
      }

      if (!ws) {
        return;
      }

      ws.onopen = () => {
        console.log('Connected');
        setConnector({ ...connector, ws, connected: true, error: false });
      };

      ws.onerror = () => {
        console.error('Connection error');
        setConnector({
          ...connector,
          error: true,
        });
        console.log(connector);
      };

      ws.onmessage = (rawData) => {
        const message = parseMessage(String(rawData.data));
        console.log(`[${message.type}] ${JSON.stringify(message.data)}`);
        switch (message.type) {
          case 'jobState':
            setJob({ ...message.data });
            break;

          default:
            break;
        }
      };

      ws.onclose = () => {
        console.error('Connection closed');
        setConnector({ ...connector, ws: undefined, connected: false, error: true });
        ws = undefined;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return null;
}

function parseMessage(rawData: string): { type: string; data: any } {
  return JSON.parse(rawData) as { type: string; data: any };
}

export default ConnectorManager;
