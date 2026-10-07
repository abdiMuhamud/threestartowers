import { useMemo } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { WebView } from "react-native-webview";
import type { Property } from "@/content/properties";

type Props = {
  properties: Property[];
  onSelect?: (slug: string) => void;
  zoom?: number;
  style?: StyleProp<ViewStyle>;
  interactive?: boolean;
};

/**
 * Live OpenStreetMap rendered with Leaflet inside a WebView, so the same map
 * works on iOS and Android without a Google Maps API key.
 */
export default function MapWebView({ properties, onSelect, zoom = 15, style, interactive = true }: Props) {
  const html = useMemo(() => {
    const pins = properties.map((p) => ({
      slug: p.slug,
      area: p.area,
      lat: p.coords.lat,
      lng: p.coords.lng,
      live: p.status === "selling",
    }));
    return `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<style>
  html,body,#map{height:100%;margin:0;background:#ece4d7}
  .leaflet-tile-pane{filter:sepia(.28) saturate(.85) brightness(1.02)}
  .pin{position:absolute;transform:translate(-50%,-100%);margin-top:-10px;padding:7px 13px;white-space:nowrap;border-radius:999px;
    background:#3d2820;color:#f8efdc;font:500 13px -apple-system,Roboto,sans-serif;box-shadow:0 8px 16px -6px rgba(0,0,0,.6)}
  .pin:after{content:"";position:absolute;left:50%;bottom:-5px;width:12px;height:12px;margin-left:-6px;transform:rotate(45deg);background:inherit;z-index:-1}
  .pin.live{background:#c9a646;color:#1f130e}
</style></head><body><div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  var pins = ${JSON.stringify(pins)};
  var interactive = ${interactive};
  var map = L.map('map', { zoomControl: false, attributionControl: true, dragging: interactive, touchZoom: interactive, doubleClickZoom: interactive });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  pins.forEach(function (p) {
    var icon = L.divIcon({ className: '', html: '<div class="pin' + (p.live ? ' live' : '') + '">' + p.area + '</div>', iconSize: [0, 0] });
    L.marker([p.lat, p.lng], { icon: icon }).addTo(map).on('click', function () {
      map.flyTo([p.lat, p.lng], 15, { duration: 0.8 });
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(p.slug);
    });
  });
  if (pins.length > 1) map.fitBounds(pins.map(function (p) { return [p.lat, p.lng]; }), { padding: [60, 60] });
  else map.setView([pins[0].lat, pins[0].lng], ${zoom});
  window.focusPin = function (slug) {
    var p = pins.filter(function (x) { return x.slug === slug; })[0];
    if (p) map.flyTo([p.lat, p.lng], 15, { duration: 0.8 });
  };
</script></body></html>`;
  }, [properties, zoom, interactive]);

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      style={[styles.map, style]}
      onMessage={(e) => onSelect?.(e.nativeEvent.data)}
      scrollEnabled={false}
      javaScriptEnabled
      domStorageEnabled
    />
  );
}

const styles = StyleSheet.create({ map: { flex: 1, backgroundColor: "#ece4d7" } });
