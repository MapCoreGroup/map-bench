/// <reference path="../../types/MapCore.d.ts"/>

let layerCallback: any = null;
let uCameraUpdateCounter = 0;
let lastId = 0;

export type WebServerLayersResultsEventHandler = (
    eStatus: MapCore.IMcErrors.ECode, 
    strServerURL: string, 
    eWebMapServiceType: MapCore.IMcMapLayer.EWebMapServiceType, 
    aLayers: MapCore.IMcMapLayer.SServerLayerInfo[], 
    astrServiceMetadataURLs: string,
    strServiceProviderName: string) => void;  

export let CCameraUpdateCallback: any, CEditModeCallback: any, CAsyncQueryCallback: any, CAsyncOperationCallback: any;

//export class MapCoreCallbacks
// function creating callbacks
export default function CreateCallbackClasses(TrySetTerainBox: any, OnEditResult: any,
      onWebServerLayersResults: WebServerLayersResultsEventHandler | null) {
    // create callback class and instance implementing MapCore.IMcMapLayer.IReadCallback interface
    let CLayerReadCallback: any = MapCore.IMcMapLayer.IReadCallback.extend("IMcMapLayer.IReadCallback",
        {
            // mandatory
            OnInitialized: function (pLayer: MapCore.IMcMapLayer, eStatus: MapCore.IMcErrors.ECode, strAdditionalDataString: string) {
                if (eStatus != MapCore.IMcErrors.ECode.SUCCESS &&
                    eStatus != MapCore.IMcErrors.ECode.NATIVE_SERVER_LAYER_NOT_VALID) {
                    alert("Layer initialization: " + MapCore.IMcErrors.ErrorCodeToString(eStatus) + " (" + strAdditionalDataString + ")");
                    pLayer.RemoveLayerAsync();
                }
                lastId = lastId + 1;
                pLayer.SetID(lastId);
                console.log(`Layer ${pLayer.GetID()} initialized`); 

                // TBD After next version.
                if (pLayer.GetLayerType() === MapCore.IMcRaw3DModelMapLayer.LAYER_TYPE)
                {
                    //(pLayer as MapCore.IMcRaw3DModelMapLayer).SetResolutionFactor(16.0);
                }
                else if (pLayer.GetLayerType() === MapCore.IMcNativeServer3DModelMapLayer.LAYER_TYPE) 
                {
                    // (pLayer as MapCore.IMcNativeServer3DModelMapLayer).SetResolutionFactor(16.0);
                }
                else if (pLayer.GetLayerType() === MapCore.IMcNative3DModelMapLayer.LAYER_TYPE)
                {
                    // (pLayer as MapCore.IMcNative3DModelMapLayer).SetResolutionFactor(16.0);
//                    (pLayer as MapCore.IMcNative3DModelMapLayer).MaxAllowedGeometricError(750);
                }

                TrySetTerainBox();
            },

            // mandatory
            OnReadError: function (pLayer: MapCore.IMcMapLayer, eErrorCode: MapCore.IMcErrors.ECode, strAdditionalDataString: string) {
                // alert("Layer read error: " + MapCore.IMcErrors.ErrorCodeToString(eErrorCode) + " (" + strAdditionalDataString + ")");
                console.error("Layer read error: " + MapCore.IMcErrors.ErrorCodeToString(eErrorCode) + " (" + strAdditionalDataString + ")");
            },

            // mandatory
            OnNativeServerLayerNotValid: function (pLayer: MapCore.IMcMapLayer, bLayerVersionUpdated: boolean) {
                if (bLayerVersionUpdated) {
                    pLayer.ReplaceNativeServerLayerAsync(layerCallback);
                }
                else {
                    pLayer.RemoveLayerAsync();
                }
            },

            // optional
            OnRemoved(pLayer: MapCore.IMcMapLayer, eStatus: MapCore.IMcErrors.ECode, strAdditionalDataString: string) {
                alert("Map layer has been removed");
                TrySetTerainBox();
            },

            // optional
            OnReplaced(pOldLayer: MapCore.IMcMapLayer, pNewLayer: MapCore.IMcMapLayer, eStatus: MapCore.IMcErrors.ECode, strAdditionalDataString: string) {
                alert("Map layer has been replaced");
                TrySetTerainBox();
            },

            // optional, needed if to be deleted by MapCore when no longer used
            Release: function () {
                // don't delete here because we use one global callback class
            },
        });

    layerCallback = new CLayerReadCallback();

    // create callback class implementing MapCore.IMcMapViewport.ICameraUpdateCallback interface
    CCameraUpdateCallback = MapCore.IMcMapViewport.ICameraUpdateCallback.extend("IMcMapViewport.ICameraUpdateCallback",
        {
            // mandatory
            OnActiveCameraUpdated: function (pViewport: MapCore.IMcMapViewport) {
                ++uCameraUpdateCounter;
            },

            // optional
            Release: function () {
                this.delete();
            },
        });

    // create callback class implementing MapCore.IMcMapViewport.ICameraUpdateCallback interface
    CEditModeCallback = MapCore.IMcEditMode.ICallback.extend("IMcEditMode.ICallback",
        {
            // optional
            ExitAction: function (nExitCode: number) {
                // EditMode operation finished
            },

            // Optional
            EditItemResults : function (pObject : MapCore.IMcObject, pItem : MapCore.IMcObjectSchemeItem, nExitCode : number) {
                if (nExitCode === 1)
                {
                    if (pObject.GetID() === 5 || pObject.GetID() === 7 || pObject.GetLocationPoints(0).length === 1)
                    {
                        OnEditResult(pObject);
                    }
                }
            },

            // optional
            Release: function () {
                this.delete();
            },
        });

    // create callback class implementing MapCore.IMcSpatialQueries.IAsyncQueryCallback interface
    CAsyncQueryCallback = MapCore.IMcSpatialQueries.IAsyncQueryCallback.extend("IMcSpatialQueries.IAsyncQueryCallback",
        {
            //  // optional
            __construct: function (OnResults: any, OnError: any) {
                this.__parent.__construct.call(this);
                this.OnResults = OnResults;
                this.OnError = OnError;
            },

            OnTerrainHeightResults: function (bHeightFound: boolean, height: number, normal: MapCore.SMcVector3D) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnTerrainHeightsAlongLineResults: function (bHeightFound: any, height: any, normal: MapCore.IMcSpatialQueries.SSlopesData) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnTerrainHeightMatrixResults: function (adHeightMatrix: any) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnExtremeHeightPointsInPolygonResults: function (bPointsFound: boolean, pHighestPoint: MapCore.SMcVector3D, pLowestPoint: MapCore.SMcVector3D) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnTerrainAnglesResults: function (dPitch: number, dRoll: number) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnRayIntersectionResults: function (bIntersectionFound: boolean, Intersection: MapCore.SMcVector3D, Normal: MapCore.SMcVector3D, dDistance: number) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnRayIntersectionTargetsResults: function (aIntersections: any) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnLineOfSightResults: function (aPoints: any, dCrestClearanceAngle: number, dCrestClearanceDistance: number) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnPointVisibilityResults: function (bIsTargetVisible: boolean, pdMinimalTargetHeightForVisibility: number, pdMinimalScouterHeightForVisibility: number) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnAreaOfSightResults: function (pAreaOfSight: any, aLinesOfSight: any, pSeenPolygons: any, pUnseenPolygons: any, aSeenStaticObjects: any) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            OnLocationFromTwoDistancesAndAzimuthResults: function (Target: MapCore.SMcVector3D) {
                this.OnResults.apply(null, arguments);
                this.delete();
            },

            // mandatory
            OnError: function (eErrorCode: MapCore.IMcErrors.ECode ) {
                if (this.OnError) {
                    this.OnError(eErrorCode);
                }
                else {
                    alert("Spatial query error: " + MapCore.IMcErrors.ErrorCodeToString(eErrorCode));
                }
                this.delete();
            }
        });
    CAsyncOperationCallback = MapCore.IMcMapLayer.IAsyncOperationCallback.extend("IMcMapLayer.IAsyncOperationCallback",
        {
            // optional
            __construct: function (OnResults: any) {
                this.__parent.__construct.call(this);
                this.OnResults = OnResults;
            },

            OnWebServerLayersResults: function (
                eStatus: MapCore.IMcErrors.ECode, strServerURL: string, eWebMapServiceType: MapCore.IMcMapLayer.EWebMapServiceType, aLayers: MapCore.IMcMapLayer.SServerLayerInfo[], astrServiceMetadataURLs: string, strServiceProviderName: string) {
                if (onWebServerLayersResults) 
                {
                    onWebServerLayersResults(eStatus, strServerURL, eWebMapServiceType, aLayers, astrServiceMetadataURLs, strServiceProviderName);
                }
      
                //this.OnResults.apply(null, arguments);
                this.delete();
            },
        });
    return layerCallback;
}


    
