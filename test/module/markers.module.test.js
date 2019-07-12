import fs from 'fs';
import markersModule from 'module/markers.module';

describe('markers', () => {
    afterEach(() => {
        // make sure the markers.json is deleted
        try {
            markersModule.markers = [];
            return fs.unlinkSync('markers.json');
        } catch (e) { return null; }
    });

    describe('constructor', () => {
        it('initiate with markers property as empty array', () => {
            expect(markersModule.markers).toEqual([]);
        });
    });

    describe('initialMarkersJSON method', () => {
        it('tries to read the markers.json file and assign it\'s value to markers property', () => {
            const markers = [{ id: 1 }, { id: 2 }];
            fs.writeFileSync('markers.json', JSON.stringify(markers));

            markersModule.initialMarkersJSON();
            expect(markersModule.markers).toEqual(markers);
        });

        it('tries to create the markers.json if the file didn\'t exist', () => {
            markersModule.initialMarkersJSON();
            const markersBlob = fs.readFileSync('markers.json').toString();
            expect(JSON.parse(markersBlob)).toEqual(markersModule.markers);
        });
    });

    describe('updateMarkersJSON method', () => {
        it('sets the markers property value to the markers.json', () => {
            markersModule.initialMarkersJSON();
            let markersBlob = fs.readFileSync('markers.json').toString();
            // assert markers json has empty array
            expect(JSON.parse(markersBlob)).toEqual([]);

            const newMarkersSet = [{ id: 1 }, { id: 5 }];
            markersModule.markers = newMarkersSet;
            markersModule.updateMarkersJSON();
            markersBlob = fs.readFileSync('markers.json').toString();
            // assert markers json has the new updated markers list
            expect(JSON.parse(markersBlob)).toEqual(newMarkersSet);
        });
    });

    describe('getMarkers method', () => {
        it('gets the markers property value', () => {
            const newMarkersSet = [{ id: 1 }, { id: 5 }];
            markersModule.markers = newMarkersSet;

            const actual = markersModule.getMarkers();
            expect(actual).toEqual(newMarkersSet);
        });
    });

    describe('updateMarker method', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('updates the provided marker, trigger the updateMarkersJSON and return the provided marker', () => {
            markersModule.markers = [{ id: 1, name: 'test1' }, { id: 5, name: 'test5' }];

            const markerToUpdate = { id: 5, name: 'test7' };
            const spy = jest.spyOn(markersModule, 'updateMarkersJSON');
            const result = markersModule.updateMarker(markerToUpdate);

            const updatedMarker = markersModule.markers
                .find(marker => marker.id === markerToUpdate.id);

            expect(updatedMarker).toEqual(markerToUpdate);
            expect(result).toEqual(markerToUpdate);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('returns the error object if marker not found', () => {
            markersModule.markers = [{ id: 1, name: 'test1' }, { id: 6, name: 'test6' }];

            const markerToUpdate = { id: 5, name: 'test7' };
            const spy = jest.spyOn(markersModule, 'updateMarkersJSON');
            const result = markersModule.updateMarker(markerToUpdate);

            expect(spy).toHaveBeenCalledTimes(0);
            expect(result).toEqual({ error: 'marker not found' });
        });
    });

    describe('addMarker method', () => {
        it('pushes the provided marker to the markers array, trigger the updateMarkersJSON and return the provided marker', () => {
            markersModule.markers = [{ id: 1, name: 'test1' }, { id: 5, name: 'test5' }];

            const markerToAdd = { id: 6, name: 'test6' };
            const spy = jest.spyOn(markersModule, 'updateMarkersJSON');
            const result = markersModule.addMarker(markerToAdd);

            const addedMarker = markersModule.markers
                .find(marker => marker.id === markerToAdd.id);

            expect(result).toEqual(markerToAdd);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(addedMarker).toEqual(markerToAdd);
            expect(markersModule.markers.length).toBe(3);
        });
    });

    describe('deleteMarker method', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('deletes the provided marker from the markers array, trigger the updateMarkersJSON and return the provided marker', () => {
            markersModule.markers = [
                { id: 1, name: 'test1' },
                { id: 5, name: 'test5' },
                { id: 6, name: 'test6' },
            ];

            const markerToDelete = { id: 6, name: 'test6' };
            const spy = jest.spyOn(markersModule, 'updateMarkersJSON');
            const result = markersModule.deleteMarker(markerToDelete);

            const deletedMarker = markersModule.markers
                .find(marker => marker.id === markerToDelete.id);

            expect(deletedMarker).toBeFalsy();
            expect(spy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(markerToDelete);
            expect(markersModule.markers.length).toBe(2);
        });
    });
});
