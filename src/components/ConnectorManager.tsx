import React from 'react';
import { useRecoilState } from 'recoil';
import { connectorState } from '../atoms/connector';
import { jobState } from '../atoms/job';
import { IJobState } from '../interfaces/Job.interface';

const wsAddress = process.env.REACT_APP_WS_ADDRESS || 'ws://localhost:8080';

function ConnectorManager() {
  const [connector, setConnector] = useRecoilState(connectorState);
  const [job, setJob] = useRecoilState<IJobState>(jobState);
  if (!connector.connected) {
    let ws: WebSocket | undefined;
    ws = new WebSocket(wsAddress);
    ws.onopen = () => {
      setConnector({ ...connector, ws, connected: true });
    };

    ws.onmessage = (rawData) => {
      const message = parseMessage(String(rawData.data));
      switch (message.type) {
        case 'jobState':
          setJob({ ...message.data });
          break;

        default:
          break;
      }
    };

    ws.onclose = () => {
      setConnector({ ...connector, ws: undefined, connected: false });
      ws = undefined;
    };
  }

  return null;
}

function parseMessage(rawData: string): { type: string; data: any } {
  return JSON.parse(rawData) as { type: string; data: any };
}

export default ConnectorManager;
