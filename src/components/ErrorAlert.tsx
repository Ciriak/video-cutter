import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import store from '../store';
import '../styles/alert.scss';
function ErrorAlert() {
  const [t] = useTranslation();

  useEffect(() => {});

  return (
    <>
      {store.connector.error && (
        <div className="row p-20 error-alert">
          <div className="col-12 col-lg-6 offset-lg-3 alert" role="alert">
            <button className="close" data-dismiss="alert" type="button" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
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
