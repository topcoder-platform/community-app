import { useEffect, useCallback } from 'react';
import PT from 'prop-types';

export default function VerificationListener({
  event, callback, origin, type, onProcessing, startType,
}) {
  const messageHandler = useCallback((e) => {
    if (e.origin === origin && e.data && e.data.type) {
      if (e.data.type === startType) {
        onProcessing();
      } else if (e.data.type === type) {
        callback(e.data);
      }
    }
  }, [origin, type, startType]);

  useEffect(() => {
    window.addEventListener(event, messageHandler);
    return () => window.removeEventListener(event, messageHandler);
  }, [event, messageHandler]);

  return false;
}

VerificationListener.propTypes = {
  event: PT.string.isRequired,
  callback: PT.func.isRequired,
  origin: PT.string.isRequired,
  type: PT.string.isRequired,
  onProcessing: PT.func.isRequired,
  startType: PT.string.isRequired,
};
