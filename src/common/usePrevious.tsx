import { useEffect, useRef } from 'react';

function usePrevious<Type>(value: Type): Type {
  const ref = useRef<Type>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;
