const MapScreen = () => {
    const cameraRef = useRef(null);

    useEffect(() => {
    // You can programmatically control the map here, e.g., setting camera position
    if (cameraRef.current) {
        cameraRef.current.setCamera({
        centerCoordinate: [-74.0060, 40.7128], // New York City
        zoomLevel: 10,
        animationDuration: 2000,
        });
    }
    }, []);

    return (
    <View style={styles.page}>
        <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
            <MapboxGL.Camera ref={cameraRef} zoomLevel={9} centerCoordinate={[-77.0369, 38.9072]} />
        </MapboxGL.MapView>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    container: {
    height: '100%',
    width: '100%',
    },
    map: {
    flex: 1,
    },
});

export default MapScreen;