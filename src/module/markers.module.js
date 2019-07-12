// @flow
import fs from 'fs';

class Markers {
    markers: Array<{ id: string }>;

    constructor() {
        this.markers = [];
    }

    initialMarkersJSON() {
        try {
            const markersBlob = fs.readFileSync('markers.json').toString();
            this.markers = JSON.parse(markersBlob);
        } catch (e) {
            fs.writeFileSync('markers.json', JSON.stringify(this.markers));
            console.info('creating file ...');
        }
    }

    updateMarkersJSON() {
        fs.writeFileSync('markers.json', JSON.stringify(this.markers));
    }

    getMarkers() {
        return this.markers;
    }

    updateMarker(marker: { id: string }) {
        const markerIndex = this.markers.findIndex(item => item.id === marker.id);
        if (~markerIndex) {
            this.markers[markerIndex] = marker;
            this.updateMarkersJSON();
            return this.markers[markerIndex];
        }
        return { error: 'marker not found' };
    }

    addMarker(marker: { id: string }) {
        this.markers.push(marker);
        this.updateMarkersJSON();
        return marker;
    }

    deleteMarker(marker: { id: string }) {
        this.markers = this.markers.filter(item => item.id !== marker.id);
        this.updateMarkersJSON();
        return marker;
    }
}

export default new Markers();
