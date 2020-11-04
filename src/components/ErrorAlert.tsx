import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import store from '../store';
function ErrorAlert() {
  const [t] = useTranslation();

  const [canShow, setCanShow] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setCanShow(true);
    }, 4000);
  });

  return (
    <>
      {!store.connector.socket?.connected && canShow && (
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
