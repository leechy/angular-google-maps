import {NgZone} from '@angular/core';
import {TestBed, inject} from '@angular/core/testing';

import {AgmPolyline} from '../../directives/polyline';
import {GoogleMapsAPIWrapper} from '../../services/google-maps-api-wrapper';
import {Polyline} from '../../services/google-maps-types';
import {PolylineManager} from '../../services/managers/polyline-manager';

describe('PolylineManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: NgZone, useFactory: () => new NgZone({enableLongStackTrace: true})},
        PolylineManager, {
          provide: GoogleMapsAPIWrapper,
          useValue: {
            createPolyline: jest.fn()
          }
        }
      ]
    });
  });

  describe('Create a new polyline', () => {
    it('should call the mapsApiWrapper when creating a new polyline',
       inject(
           [PolylineManager, GoogleMapsAPIWrapper],
           (polylineManager: PolylineManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newPolyline = new AgmPolyline(polylineManager);
             polylineManager.addPolyline(newPolyline);

             expect(apiWrapper.createPolyline).toHaveBeenCalledWith({
               clickable: true,
               draggable: false,
               editable: false,
               geodesic: false,
               strokeColor: undefined,
               strokeOpacity: undefined,
               strokeWeight: undefined,
               visible: true,
               zIndex: undefined,
               icons: undefined,
               path: []
             });
           }));
  });

  describe('Delete a polyline', () => {
    it('should set the map to null when deleting a existing polyline',
       inject(
           [PolylineManager, GoogleMapsAPIWrapper],
           (polylineManager: PolylineManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newPolyline = new AgmPolyline(polylineManager);

             const polylineInstance: Partial<Polyline> = {
              setMap: jest.fn()
             };
             (<jest.Mock>apiWrapper.createPolyline).mockReturnValue(Promise.resolve(polylineInstance));

             polylineManager.addPolyline(newPolyline);
             polylineManager.deletePolyline(newPolyline).then(() => {
               expect(polylineInstance.setMap).toHaveBeenCalledWith(null);
             });
           }));
  });
});
