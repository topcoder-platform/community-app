import React from 'react';
import PT from 'prop-types';
import Dropzone from 'react-dropzone';
import cn from 'classnames';
import BtnDeletePhoto from 'assets/images/btn-delete-photo.svg';
import PhotoVideoItem from '../PhotoVideoItem';

import './styles.scss';

/**
 * PhotoVideoPicker component
 */
function PhotoVideoPicker({
  onFilePick,
  btnText,
  infoText,
  infoTextMobile,
  options,
  errorMsg,
  className,
  inputOptions,
  file,
}) {
  const renderUpload = () => (
    <React.Fragment>
      <p styleName="infoText hide-mobile">
        {infoText}
      </p>
      <button styleName="btn hide-mobile" type="button">{btnText}</button>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Dropzone
        onDrop={(acceptedFiles) => {
          onFilePick([
            ...file,
            ...acceptedFiles,
          ]);
        }}
        {...options}
        accept={['image/jpeg', 'image/png', 'video/mp4', 'video/x-msvideo', 'video/webm']}
        maxFiles={3}
      >
        {({ getRootProps, getInputProps }) => (
          <div styleName="wrapper-container">
            {
              file && file.length ? (
                <div styleName="photo-list hide-desktop show-mobile">
                  {file.map((fileInfo, index) => (
                    <div
                      styleName="photo-item"
                      key={fileInfo.name}
                    ><PhotoVideoItem notSelectable file={fileInfo} />
                      <button
                        type="button"
                        styleName="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const newFile = [...file];
                          newFile.splice(index, 1);
                          onFilePick(newFile);
                        }}
                      ><BtnDeletePhoto />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null
            }
            {
              file.length <= 3 ? (
                <React.Fragment>

                  <section
                    styleName={cn('container', { hasError: !!errorMsg, hasFile: !!file && !!file.length, 'hide-mobile': file.length === 3 })}
                    {...getRootProps()}
                    className={cn(className, getRootProps().className)}
                  >
                    <input {...getInputProps({
                      ...inputOptions,
                      accept: 'image/*, video/*',
                    })}
                    />
                    {
                      file && file.length ? (
                        <div styleName="photo-list hide-mobile">
                          {file.map((fileInfo, index) => (
                            <div
                              styleName="photo-item"
                              key={fileInfo.name}
                            ><PhotoVideoItem notSelectable file={fileInfo} />
                              <button
                                type="button"
                                styleName="btn-delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const newFile = [...file];
                                  newFile.splice(index, 1);
                                  onFilePick(newFile);
                                }}
                              ><BtnDeletePhoto />
                              </button>
                            </div>
                          ))}
                          {
                            file.length < 3 && (
                              <div styleName="photo-item browse-button">
                                {renderUpload()}
                              </div>
                            )
                          }
                        </div>
                      ) : renderUpload()
                    }

                    {
                      (file || []).length < 3 && (
                        <React.Fragment>
                          <p styleName="infoText hide-desktop show-mobile">
                            {infoTextMobile}
                          </p>
                          <button styleName="btn hide-desktop show-mobile" type="button">{btnText}</button>
                        </React.Fragment>
                      )
                    }
                  </section>

                </React.Fragment>
              ) : null
            }
          </div>
        )}
      </Dropzone>
      {errorMsg ? (<span styleName="errorMessage">{errorMsg}</span>) : null}
    </React.Fragment>
  );
}

PhotoVideoPicker.defaultProps = {
  infoText: '',
  infoTextMobile: '',
  btnText: 'SELECT A FILE',
  options: {},
  errorMsg: '',
  className: '',
  inputOptions: {},
  file: [],
};

/**
 * Prop Validation
 */
PhotoVideoPicker.propTypes = {
  infoText: PT.string,
  infoTextMobile: PT.string,
  btnText: PT.string,
  onFilePick: PT.func.isRequired,
  options: PT.shape(),
  errorMsg: PT.string,
  className: PT.string,
  inputOptions: PT.shape(),
  file: PT.arrayOf(PT.shape()),
};

export default PhotoVideoPicker;
