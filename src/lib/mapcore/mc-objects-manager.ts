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

    // Generic setup for base overlays (Religious Buildings, Power Lines)
    async _setupBaseOverlay(overlayKey: 'powerLinesOverlay' | 'religiousBuildingsOverlay', isVisible: boolean, fileName: string, dataLoader: () => Promise<any>,) {
        this[overlayKey] = MapCore.IMcOverlay.Create(overlayManager);
        this.setOverlayVisibility(this[overlayKey], isVisible);

        console.log(`Lazy loading ${fileName}...`);
        MapCore.IMcMapDevice.CreateFileSystemDirectory(`/${fileName}-data`);

        const data = await dataLoader();
        const dataUint8 = new TextEncoder().encode(JSON.stringify(data));
        MapCore.IMcMapDevice.CreateFileSystemFile(`/${fileName}-data/${fileName}.geojson`, dataUint8);

        const styleRes = await fetch('/map-style.json');
        const styleJson = await styleRes.json();
        
        // Transform the style
        const styleString = this.transformToMapcoreStyleJson(styleJson);
        const uint8Array = new TextEncoder().encode(styleString);
        MapCore.IMcMapDevice.CreateFileSystemFile(`/${fileName}-data/map-style-mapcore.json`, uint8Array);

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
        styleJson.layers = styleJson.layers.map((layer: any) => {
            if (layer.layout && layer.layout['icon-image']) {
                const iconData = layer.layout['icon-image'];
                const fix = (item: any) => {
                    if (typeof item !== 'string') return item;
                    if (item.startsWith('icon-') || item.includes('airplane') || item.startsWith('http:')) {
                        const fileName = item.replace('icon-', '').replace('http:sprites/', '').replace('.svg', '');
                        return `${window.location.origin}/sprites/${fileName}.svg`;
                    }
                    return item;
                };
                layer.layout['icon-image'] = Array.isArray(iconData) ? iconData.map(fix) : fix(iconData);
            }
            if (layer.layout) {
                layer.layout.visibility = layer.layout.visibility === 'none' ? 'visible' : layer.layout.visibility;
            }
            return layer;
        });
        return JSON.stringify(styleJson); 
    },
    
    async createPowerLinesOverlay(visible: boolean) {
        await this._setupBaseOverlay('powerLinesOverlay', visible, 'power-lines', loadPowerLines);
    },

    async createReligiousBuildingsOverlay(visible: boolean) {
        await this._setupBaseOverlay('religiousBuildingsOverlay', visible, 'religious-buildings', loadReligiousBuildings);
    },

    async createFlightsOverlay(flightsVisible: boolean) {
        this.flightsOverlay = MapCore.IMcOverlay.Create(overlayManager);
        const visibleOption = flightsVisible ? MapCore.IMcConditionalSelector.EActionOptions.EAO_FORCE_TRUE : MapCore.IMcConditionalSelector.EActionOptions.EAO_FORCE_FALSE;
        this.flightsOverlay.SetVisibilityOption(visibleOption);
    
        MapCore.IMcMapDevice.CreateFileSystemDirectory('/flights-data');
    
        const res = await fetch('/flight-tracking-style.json');
        const json = await res.json();
        const transformed = this.transformToMapcoreStyleJson(json);
        
        MapCore.IMcMapDevice.CreateFileSystemFile('/flights-data/flight-tracking-style.json', new TextEncoder().encode(transformed));
    },

    updateFlightsObjects(flightData: any, pathsData: any) {
        if (!this.flightsOverlay) return;

        const update = (data: any) => {
            if (!data?.features) return;

            console.log(`Lazy loading flight data...`)
            const newOverlay = MapCore.IMcOverlay.Create(overlayManager);
            newOverlay.SetVisibilityOption(this.flightsOverlay.GetVisibilityOption());
            
            this.updateIndex++;
            MapCore.IMcMapDevice.CreateFileSystemDirectory(`/flights-data-${this.updateIndex}`);
            
            const path = `/flights-data-${this.updateIndex}/flight-data.geojson`;
            const jsonData = JSON.stringify(data);
            MapCore.IMcMapDevice.CreateFileSystemFile(path, jsonData);
            
            // Reuse the transformed style from the virtual FS
            const styleContent = MapCore.IMcMapDevice.GetFileSystemFileContents('/flights-data/flight-tracking-style.json');
            MapCore.IMcMapDevice.CreateFileSystemFile(`/flights-data-${this.updateIndex}/flight-tracking-style.json`, styleContent);
            
            const sRawParams = new MapCore.IMcRawVectorMapLayer.SParams(path, null);
            sRawParams.StylingParams = new MapCore.IMcRawVectorMapLayer.SInternalStylingParams();
            sRawParams.StylingParams.strStylingFile = `/flights-data-${this.updateIndex}/flight-tracking-style.json`;

            let asyncOperationCallBack: any = new COverlayManagerCallback((strDataSource: string, eStatus: MapCore.IMcErrors.ECode, apLoadedObjects: MapCore.IMcObject[]) => {
                const parts = strDataSource.split("-");
                const extractedIndexStr = parts[2].split("/")[0];
                const currentUpdateIndex = BigInt(extractedIndexStr);

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
                MapCore.IMcMapDevice.DeleteFileSystemFile(`/flights-data-${currentUpdateIndex}/flight-data.geojson`);
                MapCore.IMcMapDevice.DeleteFileSystemFile(`/flights-data-${currentUpdateIndex}/flight-tracking-style.json`);
                MapCore.IMcMapDevice.DeleteFileSystemEmptyDirectory(`/flights-data-${currentUpdateIndex}`);
            });
            newOverlay.LoadObjectsFromRawVectorData(sRawParams, asyncOperationCallBack);
        };

        const clonedFlightData = JSON.parse(JSON.stringify(flightData));
        clonedFlightData.features = [...clonedFlightData.features, ...pathsData.features];
        update(clonedFlightData);
    },

    setOverlayVisibility(localOverlay: MapCore.IMcOverlay, isVisible: boolean) {
        if (!localOverlay) return;
        const visibilityOption = isVisible ? MapCore.IMcConditionalSelector.EActionOptions.EAO_FORCE_TRUE : MapCore.IMcConditionalSelector.EActionOptions.EAO_FORCE_FALSE;
        localOverlay.SetVisibilityOption(visibilityOption);
    },
};
