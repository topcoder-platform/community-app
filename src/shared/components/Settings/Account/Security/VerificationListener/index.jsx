import { useEffect, useCallback } from 'react';
import PT from 'prop-types';

export default function VerificationListener({ event, callback, source }) {
  const messageHandler = useCallback((e) => {
    if (e.source.indexOf(source) !== -1) {
        callback(e.data);
    }
  }, [source])

  useEffect(() => {
    window.addEventListener(event, messageHandler);
    return () => window.removeEventListener(event, messageHandler);
  }, [event, messageHandler]);

  return false;
}

DiceModal.propTypes = {
  event: PT.string.isRequired,
  callback: PT.func.isRequired,
  source: PT.string.isRequired,
};
