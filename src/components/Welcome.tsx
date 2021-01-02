import LinkForm from './LinkForm';
import React, { useCallback } from 'react';
import '../styles/welcome.scss';
import Mockup from './Mockup';
import { useDropzone } from 'react-dropzone';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import useJob from '../hooks/useJob';

function Welcome() {
  const { t } = useTranslation();
  const { setFile } = useJob();

  async function handleFileSelected(files: any[]) {
    if (files && files[0]) {
      setFile(files[0]);
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    handleFileSelected(acceptedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={classnames('row container mt-0 mt-md-10 welcome full-height', { 'drag-mode': isDragActive })} {...getRootProps()}>
      <input {...getInputProps()} accept="video/mp4,video/x-m4v,video/*" />

      <div className="drag-overlay">
        <span>{t('commons.dropFileHere')}</span>
      </div>

      <div className="col">
        <LinkForm />
      </div>
      <div className="col d-none d-lg-block">
        <Mockup />
      </div>
    </div>
  );
}

export default Welcome;
