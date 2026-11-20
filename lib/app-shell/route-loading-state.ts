const listeners = new Set<() => void>();
let routeFallbackIsVisible = false;

export function subscribeToRouteLoading(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getRouteFallbackVisibility() {
  return routeFallbackIsVisible;
}

export function setRouteFallbackVisibility(visible: boolean) {
  if (routeFallbackIsVisible === visible) return;
  routeFallbackIsVisible = visible;
  listeners.forEach((listener) => listener());
}
