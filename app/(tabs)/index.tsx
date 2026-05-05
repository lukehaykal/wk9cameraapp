import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<{
    type: string;
    data: string;
  } | null>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Camera permission required</Text>
      </View>
    );
  }

  // 🔑 This is the handler that fires when a barcode is detected
  const handleBarcodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scanned) return; // prevent duplicate scans
    setScanned(true);
    setScannedData({ type, data });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        // 🔑 Enable barcode scanning
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "ean13",
            "ean8",
            "code128",
            "code39",
            "pdf417",
            "aztec",
          ],
        }}
        // 🔑 Attach the scan event handler
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {/* Overlay UI */}
      {scannedData && (
        <View style={styles.resultBox}>
          <Text style={styles.resultType}>Type: {scannedData.type}</Text>
          <Text style={styles.resultData}>{scannedData.data}</Text>
          <Text
            style={styles.scanAgain}
            onPress={() => {
              setScanned(false);
              setScannedData(null);
            }}
          >
            Tap to scan again
          </Text>
        </View>
      )}

      {/* Optional: targeting reticle */}
      {!scannedData && (
        <View style={styles.overlay}>
          <View style={styles.reticle} />
          <Text style={styles.hint}>Point at a QR code</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  reticle: {
    width: 220,
    height: 220,
    borderWidth: 2,
    borderColor: "#00FF00",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  hint: {
    marginTop: 16,
    color: "#fff",
    fontSize: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resultBox: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 10,
  },
  resultType: { fontSize: 12, color: "#888", marginBottom: 4 },
  resultData: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
  scanAgain: { marginTop: 12, color: "#007AFF", fontSize: 14 },
});
