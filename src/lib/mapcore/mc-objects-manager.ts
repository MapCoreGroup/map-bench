/// <reference path="../../types/MapCore.d.ts"/>

import { overlayManager } from "./mc-api";
import { loadReligiousBuildings, loadPowerLines } from '../../utils/mapStyleConfig'
import { COverlayManagerCallback } from "./mc-callbacks";

/**
 * Service object for managing overlays
 */
export const McObjectsManagerService = {
    powerLinesOverlay: null as MapCore.IMcOverlay,
    religiousBuildingsOverlay: null as MapCore.IMcOverlay,
    flightsOverlay: null as MapCore.IMcOverlay,
    updateIndex: 0n,
    updateCallbackIndex: 0n,

    // Generic setup for base overlays
    async _setupBaseOverlay(overlayKey: 'powerLinesOverlay' | 'religiousBuildingsOverlay', isVisible: boolean, fileName: string, dataLoader: () => Promise<any>,) {
        // Create overlay and set visibility
        this[overlayKey] = MapCore.IMcOverlay.Create(overlayManager);
        this.setOverlayVisibility(this[overlayKey], isVisible);

        console.log(`Lazy loading ${fileName}...`);
        MapCore.IMcMapDevice.CreateFileSystemDirectory(`/${fileName}-data`);

        // loading geojson data
        const data = await dataLoader();
        const dataUint8 = new TextEncoder().encode(JSON.stringify(data));
        MapCore.IMcMapDevice.CreateFileSystemFile(`/${fileName}-data/${fileName}.geojson`, dataUint8);

        // loading style file
        const styleRes = await fetch('/map-style.json');
        const styleJson = await styleRes.json();
        const styleString = this.transformToMapcoreStyleJson(styleJson);
        const uint8Array = new TextEncoder().encode(styleString);
        MapCore.IMcMapDevice.CreateFileSystemFile(`/${fileName}-data/map-style-mapcore.json`, uint8Array);

        // setting up raw vector params
        const sParams = new MapCore.IMcRawVectorMapLayer.SParams(`/${fileName}-data/${fileName}.geojson`, null);
        sParams.StylingParams = new MapCore.IMcRawVectorMapLayer.SInternalStylingParams();
        sParams.StylingParams.strStylingFile = `/${fileName}-data/map-style-mapcore.json`;

        const asyncOperationCallBack = new COverlayManagerCallback((_strDataSource: string, eStatus: MapCore.IMcErrors.ECode, apLoadedObjects: MapCore.IMcObject[]) => {
            if (eStatus === MapCore.IMcErrors.ECode.SUCCESS) {
                console.log(`/${fileName}-data loaded successfully. Loaded ${apLoadedObjects.length} objects.`);
            }
        });

        this[overlayKey].LoadObjectsFromRawVectorData(sParams, asyncOperationCallBack);
    },
transformToMapcoreStyleJson(styleJson: any): string {
    console.log('--- START: transformToMapcoreStyleJson ---');

    styleJson.layers = styleJson.layers.map((layer: any) => {
        
        // 1. Check if layer has layout
        if (layer.layout) {
            
            // Fix visibility (existing logic)
            layer.layout.visibility = layer.layout.visibility === 'none' ? 'visible' : layer.layout.visibility;

            // 2. Check if it has an icon-image
            if (layer.layout['icon-image']) {
                console.log(`[DEBUG] Found layer with icon: ${layer.id}`, layer.layout['icon-image']);

                // SAFETY CHECK: Ensure it is an array before mapping
                if (Array.isArray(layer.layout['icon-image'])) {
                    
                    layer.layout['icon-image'] = layer.layout['icon-image'].map((item: any) => {
                        console.log(`   [DEBUG] Checking item:`, item);

                        if (typeof item === 'string' && item.startsWith('icon-')) {
                            console.log(`   --> FOUND MATCH: ${item}`);
                            
                            // The "Bulletproof" Fix (No variables)
                            const iconUrl = `/sprites/${item.replace('icon-', '')}.svg`;
                            
                            console.log(`   --> REPLACED WITH: ${iconUrl}`);
                            return iconUrl;
                        }
                        return item;
                    });
                } else {
                    console.log(`[DEBUG] Layer ${layer.id} icon-image is NOT an array (it is a string/expression). Skipping map.`);
                }
            }
        }
        return layer;
    });

    console.log('--- END: transformToMapcoreStyleJson ---');
    // Ensure you return the correct format (string or object) based on your function signature
    return JSON.stringify(styleJson); 
}

    //create overlays
    async createPowerLinesOverlay(visible: boolean) {
        await this._setupBaseOverlay('powerLinesOverlay', visible, 'power-lines', loadPowerLines);
    },
    async createReligiousBuildingsOverlay(visible: boolean) {
        await this._setupBaseOverlay('religiousBuildingsOverlay', visible, 'religious-buildings', loadReligiousBuildings);
    },
    async createFlightsOverlay(flightsVisible: boolean) {
        console.log('Creating Flights Overlay');
        this.flightsOverlay = MapCore.IMcOverlay.Create(overlayManager);
        const visibleOption = flightsVisible ? MapCore.IMcConditionalSelector.EActionOptions.EAO_FORCE_TRUE : MapCore.IMcConditionalSelector.EActionOptions.EAO_FORCE_FALSE;
        this.flightsOverlay.SetVisibilityOption(visibleOption);
        //create directory in virtual mapcore file system
        MapCore.IMcMapDevice.CreateFileSystemDirectory('/flights-data');
        //fetch map-style for flights and create file system file
        const flightsStyleResponse = await fetch('/flight-tracking-style.json');
        const flightsStyleBuffer = await flightsStyleResponse.arrayBuffer();
        const flightsStyleUint8Array = new Uint8Array(flightsStyleBuffer);
        MapCore.IMcMapDevice.CreateFileSystemFile('/flights-data/flight-tracking-style.json', flightsStyleUint8Array);
    },

    updateFlightsObjects(flightData: any, pathsData: any) {
        if (!this.flightsOverlay) return;

        const update = (data: any) => {
            if (!data?.features) return;

            console.log(`Lazy loading flight data...`)
            const newOverlay = MapCore.IMcOverlay.Create(overlayManager);
            newOverlay.SetVisibilityOption(this.flightsOverlay.GetVisibilityOption());
            //increment update index
            this.updateIndex++;
            //create new directory for update
            MapCore.IMcMapDevice.CreateFileSystemDirectory(`/flights-data-${this.updateIndex}`);
            //create flights data file
            const path = `/flights-data-${this.updateIndex}/flight-data.geojson`;
            const jsonData = JSON.stringify(data);
            MapCore.IMcMapDevice.CreateFileSystemFile(path, jsonData);
            //create style file
            const styleContent = MapCore.IMcMapDevice.GetFileSystemFileContents('/flights-data/flight-tracking-style.json');
            MapCore.IMcMapDevice.CreateFileSystemFile(`/flights-data-${this.updateIndex}/flight-tracking-style.json`, styleContent);
            //create raw vector params
            const sRawParams = new MapCore.IMcRawVectorMapLayer.SParams(path, null);
            sRawParams.StylingParams = new MapCore.IMcRawVectorMapLayer.SInternalStylingParams();
            sRawParams.StylingParams.strStylingFile = `/flights-data-${this.updateIndex}/flight-tracking-style.json`;
            //load objects callback
            // const lastTimestamp = new Date().getTime();
            let asyncOperationCallBack: any = new COverlayManagerCallback((strDataSource: string, eStatus: MapCore.IMcErrors.ECode, apLoadedObjects: MapCore.IMcObject[]) => {
                const parts = strDataSource.split("-");
                const extractedIndexStr = parts[2].split("/")[0];
                const currentUpdateIndex = BigInt(extractedIndexStr);
                // apLoadedObjects.length > 14000 && console.log(`last time to now ${new Date().getTime() - lastTimestamp} ms`);
                //ignore outdated updates
                if (currentUpdateIndex > this.updateCallbackIndex) {
                    this.updateCallbackIndex = currentUpdateIndex;
                    if (eStatus === MapCore.IMcErrors.ECode.SUCCESS) {
                        this.flightsOverlay.Remove();
                        this.flightsOverlay = newOverlay;
                        console.log(`Flights loaded successfully. Loaded ${apLoadedObjects.length} objects.`);
                    }
                }
                else {
                    newOverlay.Remove();
                }
                //Delete files and directory from virtual file system
                MapCore.IMcMapDevice.DeleteFileSystemFile(`/flights-data-${currentUpdateIndex}/flight-data.geojson`);
                MapCore.IMcMapDevice.DeleteFileSystemFile(`/flights-data-${currentUpdateIndex}/flight-tracking-style.json`);
                MapCore.IMcMapDevice.DeleteFileSystemEmptyDirectory(`/flights-data-${currentUpdateIndex}`);
            });
            newOverlay.LoadObjectsFromRawVectorData(sRawParams, asyncOperationCallBack);
        };

        const clonedFlightData = JSON.parse(JSON.stringify(flightData));
        //merge paths data into flight data
        clonedFlightData.features = [...clonedFlightData.features, ...pathsData.features];
        update(clonedFlightData);
    },
    setOverlayVisibility(localOverlay: MapCore.IMcOverlay, isVisible: boolean) {
        if (!localOverlay) return;

        const visibilityOption = isVisible ? MapCore.IMcConditionalSelector.EActionOptions.EAO_FORCE_TRUE : MapCore.IMcConditionalSelector.EActionOptions.EAO_FORCE_FALSE;
        localOverlay.SetVisibilityOption(visibilityOption);
    },
};
