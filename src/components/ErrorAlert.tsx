import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { connectorState } from '../atoms/connector';
function ErrorAlert() {
  const [t] = useTranslation();

  const [connector] = useRecoilState(connectorState);

  return (
    <>
      {connector.error && (
        <div className="row p-20">
          <div className="col-12 col-lg-6 offset-lg-3 alert" role="alert">
            <h4 className="alert-heading text-danger">
              <i className="fa fa-exclamation-circle"></i>
              {'  '}
              {t('error.serverUnavailable')}
            </h4>
            <p>{t('error.incidentInProgressDesc')}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ErrorAlert;
