import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedTime = {
    gmtFormat: format(currentTime, "'GMT +1'  h:mm aaa, EEEE, do"),
    basicFormat: format(currentTime, 'HH:mm'),
  };

  return formattedTime;
};
