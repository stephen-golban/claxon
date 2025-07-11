/* eslint-disable react-hooks/exhaustive-deps */
import { type EffectCallback, useEffect, useReducer, useRef } from "react";

const useEffectOnce = (effect: EffectCallback) => {
  useEffect(effect, []);
};

const useMount = (fn: () => void) => {
  useEffectOnce(() => {
    fn();
  });
};

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  // biome-ignore lint/correctness/useExhaustiveDependencies: we don't need to re-run this effect when the theme changes
  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, [...(deps ?? [])]);
};

const useFirstMountState = (): boolean => {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
};

const updateReducer = (num: number): number => (num + 1) % 1_000_000;

function useUpdate(): () => void {
  const [, update] = useReducer(updateReducer, 0);

  return update;
}

function useUnmount(func: () => void) {
  const funcRef = useRef(func);

  funcRef.current = func;

  useEffect(
    () => () => {
      funcRef.current();
    },
    [],
  );
}

export { useMount, useUpdateEffect, useFirstMountState, useUpdate, useUnmount };
