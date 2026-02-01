declare namespace MapCore {
    interface IMcBase {
        AddRef() : void;
        Release() : void;
        GetRefCount() : number;
    }

    interface IMcDestroyable {
        Destroy() : void;
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    // Map

    interface IMcMapCamera extends IMcBase {
        GetMapType() : IMcMapCamera.EMapType;
        SetCameraPosition(Position : SMcVector3D, bRelative? : boolean) : void;
        GetCameraPosition() : SMcVector3D;
        MoveCameraRelativeToOrientation(DeltaPosition : SMcVector3D, bIgnorePitch : boolean) : void;
        SetCameraOrientation(fYaw : number, fPitch? : number, fRoll? : number, bRelative? : boolean) : void;
        /**
         * @param pfYaw      pfYaw.Value : number
         * @param pfPitch    pfPitch.Value : number
         * @param pfRoll     pfRoll.Value : number
         */
        GetCameraOrientation(pfYaw : any, pfPitch? : any, pfRoll? : any) : void;
        SetCameraUpVector(UpVector : SMcVector3D, bRelativeToOrientation? : boolean) : void;
        GetCameraUpVector() : SMcVector3D;
        RotateCameraAroundWorldPoint(PivotPoint :SMcVector3D, fDeltaYaw : number, fDeltaPitch? : number, fDeltaRoll? : number, bRelativeToOrientation? : boolean) : void;
        SetCameraScale(fWorldUnitsPerPixel : number, Point? : SMcVector3D) : void;
        GetCameraScale(Point? : SMcVector3D) : number;
        SetCameraCenterOffset(Offset : SMcFVector2D) : void;
        GetCameraCenterOffset() : SMcFVector2D;
        SetCameraWorldVisibleArea(VisibleArea : SMcBox, nScreenMargin? : number, fRectangleYaw? : number) : void;
        GetCameraWorldVisibleArea(nScreenMargin? : number, fRectangleYaw? : number) : SMcBox;
        IsInCameraWorldVisibleArea(Area: SMcBox, fMaxDistance3D?: number): boolean;
        SetCameraScreenVisibleArea(VisibleArea : SMcRect, e3DOperation? : IMcMapCamera.ESetVisibleArea3DOperation) : void;
        ScrollCamera(nDeltaX : number, nDeltaY : number) : void;
        SetCameraLookAtPoint(LookAtPoint : SMcVector3D) : void;
        SetCameraForwardVector(ForwardVector : SMcVector3D, bRelativeToOrientation? : boolean) : void;
        GetCameraForwardVector() : SMcVector3D;
        SetCameraFieldOfView(fFieldOfViewHorizAngle : number) : void;
        GetCameraFieldOfView() : number;
        RotateCameraRelativeToOrientation(fDeltaYaw : number, fDeltaPitch : number, fDeltaRoll : number, bYawAbsolute? : boolean) : void;
        SetCameraRelativeHeightLimits(dMinHeight : number, dMaxHeight : number, bEnabled : boolean) : void;
        /**
         * @param pdMinHeight   pdMinHeight.Value : number
         * @param pdMaxHeight   pdMaxHeight.Value : number
         */
        GetCameraRelativeHeightLimits(pdMinHeight : any, pdMaxHeight : any) : boolean;
        SetCameraClipDistances(fMin : number, fMax : number, bRenderInTwoSessions : boolean) : void;
         /**
          * @param pfMin      pfMin.Value : number
          * @param pfMax      pfMax.Value : number
          */
        GetCameraClipDistances(pfMin : any, pfMax :any) : boolean;
        SetCameraAttachmentEnabled(bEnable : boolean) : void;
        GetCameraAttachmentEnabled() : boolean;
        SetCameraAttachment(pAttachment : IMcMapCamera.SCameraAttachmentParams, pLookAtAttachment :IMcMapCamera.SCameraAttachmentTarget) : void;
        /**
         * @param pAttachment                       pAttachment.Value : IMcMapCamera.SCameraAttachmentParams
         * @param pbAttachmentDefined               pbAttachmentDefined.Value : boolean
         * @param pLookAtAttachment                 pLookAtAttachment.Value : IMcMapCamera.SCameraAttachmentTarget
         * @param pbLookAtAttachmentDefined         pbLookAtAttachmentDefined.Value : IMcMapCamera.SCameraAttachmentTarget
         */
        GetCameraAttachment(pAttachment? : any, pbAttachmentDefined? : any, pLookAtAttachment? : any, pbLookAtAttachmentDefined? : any) : void;
        WorldToScreen(WorldPoint : SMcVector3D) : SMcVector3D;
        /**
         * @param pWorldPoint                       pWorldPoint.Value : SMcVector3D
         */
        ScreenToWorldOnTerrain(ScreenPoint : SMcVector3D, pWorldPoint : any, pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        /**
         * @param pWorldPoint                       pWorldPoint.Value : SMcVector3D
         */
        ScreenToWorldOnPlane(ScreenPoint : SMcVector3D, pWorldPoint : any, dPlaneLocation? : number, PlaneNormal? : SMcVector3D) : boolean;
        GetCameraMatrix(eCameraMatrixType : IMcMapCamera.ECameraMatrixType) : SMcMatrix4D;
        GetCameraFootprint() : IMcMapCamera.SCameraFootprintPoints;
    }

    namespace IMcMapCamera {
        enum EMapType {
            EMT_2D,
            EMT_3D
        }
        enum ECameraMatrixType {
            ECMT_VIEW,
            ECMT_PROJECTION,
            ECMT_VIEWPORT
        }
        enum ESetVisibleArea3DOperation {
            ESVAO_ROTATE_AND_MOVE,
            ESVAO_ROTATE_AND_SET_FOV
        }
        class SCameraFootprintPoints {
            constructor();
            UpperLeft : SMcVector3D;
            UpperRight : SMcVector3D;
            LowerRight : SMcVector3D;
            LowerLeft : SMcVector3D;
            Center : boolean;
            bUpperLeftFound : boolean;
            bUpperRightFound : boolean;
            bLowerRightFound : boolean;
            bLowerLeftFound : boolean;
            bCenterFound : boolean;
        }
        class SCameraAttachmentTarget {
            constructor();
            pObject : IMcObject;
            pItem : IMcObjectSchemeItem;
            uAttachPoint : number;
        }
        class SCameraAttachmentParams extends SCameraAttachmentTarget {
            constructor();
            pObject : IMcObject;
            pItem : IMcObjectSchemeItem;
            uAttachPoint : number;
            Offset : SMcVector3D;
            bAttachOrientation : boolean;
            fAdditionalYaw : number;
            fAdditionalPitch : number;
            fAdditionalRoll : number;
        }
    }

    interface IMcMapViewport extends IMcMapCamera, IMcSpatialQueries, IMcGlobalMap, IMcPrintMap, IMcImageProcessing {
        GetCreateParams() : IMcMapViewport.SCreateData;
        CreateCamera() : IMcMapCamera;
        DestroyCamera(pCamera : IMcMapCamera) : void;
        SetActiveCamera(pCamera : IMcMapCamera) : void;
        GetActiveCamera() : IMcMapCamera;
        GetCameras() : IMcMapCamera[];
        GetWindowHandle() : HTMLCanvasElement;
        GetImageCalc(bStereoSlave? : boolean) : IMcImageCalc;
        ViewportResized() : void;
        /**
         * @param puWidth               puWidth.Value : number
         * @param puHeight              puHeight.Value : number
         */
        GetViewportSize(puWidth : any, puHeight : any) : void;
        SetRelativePositionInWindow(TopLeftCorner : SMcFVector2D, BottomRightCorner : SMcFVector2D) : void;
        /**
         * @param pTopLeftCorner        pTopLeftCorner.Value : SMcFVector2D
         * @param pBottomRightCorner    pBottomRightCorner.Value : SMcFVector2D
         */
        GetRelativePositionInWindow(pTopLeftCorner : any, pBottomRightCorner : any) : void;
        GetAbsolutePositionInWindow() : SMcPoint;
        /**
         * @param pViewportPixel        pViewportPixel.Value : SMcVector2D
         * @param pbInViewport          pbInViewport.Value : boolean
         * @param pbInViewportRect      pbInViewportRect.Value : boolean
         * @param ppPixelViewport       ppPixelViewport.Value : IMcMapViewport
         */
        WindowPixelToViewportPixel(WindowPixel : SMcPoint, pViewportPixel : any, pbInViewport : any, pbInViewportRect? : any, ppPixelViewport? : any) : void;
        SetTopMostZOrderInWindow() : void;
        GetPixelPhysicalHeight(fDisplayHeightInMeters? : number) : number;
        SetFullScreenMode(bFullScreen : boolean) : void;
        GetFullScreenMode() : boolean;
        AddTerrain(pTerrain : IMcMapTerrain) : void;
        RemoveTerrain(pTerrain : IMcMapTerrain) : void;
        SetTerrainMaxNumTileRequestsPerRender(pTerrain : IMcMapTerrain, uNumTiles : number) : void;
        GetTerrainMaxNumTileRequestsPerRender(pTerrain : IMcMapTerrain) : number;
        SetTerrainMaxNumPendingTileRequests(pTerrain : IMcMapTerrain, uNumTiles : number) : void;
        GetTerrainMaxNumPendingTileRequests(pTerrain : IMcMapTerrain) : number;
        SetTerrainNumCacheTiles(pTerrain : IMcMapTerrain, bStaticObjects : boolean, uNumTiles : number) : void;
        GetTerrainNumCacheTiles(pTerrain : IMcMapTerrain, bStaticObjects : boolean) : number;
        GetTerrainByID(uID : number) : IMcMapTerrain;
        SetTerrainDrawPriority(pTerrain : IMcMapTerrain, nDrawPriority : number) : void;
        GetTerrainDrawPriority(pTerrain : IMcMapTerrain) : number;
        GetVisibleLayers(pTerrain : IMcMapTerrain) : IMcMapLayer[];
        SetGrid(pGrid : IMcMapGrid) : void;
        GetGrid() : IMcMapGrid;
        SetGridVisibility(bVisible : boolean) : void;
        GetGridVisibility() : boolean;
        SetGridAboveVectorLayers(bAboveVector : boolean) : void;
        GetGridAboveVectorLayers() : boolean;
        SetHeightLines(pHeightLines : IMcMapHeightLines) : void;
        GetHeightLines() : IMcMapHeightLines;
        SetHeightLinesVisibility(bVisible : boolean) : void;
        GetHeightLinesVisibility() : boolean;
        SetDtmVisualization(bEnabled : boolean, pParams? : IMcMapViewport.SDtmVisualizationParams) : void;
         /**
          * @param pParams    pParams.Value : IMcMapViewport.SDtmVisualizationParams
          */
        GetDtmVisualization(pParams? : any) : boolean;
        SetDtmTransparencyWithoutRaster(bEnabled : boolean) : void;
        GetDtmTransparencyWithoutRaster() : boolean;
        SetBackgroundColor(BackgroundColor : SMcBColor) : void;
        GetBackgroundColor() : SMcBColor;
        SetBrightness(eStage : IMcMapViewport.EImageProcessingStage, fBrightness : number) : void;
        GetBrightness(eStage : IMcMapViewport.EImageProcessingStage) : number;
        AddCameraUpdateCallback(callback : IMcMapViewport.ICameraUpdateCallback) : void;
        RemoveCameraUpdateCallback(pCallback : IMcMapViewport.ICameraUpdateCallback) : void;
        OverlayManagerToViewportWorld(OverlayManagerPoint : SMcVector3D, pOverlayManager? : IMcOverlayManager) : SMcVector3D;
        ViewportToOverlayManagerWorld(ViewportPoint : SMcVector3D, pOverlayManager? : IMcOverlayManager) : SMcVector3D;
        ViewportToOtherViewportWorld(ThisViewportPoint : SMcVector3D, pOtherViewport : IMcMapViewport) : SMcVector3D;
        ViewportToImageCalcWorld(ViewportWorldPoint : SMcVector3D, pImageCalc : IMcImageCalc) : SMcVector3D;
        ImageCalcWorldToViewport(ImageCalcWorldPoint : SMcVector3D, pImageCalc : IMcImageCalc) : SMcVector3D;
        Render() : void;
        SetRenderToBufferMode(bOn : boolean) : void;
        GetRenderToBufferMode() : boolean;
        RenderScreenRectToBuffer(Rect : SMcRect, uBufferWidth : number, uBufferHeight : number, eBufferPixelFormat : IMcTexture.EPixelFormat, uBufferRowPitch : number) : Uint8Array;
        /**
         * @param pePixelFormat       pePixelFormat.Value    :  IMcTexture.EPixelFormat
         * @param puPixelByteCount    puPixelByteCount.Value :  number
         */
        GetRenderToBufferNativePixelFormat(pePixelFormat : any, puPixelByteCount? : any) : void;
        RenderRollingShutter(RollingShutterData : IMcMapViewport.SRollingShutterData) : void;
        RenderRollingShutterRectToBuffer(RollingShutterData : IMcMapViewport.SRollingShutterData, Rect : SMcRect,
		    uBufferWidth : number, uBufferHeight : number, eBufferPixelFormat : IMcTexture.EPixelFormat,
		    uBufferRowPitch : number) : Uint8Array;
        HasPendingUpdates(uUpdateTypeBitField? : number) : boolean;
        PerformPendingUpdates(uUpdateTypeBitField? : number, uTerrainLoadTimeout? : number) : void;
        GetRenderStatistics() : IMcMapViewport.SRenderStatistics;
        ResetRenderStatistics() : void;
        GetRenderSurface() : number;
        ResizeRenderSurface(uNewWidth : number, uNewHeight : number) : number;
        SetTerrainNoiseMode(eNoiseMode : IMcMapViewport.ETerrainNoiseMode) : void;
        GetTerrainNoiseMode() : IMcMapViewport.ETerrainNoiseMode;
        SetShadowMode(eShadowMode : IMcMapViewport.EShadowMode) : void;
        GetShadowMode() : IMcMapViewport.EShadowMode;
        SetMaterialSchemeDefinition(strMaterialSchemeName : string, strMaterialNameToCopyFrom : string) : void;
        SetMaterialScheme(strMaterialSchemeName : string) : void;
        SetClipPlanes(aClipPlanes : SMcPlane[]) : void;
        GetClipPlanes() : SMcPlane[];
        SetVector3DExtrusionVisibilityMaxScale(fVector3DExtrusionVisibilityMaxScale : number) : void;
        GetVector3DExtrusionVisibilityMaxScale() : number;
        Set3DModelVisibilityMaxScale(f3DModelVisibilityMaxScale: number): void;
        Get3DModelVisibilityMaxScale(): number;
        SetObjectsVisibilityMaxScale(fObjectsVisibilityMaxScale : number) : void;
        GetObjectsVisibilityMaxScale() : number;
        SetObjectsMovementThreshold(uThresholdInPixels : number) : void;
        GetObjectsMovementThreshold() : number;
        SetSpatialPartitionNumCacheNodes(uNumNodes : number) : void;
        GetSpatialPartitionNumCacheNodes() : number;
        SetScreenSizeTerrainObjectsFactor(fFactor : number) : void;
        GetScreenSizeTerrainObjectsFactor() : number;
        SetObjectsDelay(eDelayType : IMcMapViewport.EObjectDelayType, bEnabled : boolean, uNumToUpdatePerRender : number) : void;
        /**
         * @param pbEnabled                 pbEnabled.Value              :  boolean
         * @param puNumToUpdatePerRender    puNumToUpdatePerRender.Value :  number
         */
        GetObjectsDelay(eDelayType : IMcMapViewport.EObjectDelayType, pbEnabled : any, puNumToUpdatePerRender : any) : void;
        SetFreezeObjectsVisualization(bFreeze : boolean) : void;
        GetFreezeObjectsVisualization() : boolean;
        SetOverloadMode(bEnabled : boolean, uMinNumItemsForOverload : number) : void;
        /**
         * @param pbEnabled                 pbEnabled.Value              :  boolean
         * @param puNumToUpdatePerRender    puNumToUpdatePerRender.Value :  number
         */
        GetOverloadMode(pbEnabled : any, puMinNumItemsForOverload : any) : void;
        GetVisibleOverlays() : IMcOverlay[];
        SetOverlaysVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, apOverlays : IMcOverlay[]) : void;
        SetObjectsVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions,	apObjects : IMcObject[]) : void;
        GetObjectsVisibleInWorldRectAndScale2D(WorldRect : SMcBox, fCameraScale : number) : IMcObject[];
        /**
         * @param pCorrectionFactor                 pCorrectionFactor.Value              :  SMcFVector2D
         * @param pbCorrectionFactorNeeded           pbCorrectionFactorNeeded.Value      :  boolean
         */
         GetLocalGeoCorrectionFactorAtObject(pObject : IMcObject, eGeometryType : IMcObjectSchemeItem.EGeometryType, pCorrectionFactor : any, pbCorrectionFactorNeeded? : any) : void;
        /**
         * @param pCorrectionFactor                 pCorrectionFactor.Value              :  SMcFVector2D
         * @param pbCorrectionFactorNeeded           pbCorrectionFactorNeeded.Value      :  boolean
         */
         GetLocalGeoCorrectionFactorAtPoint(WorldPoint : SMcVector3D, eGeometryType : IMcObjectSchemeItem.EGeometryType, pCorrectionFactor : any, pbCorrectionFactorNeeded? : any) : void;
         SetOneBitAlphaMode(uAlphaRejectValue : number) : void;
         GetOneBitAlphaMode() : number;
         SetTransparencyOrderingMode(bEnabled : boolean) : void;
         GetTransparencyOrderingMode() : boolean;
         SetSoundListener() : void;
         IsSoundListener() : boolean;
         AddPostProcess(strPostProcess : string) : void;
         GetPostProcessResultingTextureName(strPostProcess : string, strPostProcessTarget : string, uTargetIndex : number) : string;
         RemovePostProcess(strPostProcess : string) : void;
         SetNextFrameDeltaTime(fTimeSinceLastFrame : number) : void;
    }
    namespace IMcMapViewport {
        /**
         * @param camera    camera.Value : IMcMapCamera
         */
        function Create(camera : any, CreateData : IMcMapViewport.SCreateData, apTerrains : IMcMapTerrain[], apQuerySecondaryDtmLayers? : IMcDtmMapLayer[]) : IMcMapViewport;
        function RenderStatic(apViewports : IMcMapViewport[]) : void;
        function RenderAll() : void;
        function SetSpecialMaterialParams(strSpecialMaterial : string, Technique : number | string | IMcProperty.SPropertyNameID, Pass : number | string | IMcProperty.SPropertyNameID,
            eGpuProgramType : EGpuProgramType, aParameters : IMcProperty.SVariantProperty[]) : void;
        function SetSpecialMaterialTextureName(strSpecialMaterial : string, Technique : number | string | IMcProperty.SPropertyNameID, Pass : number | string | IMcProperty.SPropertyNameID,
            TextureUnit : number | string | IMcProperty.SPropertyNameID, strTextureName : string) : void;

        enum EObjectDelayType {
            EODT_VIEWPORT_CHECK_HIDDEN_OBJECT_COLLISION, 
            EODT_VIEWPORT_CHANGE_OBJECT_UPDATE,
            EODT_VIEWPORT_CHANGE_OBJECT_CONDITION,
            EODT_VIEWPORT_CHANGE_OBJECT_SIZE,
            EODT_VIEWPORT_CHANGE_OBJECT_HEIGHT,
            EODT_VIEWPORT_DEFRAG_OBJECT_BATCHES
        }
        enum EPendingUpdateType {
            EPUT_TERRAIN,
            EPUT_OBJECTS,
            EPUT_GLOBAL_MAP,
            EPUT_GRID, EPUT_IMAGEPROCESS, 
            EPUT_ANY_UPDATE
        }
        enum EImageProcessingStage {
            EIPS_RASTER_LAYERS,
            EIPS_WITHOUT_OBJECTS, 
            EIPS_ALL
        }
        enum ETerrainNoiseMode {
            ETNM_NONE, 
            ETNM_NOISE_TEXTURE
        }
        enum EShadowMode {
            ESM_NONE, 
            ESM_STENCIL_MODULATIVE, 
            ESM_STENCIL_ADDITIVE, 
            ESM_TEXTURE_MODULATIVE, 
            ESM_TEXTURE_ADDITIVE, 
            ESM_TEXTURE_ADDITIVE_INTEGRATED, 
            ESM_TEXTURE_MODULATIVE_INTEGRATED
        }
        enum EDisplayingItemsAttachedToTerrain {
            EDIATT_ON_TERRAIN_ONLY,
            EDIATT_ON_TERRAIN_AND_SPECIFIED_ITEMS, 
            EDIATT_ON_TERRAIN_AND_ALL_MESH_ITEMS
        }
        enum EGpuProgramType {
            EGPT_VERTEX_PROGRAM,
            EGPT_FRAGMENT_PROGRAM
        }
        interface ICameraUpdateCallback {
            /** Mandatory */
            OnActiveCameraUpdated(pViewport : IMcMapViewport) : void;
            /** Optional */
            Release() : void;
        }
        namespace ICameraUpdateCallback {
            function extend(strName : string, Class : any) : ICameraUpdateCallback;
        }
        class SCreateData {
            constructor(mapType : IMcMapCamera.EMapType);
            pDevice : IMcMapDevice;
            pCoordinateSystem : IMcGridCoordinateSystem;
            pOverlayManager : IMcOverlayManager;
            uViewportID : number;
            hWnd : HTMLCanvasElement;
            pShareWindowViewport : IMcMapViewport;
            pGrid : IMcMapGrid;
            pImageCalc : IMcImageCalc;
            eMapType : IMcMapCamera.EMapType;
            TopLeftCornerInWindow : SMcFVector2D;
            BottomRightCornerInWindow : SMcFVector2D;
            bShowGeoInMetricProportion : boolean;
            eDtmUsageAndPrecision : IMcSpatialQueries.EQueryPrecision;
            fTerrainObjectsBestResolution : number;
            bTerrainObjectsCache : boolean;
            eDisplayingItemsAttachedToTerrain : EDisplayingItemsAttachedToTerrain;
            fTerrainResolutionFactor : number;
        }
        class SHeigtColor {
            constructor();
            Color : SMcBColor; 
            nHeightInSteps : number;
        }
        class SDtmVisualizationParams {
            constructor();
            aHeightColors : IMcMapViewport.SHeigtColor[];
            fHeightColorsHeightOrigin : number;
            fHeightColorsHeightStep : number;
            fShadingHeightFactor : number;
            fShadingLightSourceYaw : number;
            fShadingLightSourcePitch : number;
            uHeightColorsTransparency : number;
            uShadingTransparency: number;
            bHeightColorsInterpolation : boolean;
            bDtmVisualizationAboveRaster : boolean;
            static SetDefaultHeightColors(Params : SDtmVisualizationParams, fMinHeight? : number, fMaxHeight? : number) : void;
        }
        class SRenderStatistics {
            constructor();
            fLastFPS : number; 
            fAverageFPS : number; 
            fBestFPS : number;
            fWorstFPS : number;
            uNumLastFrameTriangles : number;
            uNumLastFrameBatches : number;
        }
        class SRollingShutterLocation {
            constructor();
            Position : SMcVector3D;
            fYaw : number;
            fPitch : number;
            fRoll : number;
            uRow : number;
        }
        class SRollingShutterData {
            constructor();
            aRollingShutterLocations : SRollingShutterLocation[];
            uNumPixelsPerStrip : number;
        }
        var INTERFACE_TYPE: number;
    }

    interface IMcMapLayer extends IMcBase {
        GetCoordinateSystem() : IMcGridCoordinateSystem;
        GetBoundingBox() : SMcBox;
        GetDirectory() : string;
        SetVisibility(bVisibility : boolean, pMapViewport? :  IMcMapViewport) : void;
        GetVisibility(pMapViewport? :  IMcMapViewport) : boolean;
        GetEffectiveVisibility(pMapViewport : IMcMapViewport, pTerrain : IMcMapTerrain) : boolean;
        SetEarthCurvatureCorrection(pCorrectionPoint : SMcVector3D) : void;
        GetEarthCurvatureCorrectionLocalOffset(WorldPoint : SMcVector3D) : number;
        SetID(uID : number) : void;
        GetID() : number;
        SetUserData(pUserData : IMcUserData) : void;
        GetUserData() : IMcUserData;
        GetBackgroundThreadIndex() : number;
        GetCallback() : IMcMapLayer.IReadCallback;
        GetLevelsOfDetail() : IMcMapLayer.SLayerLodParams[];
        /**
         * @param pTileKey              pTileKey.Value :            IMcMapLayer.SLayerTileKey
         * @param pTileBoundingBox      pTileBoundingBox.Value :    SMcBox
         * @param pbDoesTileExist       pbDoesTileExist.Value :     boolean
         */
        GetTileDataByPoint(Point : SMcVector3D, nLOD : number, bBuildIfPossible : boolean, pTileKey : any, pTileBoundingBox? : any, pbDoesTileExist? : boolean) : void;
        /**
         * @param pTileBoundingBox      pTileBoundingBox.Value :    SMcBox
         * @param pbDoesTileExist       pbDoesTileExist.Value :     boolean
         */
        GetTileDataByKey(TileKey : IMcMapLayer.SLayerTileKey, bBuildIfPossible : boolean, pTileBoundingBox? : any, pbDoesTileExist? : any) : void;

        RemoveLayerAsync() : void;
        ReplaceNativeServerLayerAsync(pNewReadCallback : IMcMapLayer.IReadCallback) : void;
        SetNumTilesInNativeServerRequest(uNumTilesInRequest : number) : void;
        GetNumTilesInNativeServerRequest() : number;
        Save(strBaseDirectory? : string, bSaveUserData? : boolean) : Uint8Array;
        IsInitialized(): boolean;
        GetLayerType() : number;
    }

    namespace IMcMapLayer {
        function GetStandardTilingScheme(eType : IMcMapLayer.ETilingSchemeType) : IMcMapLayer.STilingScheme;
        function SetNativeServerCredentials(strToken : string, strSessionID : string) : void;
        /**
         * @param pstrToken         pstrToken.Value :       string
         * @param pstrSessionID     pstrSessionID.Value :   string
         */
        function GetNativeServerCredentials(pstrToken : any, pstrSessionID : any) : void;
        function CheckAllNativeServerLayersValidityAsync() : void;
        function LoadFromFile(strFileName : string, strBaseDirectory? : string, pUserDataFactory? : IMcUserDataFactory,
            pReadCallbackFactory? : IMcMapLayer.IReadCallbackFactory) : IMcMapLayer;
        function Load(abMemoryBuffer : Uint8Array, strBaseDirectory? : string, pUserDataFactory? : IMcUserDataFactory,
            pReadCallbackFactory? : IMcMapLayer.IReadCallbackFactory) : IMcMapLayer;

        enum EComponentType {
            ECT_FILE, 
            ECT_DIRECTORY
        }
        enum ETilingSchemeType {
		    ETST_MAPCORE,
            ETST_GLOBAL_LOGICAL,
            ETST_GOOGLE_CRS84_QUAD,
            ETST_GOOGLE_MAPS_COMPATIBLE
        }
        enum EBuildingSurfaceType
	    {
	    	EBST_WALL,
	    	EBST_ROOF,
	    	EBST_GROUND,
	    	EBST_WINDOW
	    }
        enum EBuildingGeometryType
	    {
	    	EBGT_SOLID,
	    	EBGT_COMPOSITE_SOLID,
	    	EBGT_MULTI_SURFACE
	    }
        enum EWebMapServiceType {
            EWMS_WMS,
            EWMS_WMTS,
            EWMS_WCS,
            EWMS_MAPCORE,
            EWMS_CSW
        }
        enum ECoordinateAxesOrder {
            ECAO_DEFAULT,
            ECAO_INVERSE,
            ECAO_XY, 
            ECAO_YX
        }
        enum ELayerKind {
            ELK_DTM, 
            ELK_RASTER, 
            ELK_VECTOR, 
            ELK_HEAT_MAP, 
            ELK_STATIC_OBJECTS, 
            ELK_CODE_MAP
        }
        enum EVectorFieldReturnedType {
            EVFRT_INT,
            EVFRT_DOUBLE,
            EVFRT_STRING, 
            EVFRT_WSTRING
        } 
        class STilePostProcessData
        {
            constructor();
            TileKey : IMcMapLayer.SLayerTileKey;
            eTilePixelFormat : IMcTexture.EPixelFormat;	
            TileSizeInPixels: SMcSize;	
            pSrcBuffer : Uint8Array;				
            pTileBuffer : Uint8Array;				
        }
        interface IReadCallback {
            /** Mandatory */
            OnInitialized(pLayer : IMcMapLayer, eStatus : IMcErrors.ECode, strAdditionalDataString : string) : void;
            /** Mandatory */
            OnReadError(pLayer : IMcMapLayer, eErrorCode : IMcErrors.ECode, strAdditionalDataString : string) : void;
            /** Mandatory */
            OnNativeServerLayerNotValid(pLayer: IMcMapLayer, bLayerVersionUpdated : boolean) : void;
            /** Optional */
            OnRemoved(pLayer : IMcMapLayer, eStatus : IMcErrors.ECode, strAdditionalDataString : string) : void;
            /** Optional */
            OnReplaced(pOldLayer : IMcMapLayer, pNewLayer : IMcMapLayer, eStatus : IMcErrors.ECode, strAdditionalDataString : string) : void;
            /** Optional */
            OnPostProcessSourceData(pLayer : IMcMapLayer, bGrayscaleSource : boolean, aVisibleTiles : IMcMapLayer.STilePostProcessData[]) : void;
            /** Optional */
            Release(): void;
            /** Optional */
            GetSaveBufferSize(): number;
            /** Optional */
            SaveToBuffer(aBuffer: Uint8Array): void;
}
        namespace IReadCallback {
            function extend(strName : string, Class : any) : IReadCallback;
        }

        interface IReadCallbackFactory {
            /** Mandatory */
            CreateReadCallback(aBuffer: Uint8Array): IReadCallback;
        }
        namespace IReadCallbackFactory {
            function extend(strName: string, Class: any): IReadCallbackFactory;
        }

        interface IAsyncOperationCallback {
            OnScanExtendedDataResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, aVectorItems : IMcMapLayer.SVectorItemFound[], aUnifiedVectorItemsPoints : SMcVector3D[]) : void;
            /** Optional */
            OnVectorItemPointsResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, aaPoints : SMcVector3D[][]) : void;
             /** Optional */
             /**
             * @param paUniqueValues    the type depends on eReturndType:
             *                            - Int32Array for EVFRT_INT
             *                            - Float64Array for EVFRT_DOUBLE
		     *                            - string[] for EVFRT_STRING or EVFRT_WSTRING
             */
            OnFieldUniqueValuesResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, eReturnedType : IMcMapLayer.EVectorFieldReturnedType, paUniqueValues : any) : void;
             /** Optional */
             /**
             * @param pValue            the type depends on eReturndType:
             *                            - number for EVFRT_INT or EVFRT_DOUBLE
		     *                            - string for EVFRT_STRING or EVFRT_WSTRING
             */
            OnVectorItemFieldValueResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, eReturnedType : IMcMapLayer.EVectorFieldReturnedType, pValue : any) : void;
            /** Optional */
            OnVectorQueryResult(pLayer: IMcMapLayer, eStatus: IMcErrors.ECode, auVectorItemsID : Float64Array) : void;
            /** Optional */
            OnWebServerLayersResults(eStatus : IMcErrors.ECode, strServerURL : string, eWebMapServiceType : IMcMapLayer.EWebMapServiceType,
                aLayers : IMcMapLayer.SServerLayerInfo[], astrServiceMetadataURLs : string[],
                strServiceProviderName: string) : void;
            On3DModelSmartRealityDataResults(sStatus : IMcErrors.ECode, strServerURL : string, uObjectID : SMcVariantID,
                aBuildingHistory : IMcMapLayer.SSmartRealityBuildingHistory[]) : void;
            On3DModelSmartRealityBuildingDataResults(sStatus : IMcErrors.ECode, strServerURL : string, uObjectID : SMcVariantID,
                aBuildingProperties : IMcObject.SKeyVariantValue[]) : void;

        }
        namespace IAsyncOperationCallback {
            function extend(strName : string, Class : any) : IAsyncOperationCallback;
        }


        class SNonNativeParams {
            constructor();
            pCoordinateSystem : IMcGridCoordinateSystem;
            pTilingScheme : IMcMapLayer.STilingScheme;
            fMaxScale : number;
            bResolveOverlapConflicts : boolean;
            bEnhanceBorderOverlap : boolean;
            bFillEmptyTilesByLowerResolutionTiles : boolean;
            TransparentColor : SMcBColor;
            byTransparentColorPrecision : number;
            pReadCallback : IReadCallback;
        }
        class SLocalCacheLayerParams {
            constructor();
            strLocalCacheSubFolder : string;
            strOriginalFolder : string;
        }
        class STilingScheme {
            constructor();
            constructor(TilingOrigin : SMcVector2D, dLargestTileSizeInMapUnits : number, uNumLargestTilesX : number, uNumLargestTilesY : number, uTileSizeInPixels : number, uRasterTileMarginInPixels : number);
            TilingOrigin : SMcVector2D;
            dLargestTileSizeInMapUnits : number;
            uNumLargestTilesX : number;
            uNumLargestTilesY : number;
            uTileSizeInPixels : number;
            uRasterTileMarginInPixels:number;
        }

        class SComponentParams {
            constructor();
            strName : string;
            eType : EComponentType;
            WorldLimit : SMcBox;
        }
        class STileMatrixSet {
            constructor();
            strName : string;
            pCoordinateSystem : IMcGridCoordinateSystem;
            BoundingBox : SMcBox;
            bHasBoundingBox : boolean;
        }
        class SServerLayerInfo {
            constructor();
            strLayerId : string;
            strTitle : string;
            strLayerType : string;
            astrImageFormats : string[];
            bTransparent : boolean;
            astrStyles : string[];
            astrGroups : string[];
            nDrawPriority : number;
            BoundingBox : SMcBox;
            pCoordinateSystem : IMcGridCoordinateSystem;
            aTileMatrixSets : STileMatrixSet[];
            aMetadataValues : SMcKeyStringValue[];
        }
        class SSmartRealityBuildingSurface
        {		
            uSurfaceID : SMcVariantID;
            aSurfaceContour : SMcVector3D[];
            SurfaceNormal : SMcVector3D;
		    SurfaceCenter : SMcVector3D;
		    dSurfaceArea : number;
            eSurfaceType : EBuildingSurfaceType;	
        }
        class SSmartRealityBuildingHistory
        {		
            FlightDate : Date;
            dBuildingHeightAboveBottom : number;
            BoundingBox : SMcBox;
            pCoordinateSystem : IMcGridCoordinateSystem;
            aBuildingSurfaces : SSmartRealityBuildingSurface[];
            uBuildingLod : number;
            eBuildingGeometryType : EBuildingGeometryType;
            dBuildingArea : number;
            dGroundHeight : number;
            dBuildingRoofHeight : number;
            dBuildingHeightAboveGround : number;
            dModelScore : number;
            dQuailityReliabilityScore : number;
            QualityMeasureTime : Date;
        }
        class SRawParams extends SNonNativeParams {
            constructor();
            strDirectory : string;
            aComponents : SComponentParams[];
            uMaxNumOpenFiles : number;
            fFirstPyramidResolution : number;
            auPyramidResolutions : Uint32Array;
            bIgnoreRasterPalette : boolean;
            MaxWorldLimit : SMcBox;
            fHighestResolution : number;
			bAddLevelsOfDetailIfAbsent : boolean;
            pLodProgressCallback : IMcProgressCallback;
            bPostProcessSourceData : boolean;
        }
        class SWebMapServiceParams extends SNonNativeParams {
            constructor();
            strServerURL : string;
            strOptionalUserAndPassword : string;
            bSkipSSLCertificateVerification : boolean;
            aRequestParams : SMcKeyStringValue[];
            uTimeoutInSec : number;
            strLayersList : string;
            strStylesList : string;
            BoundingBox : SMcBox;
            strServerCoordinateSystem : string;
            strImageFormat : string;
            bTransparent : boolean;
            strZeroBlockHttpCodes : string;
            bZeroBlockOnServerException : boolean;
        }
        class SWMSParams extends SWebMapServiceParams {
            constructor();
            strWMSVersion : string;
            uBlockWidth : number;	
            uBlockHeight : number;	
            fMinScale : number;	
        }
        class SWMTSParams extends SWebMapServiceParams {
            constructor();
            strInfoFormat : string;
            bUseServerTilingScheme : boolean;
            bExtendBeyondDateLine : boolean;
            eCapabilitiesBoundingBoxAxesOrder : ECoordinateAxesOrder;
        }
        class SWCSParams extends SWebMapServiceParams {
            constructor();
            strWCSVersion: string;
            bDontUseServerInterpolation : boolean;
        }
        class SLayerTileKey {
            nLOD : number;
            uX : number;
            uY : number;
        }
        class SLayerLodParams {
            nLevelIndex : number;
            TileWorldSize : SMcVector2D;
            TileImagePixelSize : SMcSize;
            dTileImageResolution : number;
        }
        class SVectorItemFound {
            constructor();
            uVectorItemID : number;
            uVectorItemFirstPointIndex : number;
            uVectorItemLastPointIndex : number;
        }
    }

    interface IMcDtmMapLayer extends IMcMapLayer {
        /**
         * @param pTileGeometry      pTileGeometry.Value :     IMcDtmMapLayer.STileGeometry
         */
        GetTileGeometryByKey(TileKey : IMcMapLayer.SLayerTileKey, bBuildIfPossible : boolean, pTileGeometry : any) : void;
    }

    namespace IMcDtmMapLayer {
        class STileGeometry {
            constructor();
            aPointsCoordinates : SMcFVector3D[];	
            aPointsNormals : SMcFVector3D[];		
            auConnectionIndices : Uint16Array;
            uNumSkirtPoints : number;
            uNumSkirtIndices : number;
            fMinHeight : number;
            fMaxHeight : number;
        }
    }

    interface IMcNativeDtmMapLayer extends IMcDtmMapLayer {
        /**
         * @param puNumLevelsToIgnore           puNumLevelsToIgnore.Value :     number
         */
         GetCreateParams(puNumLevelsToIgnore : any) : void;
    }
    namespace IMcNativeDtmMapLayer {
        function Create(strDirectory : string, uNumLevelsToIgnore? : number, pReadCallback? : IMcMapLayer.IReadCallback, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeDtmMapLayer;
        var LAYER_TYPE: number;
    }

    interface IMcNativeServerDtmMapLayer extends IMcDtmMapLayer {}
    namespace IMcNativeServerDtmMapLayer {
        function Create(strDirectory : string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerDtmMapLayer;
        var LAYER_TYPE: number;
    }

    interface IMcRawDtmMapLayer extends IMcDtmMapLayer {
        	/**
             * @param pParams           pParams.Value :     IMcMapLayer.SRawParams
             */
            GetCreateParams(pParams : any) : void;
	        GetComponents() : IMcMapLayer.SComponentParams[];
            /**
             * @param pauPyramidResolutions           pauPyramidResolutions.Value :     Uint32Array
             * @param pfFirstPyramidResolution        pfFirstPyramidResolution.Value :  number
             */
	        GetResolutions(pauPyramidResolutions : any, pfFirstPyramidResolution : any) : void;
    }
    namespace IMcRawDtmMapLayer {
        function Create(Params : IMcMapLayer.SRawParams, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcRawDtmMapLayer;
        var LAYER_TYPE: number;
    }

    interface IMcWebServiceDtmMapLayer extends IMcDtmMapLayer {
        GetWebMapServiceType() : IMcMapLayer.EWebMapServiceType;
        GetWMSParams()  : IMcMapLayer.SWMSParams;
        GetWMTSParams() : IMcMapLayer.SWMTSParams;
        GetWCSParams()  : IMcMapLayer.SWCSParams;
    }
    namespace IMcWebServiceDtmMapLayer {
        function Create(Params : IMcMapLayer.SWMSParams | IMcMapLayer.SWMTSParams | IMcMapLayer.SWCSParams, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcWebServiceDtmMapLayer;
        var LAYER_TYPE: number;
    }

    interface IMcRasterMapLayer extends IMcMapLayer {
        CalcHistogram() : MC_HISTOGRAM[];
        /**
         * @param peBitmapPixelFormat       peBitmapPixelFormat.Value :         IMcTexture.EPixelFormat
         * @param pbBitmapFromTopToBottom   pbBitmapFromTopToBottom.Value :     boolean
         * @param pBitmapSize               pBitmapSize.Value :                 SMcSize
         * @param pBitmapMargins            pBitmapMargins.Value :              SMcSize
         */
        GetTileBitmapByKey(TileKey : IMcMapLayer.SLayerTileKey, bDecompress : boolean,
		peBitmapPixelFormat : any, pbBitmapFromTopToBottom : boolean,
		pBitmapSize : any, pBitmapMargins : any) : Uint8Array;
    }

    interface IMcNativeRasterMapLayer extends IMcRasterMapLayer {
        /**
         * @param puFirstLowerQualityLevel          puFirstLowerQualityLevel.Value :    number
         * @param pbThereAreMissingFiles            pbThereAreMissingFiles.Value :      boolean
         * @param puNumLevelsToIgnore               puNumLevelsToIgnore.Value :         number
         * @param pbEnhanceBorderOverlap            pbEnhanceBorderOverlap.Value :      boolean
         */
         GetCreateParams(puFirstLowerQualityLevel : any, pbThereAreMissingFiles : any, puNumLevelsToIgnore : any, pbEnhanceBorderOverlap : any) : void;
    }
    namespace IMcNativeRasterMapLayer {
        function Create(strDirectory :string, uFirstLowerQualityLevel? : number, bThereAreMissingFiles? : boolean,
            uNumLevelsToIgnore? : number, bEnhanceBorderOverlap? : boolean,
            pReadCallback? : IMcMapLayer.IReadCallback, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeRasterMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcNativeServerRasterMapLayer extends IMcRasterMapLayer {}
    namespace IMcNativeServerRasterMapLayer {
        function Create(strLayerURL :string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerRasterMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcRawRasterMapLayer extends IMcRasterMapLayer {
        /**
         * @param pParams                   pParams.Value :                 IMcMapLayer.SRawParams
         * @param pbImageCoordinateSystem   pbImageCoordinateSystem.Value : boolean
         */
        GetCreateParams(pParams : any, pbImageCoordinateSystem : any) : void;
        GetComponents() : IMcMapLayer.SComponentParams[];
        AddComponents(aComponents : IMcMapLayer.SComponentParams[]) : void;
         /**
         * @param pauPyramidResolutions           pauPyramidResolutions.Value :     Uint32Array
         * @param pfFirstPyramidResolution        pfFirstPyramidResolution.Value :  number
         */
        GetResolutions(pauPyramidResolutions: any, pfFirstPyramidResolution: any): void;
        SetColorChannels(uRChanelIndex: number, uGChanelIndex: number, uBChanelIndex: number): void;
        /**
         * @param puRChanelIndex         puRChanelIndex.Value :  number
         * @param puGChanelIndex         puGChanelIndex.Value :  number
         * @param puBChanelIndex         puBChanelIndex.Value :  number
         */
        GetColorChannels(puRChanelIndex: any, puGChanelIndex: any, puBChanelIndex: any): void;

    }
    namespace IMcRawRasterMapLayer {
        function Create(Params : IMcMapLayer.SRawParams, bImageCoordinateSystem? : boolean, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcRawRasterMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcWebServiceRasterMapLayer extends IMcRasterMapLayer {
        GetWebMapServiceType() : IMcMapLayer.EWebMapServiceType;
        GetWMSParams()  : IMcMapLayer.SWMSParams;
        /**
        * @param pbUsedServerTilingScheme              pbUsedServerTilingScheme.Value :        boolean
        */
        GetWMTSParams(pbUsedServerTilingScheme?: any): IMcMapLayer.SWMTSParams;
        GetWCSParams()  : IMcMapLayer.SWCSParams;
    }
    namespace IMcWebServiceRasterMapLayer {
        function Create(Params : IMcMapLayer.SWMSParams | IMcMapLayer.SWMTSParams | IMcMapLayer.SWCSParams, pLocalCacheLayerParams?: IMcMapLayer.SLocalCacheLayerParams): IMcWebServiceRasterMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcCodeMapLayer extends IMcRasterMapLayer {
        SetColorTable(aCodeMapColors : IMcCodeMapLayer.SCodeMapData[]) : void;
        GetColorTable() : IMcCodeMapLayer.SCodeMapData[];
    }
    namespace IMcCodeMapLayer {
        class SCodeMapData {
            uCode : number;
            CodeColor : SMcBColor;
        }
    }

    interface IMcMaterialMapLayer extends IMcCodeMapLayer {
        GetMaterialIDFromColorCode(ColorCode : SMcBColor) : number;
    }
    
    interface IMcNativeMaterialMapLayer extends IMcMaterialMapLayer {
        /**
         * @param pbThereAreMissingFiles           pbThereAreMissingFiles.Value :     boolean
         */
        GetCreateParams(pbThereAreMissingFiles : any) : void;
    }
    namespace IMcNativeMaterialMapLayer {
        function Create(strDirectory :string, bThereAreMissingFiles? : boolean, pReadCallback? : IMcMapLayer.IReadCallback, 
            pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeTraversabilityMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcNativeServerMaterialMapLayer extends IMcMaterialMapLayer {}
    namespace IMcNativeServerMaterialMapLayer {
        function Create(strLayerURL :string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerMaterialMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcRawMaterialMapLayer extends IMcMaterialMapLayer {
        /**
         * @param pParams           pParams.Value :     IMcMapLayer.SRawParams
         */
        GetCreateParams(pParams: any): void;
        GetComponents(): IMcMapLayer.SComponentParams[];
        /**
         * @param pauPyramidResolutions           pauPyramidResolutions.Value :     Uint32Array
         * @param pfFirstPyramidResolution        pfFirstPyramidResolution.Value :  number
         */
        GetResolutions(pauPyramidResolutions: any, pfFirstPyramidResolution: any): void;
    }
    namespace IMcRawMaterialMapLayer {
        function Create(Params: IMcMapLayer.SRawParams, pLocalCacheLayerParams?: IMcMapLayer.SLocalCacheLayerParams): IMcRawMaterialMapLayer;
        var LAYER_TYPE: number;
    }

    interface IMcTraversabilityMapLayer extends IMcCodeMapLayer {
        GetNumTraversabilityDirections() : number;
        GetTraversabilityFromColorCode(ColorCode : SMcBColor) : IMcTraversabilityMapLayer.STraversabilityDirection[];
    }
    namespace IMcTraversabilityMapLayer {
        class STraversabilityDirection {
            fDirectionAngle : number;
            bTraversable : boolean;
        }
    }

    interface IMcNativeTraversabilityMapLayer extends IMcTraversabilityMapLayer {
        /**
         * @param pbThereAreMissingFiles           pbThereAreMissingFiles.Value :     boolean
         */
        GetCreateParams(pbThereAreMissingFiles : any) : void;
    }
    namespace IMcNativeTraversabilityMapLayer {
        function Create(strDirectory :string, bThereAreMissingFiles? : boolean, pReadCallback? : IMcMapLayer.IReadCallback, 
            pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeTraversabilityMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcNativeServerTraversabilityMapLayer extends IMcTraversabilityMapLayer {}
    namespace IMcNativeServerTraversabilityMapLayer {
        function Create(strLayerURL :string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerTraversabilityMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcRawTraversabilityMapLayer extends IMcTraversabilityMapLayer {
        /**
         * @param pParams           pParams.Value :     IMcMapLayer.SRawParams
         */
        GetCreateParams(pParams: any): void;
        GetComponents(): IMcMapLayer.SComponentParams[];
        /**
         * @param pauPyramidResolutions           pauPyramidResolutions.Value :     Uint32Array
         * @param pfFirstPyramidResolution        pfFirstPyramidResolution.Value :  number
         */
        GetResolutions(pauPyramidResolutions: any, pfFirstPyramidResolution: any): void;
    }
    namespace IMcRawTraversabilityMapLayer {
        function Create(Params: IMcMapLayer.SRawParams, pLocalCacheLayerParams?: IMcMapLayer.SLocalCacheLayerParams): IMcRawTraversabilityMapLayer;
        var LAYER_TYPE: number;
    }

    interface IMcStaticObjectsMapLayer extends IMcMapLayer {
        SetObjectsColors(aObjectsColors: IMcStaticObjectsMapLayer.SObjectColor[]): void;
        SetObjectsColor(Color: SMcBColor, auObjectsIDs: SMcVariantID[]): void;
        RemoveAllObjectsColors(): void;
        GetObjectsColors(): IMcStaticObjectsMapLayer.SObjectColor[];
        GetObjectColor(uObjectID: SMcVariantID): SMcBColor;
        SetDisplayingItemsAttachedToTerrain(bDisplaysItemsAttachedToTerrain : boolean, pMapViewport? : IMcMapViewport) : void;
        SetDisplayingDtmVisualization(bDisplaysDtmVisualization : boolean, pMapViewport? : IMcMapViewport) : void;
    }
    namespace IMcStaticObjectsMapLayer {
        class SObjectColor {
            constructor();
            uObjectID: SMcVariantID;
            Color: SMcBColor;
        }
    }

    interface IMc3DModelMapLayer extends IMcStaticObjectsMapLayer {
	    SetResolutionFactor(fResolutionFactor : number, pMapViewport? : IMcMapViewport) : void;
        SetResolvingConflictsWithDtmAndRaster(bResolvesConflictsWithDtmAndRaster : boolean, pMapViewport? : IMcMapViewport) : void;
    }
    
    interface IMcNative3DModelMapLayer extends IMc3DModelMapLayer { 
        /**
         * @param puNumLevelsToIgnore           puNumLevelsToIgnore.Value :     number
         */
         GetCreateParams(puNumLevelsToIgnore : any) : void;
    }
    namespace IMcNative3DModelMapLayer {
        function Create(strDirectory : string, uNumLevelsToIgnore? : number, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNative3DModelMapLayer;
        var LAYER_TYPE : number;
    }
    
    interface IMcNativeServer3DModelMapLayer extends IMc3DModelMapLayer { }
     namespace IMcNativeServer3DModelMapLayer {
        function Create(strLayerURL : string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServer3DModelMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcRaw3DModelMapLayer extends IMc3DModelMapLayer { 
        /**
         * @param pstrRawDataDirectory          pstrRawDataDirectory.Value :        string
         * @param peSourceVerticalDatumType     peSourceVerticalDatumType.Value :   EMcVerticalDatumType
         * @param puNumLevelsToIgnore           puNumLevelsToIgnore.Value :         number
         * @param ppTargetCoordinateSystem      ppTargetCoordinateSystem.Value :    IMcGridCoordinateSystem
         * @param ppClipRect                    ppClipRect.Value :                  SMcBox
         * @param pfTargetHighestResolution     pfTargetHighestResolution.Value :   number
         * @param pstrIndexingDataDirectory     pstrIndexingDataDirectory.Value :   string
         * @param pbNonDefaultIndexingDataDirectory pbNonDefaultIndexingDataDirectory.value : number
         * @param paRequestParams               array created by the user, allocated and filled by MapCore
         * @param pPositionOffset               pPositionOffset.Value :  SMcVector3D
         */
        GetCreateParams(
            pstrRawDataDirectory : any, peSourceVerticalDatumType : any, puNumLevelsToIgnore : any,
            ppTargetCoordinateSystem : any, ppClipRect : any,
            pfTargetHighestResolution : any,
            pstrIndexingDataDirectory : any, pbNonDefaultIndexingDataDirectory : any, paRequestParams : SMcKeyStringValue[], pPositionOffset? : any) : void;
        BuildIndexingData(strRawDataDirectory : string, pTargetCoordinateSystem : IMcGridCoordinateSystem, pClipRect? : SMcBox, 
            pTilingScheme? : IMcMapLayer.STilingScheme, fTargetHighestResolution? : number, bUseExisting? : boolean,
            strIndexingDataDirectory? : string)  : void;
        DeleteIndexingData(strRawDataDirectory : string, strIndexingDataDirectory? : string) : void;
    }
     namespace IMcRaw3DModelMapLayer {
         function Create(strRawDataDirectory : string, eSourceVerticalDatumType? : EMcVerticalDatumType, uNumLevelsToIgnore? : number, pReadCallback? : IMcMapLayer.IReadCallback,
             strIndexingDataDirectory? : string): IMcRaw3DModelMapLayer;
         function Create(strRawDataDirectory : string, pTargetCoordinateSystem : IMcGridCoordinateSystem, eSourceVerticalDatumType?: EMcVerticalDatumType, pClipRect? : SMcBox,
             fTargetHighestResolution? : number, pReadCallback? : IMcMapLayer.IReadCallback, aRequestParams? : SMcKeyStringValue[], 
             PositionOffset? : SMcVector3D): IMcRaw3DModelMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcVector3DExtrusionMapLayer extends IMcStaticObjectsMapLayer {
	    GetObjectIDBitCount() : number;
        IsExtrusionHeightChangeSupported() : boolean;
        SetObjectExtrusionHeight(uObjectID : SMcVariantID, fHeight : number) : void;
        SetObjectsExtrusionHeights( aObjectsHeights : IMcVector3DExtrusionMapLayer.SObjectExtrusionHeight[]) : void;
        RemoveAllObjectsExtrusionHeights() : void;
        GetObjectExtrusionHeight(uObjectID : SMcVariantID) : number;
        GetObjectsExtrusionHeights() : IMcVector3DExtrusionMapLayer.SObjectExtrusionHeight[];
    }
    namespace IMcVector3DExtrusionMapLayer {
        class SObjectExtrusionHeight {
            constructor();
            uObjectID : SMcVariantID;
            fHeight :   number;
        }
    }
    
    interface IMcNativeVector3DExtrusionMapLayer extends IMcVector3DExtrusionMapLayer { 
        /**
         * @param puNumLevelsToIgnore           puNumLevelsToIgnore.Value :             number
         * @param pfExtrusionHeightMaxAddition  pfExtrusionHeightMaxAddition.Value :    number
         */
         GetCreateParams(puNumLevelsToIgnore : any, pfExtrusionHeightMaxAddition : any) : void;
    }
    namespace IMcNativeVector3DExtrusionMapLayer {
        function Create(strDirectory : string, uNumLevelsToIgnore? : number, fExtrusionHeightMaxAddition? : number, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeVector3DExtrusionMapLayer;
        var LAYER_TYPE : number;
    }

     interface IMcNativeServerVector3DExtrusionMapLayer extends IMcVector3DExtrusionMapLayer { }
    namespace IMcNativeServerVector3DExtrusionMapLayer {
        function Create(strLayerURL : string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerVector3DExtrusionMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcRawVector3DExtrusionMapLayer extends IMcVector3DExtrusionMapLayer { 
        /**
         * @param pParams                       pParams.Value :                         number
         * @param pfExtrusionHeightMaxAddition  pfExtrusionHeightMaxAddition.Value :    number
         * @param pstrIndexingDataDirectory     pstrIndexingDataDirectory.Value :   string
         * @param pbNonDefaultIndexingDataDirectory pbNonDefaultIndexingDataDirectory.value : number
         */
         GetCreateParams(pParams : any, pfExtrusionHeightMaxAddition : any, pstrIndexingDataDirectory : any, pbNonDefaultIndexingDataDirectory : any) : void;
         BuildIndexingData(strDataSource : string, pSourceCoordinateSystem : IMcGridCoordinateSystem, pTargetCoordinateSystem? : IMcGridCoordinateSystem, 
            pClipRect? : SMcBox, pTilingScheme? : IMcMapLayer.STilingScheme, bUseExisting? : boolean, strIndexingDataDirectory? : string)  : void;  
        DeleteIndexingData(strDataSource : string, strIndexingDataDirectory? : string) : void;
    }
    namespace IMcRawVector3DExtrusionMapLayer {
        function Create(Params : IMcRawVector3DExtrusionMapLayer.SParams, fExtrusionHeightMaxAddition? : number, pReadCallback? : IMcMapLayer.IReadCallback) : IMcRawVector3DExtrusionMapLayer;
        function Create(strDataSource: string, Params : IMcRawVector3DExtrusionMapLayer.SGraphicalParams, fExtrusionHeightMaxAddition? : number, pReadCallback? : IMcMapLayer.IReadCallback, 
                strIndexingDataDirectory? : string) : IMcRawVector3DExtrusionMapLayer;
            
        enum ETexturePlacementFlags {
            ETPF_NONE,
            ETPF_REPEAT_EDGE_PIXELS,
            ETPF_RESTART_EACH_FACE,
            ETPF_ALIGN_CENTER,
            ETPF_REVERSE_ALIGNMENT,
            ETPF_FIT
        }

        class SExtrusionTexture {
            constructor();
            strTexturePath : string;
            TextureScale : SMcFVector2D;
            uXPlacementBitField : number;
            uYPlacementBitField : number;

        }
        class SGraphicalParams {
            constructor();
            RoofDefaultTexture : SExtrusionTexture;				
            SideDefaultTexture : SExtrusionTexture;				
            aSpecificTextures : SExtrusionTexture[];				
            strHeightColumn : string;
            strObjectIDColumn : string;
            strRoofTextureIndexColumn : string;
            strSideTextureIndexColumn : string;
		}

        class SParams extends SGraphicalParams {
            constructor(_strDataSource? : string, _pSourceCoordSys? :  IMcGridCoordinateSystem);
            strDataSource : string;								
            pSourceCoordinateSystem : IMcGridCoordinateSystem;	
            pTargetCoordinateSystem : IMcGridCoordinateSystem;	
            pTilingScheme : IMcMapLayer.STilingScheme;
            pClipRect : SMcBox;
		}
        var LAYER_TYPE : number;
    }

    interface IMcVectorBasedMapLayer extends IMcMapLayer { }
   
    interface IMcVectorMapLayer extends IMcVectorBasedMapLayer {
        SetOverlayState(StateOrStatesArray : number | Uint8Array, pMapViewport? : IMcMapViewport) : void;
        GetOverlayState(pMapViewport? : IMcMapViewport) : Uint8Array;
        SetOverlayState(uVectorItemID : number, StateOrStatesArray : number | Uint8Array, pMapViewport? : IMcMapViewport) : void;
        GetOverlayState(uVectorItemID : number, pMapViewport? : IMcMapViewport) : Uint8Array;
        SetOverlayDrawPriority(bEnabled : boolean, nPriority : number) : void;
        /**
         * @param nPriority    nPriority.Value :   number
         */
        GetOverlayDrawPriority(nPriority : any) : boolean;
        SetDrawPriorityConsistency(bConsistency : boolean) : void;
        GetDrawPriorityConsistency() : boolean;
        SetCollisionPrevention(bCollisionPrevention : boolean) : void;
        GetCollisionPrevention() : boolean;
        SetBrightness(fBrightness : number, pMapViewport? : IMcMapViewport) : void;
        GetBrightness(pMapViewport? : IMcMapViewport) : number;
        LockIO() : void;
        UnLockIOAndRefresh() : void;
        SetToleranceForPoint(nTolerance : number) : void;
        GetToleranceForPoint() : number;
        SetFieldAsInt(nFieldId : number, nVectorItemId : number, nNewVal : number) : void;
        SetFieldAsDouble(nFieldId : number, nVectorItemId : number, nNewVal : number) : void;
        SetFieldAsString(nFieldId : number, nVectorItemId : number, strNewVal : string) : void;
        DeleteVectorItem(nVectorItemId : number) : void;
        AddVectorItem(pPointArr : SMcVector3D, nPointsNum : number, Geometry : EGeometry) : number;
        UpdateVectorItemGeometry(pNewPointArr : SMcVector3D, nPointsNum : number, eGeometry : EGeometry, uVectorItemId : number) : void;
        SyncToDisc() : void;
        GetNumFields() : number;
        /**
         * @param pstrName          pstrName.Value :      string
         * @param peFieldType       peFieldType.Value :   EFieldType
         */
        GetFieldData(nFieldId : number, pstrName : any, peFieldType : any) : void;
        GetValidFieldsPerDataSource(uVectorItemID : number, strDataSourceName? : string, uDataSourceID? : number) : Uint32Array;
        GetGeometryType() : EGeometry;
        GetVectorItemsCount() : number;
        GetVectorItemPoints(nVectorItemId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : SMcVector3D[][];
        /**
         * @param paVectorItems                    paVectorItems.Value :                IMcMapLayer.SVectorItemFound[]
         * @param paUnifiedVectorItemsPoints       paUnifiedVectorItemsPoints.Value :   SMcVector3D[]
         * @param paUnifiedVectorItemsPoints       paUnifiedVectorItemsPoints.Value :   SMcVector3D[]
         */
        GetScanExtendedData(ScanGeometry : SMcScanGeometry, VectorTargetFound : IMcSpatialQueries.STargetFound, pMapViewport : IMcMapViewport, paVectorItems : any, paUnifiedVectorItemsPoints? : any, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : void;
        GetFieldUniqueValuesAsInt(nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : Int32Array;
        GetFieldUniqueValuesAsDouble(nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : Float64Array;
        GetFieldUniqueValuesAsString(nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : string[];
        GetFieldUniqueValuesAsWString(nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : string[]
        GetVectorItemFieldValueAsInt(nVectorItemId : number, nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : number;
        GetVectorItemFieldValueAsDouble(nVectorItemId : number, nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : number;
        GetVectorItemFieldValueAsString(nVectorItemId : number, nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : string;
        GetVectorItemFieldValueAsWString(nVectorItemId : number, nFieldId : number, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : string;
        Query(strAttributeFilter : string, pAsyncOperationCallback? : IMcMapLayer.IAsyncOperationCallback) : Float64Array;
        /**
         * @param pastrAttributesNames          array created by the user, allocated and filled by MapCore
         * @param pastrAttributesValues         array created by the user, allocated and filled by MapCore
         */
        GetLayerAttributes(pastrAttributesNames : string[], pastrAttributesValues? : string[]) : void;
        /**
         * @param pastrDataSourcesNames         array created by the user, allocated and filled by MapCore
         * @param pauDataSourcesIDs             pauDataSourcesIDs.Value : Uint32Array;
         */
        GetLayerDataSources(pastrDataSourcesNames : string[], pauDataSourcesIDs? : any) : void;
        /**
         * @param puOriginalID                  puOriginalID.Value : number;
         * @param pstrDataSourceName            pstrDataSourceName.Value : string;
         * @param puDataSourceID                puDataSourceID.Value : number;
         */
        VectorItemIDToOriginalID(uVectorItemID : number, puOriginalID : any, pstrDataSourceName? : any, puDataSourceID? : any) : void;
        VectorItemIDFromOriginalID(uOriginalID : number, strDataSourceName? : string, uDataSourceID? : number): number;
        IsLiteVectorLayer() : boolean;
        /**
         * @param pfMinSizeFactor    pfMinSizeFactor.Value :   number
         * @param pfMaxSizeFactor    pfMaxSizeFactor.Value :   number
         */
        GetMinMaxSizeFactor(pfMinSizeFactor : any, pfMaxSizeFactor : any) : void;
        GetExtendedGeometryDataSize() : number;
        LoadExtendedGeometryDataToMemory() : void;
    }

    interface IMcNativeVectorMapLayer extends IMcVectorMapLayer {
    }
    namespace IMcNativeVectorMapLayer {
        function Create(strDirectory : string, pReadCallback? : IMcMapLayer.IReadCallback, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeVectorMapLayer;
        var LAYER_TYPE : number;
    }
    
    interface IMcNativeServerVectorMapLayer extends IMcVectorMapLayer {}
    namespace IMcNativeServerVectorMapLayer {
        function Create(strDirectory : string, pReadCallback? : IMcMapLayer.IReadCallback) : IMcNativeServerVectorMapLayer;
        var LAYER_TYPE : number;
    }
    
    interface IMcRawVectorMapLayer extends IMcVectorMapLayer {
        /**
         * @param pParams                       pParams.Value :                     IMcRawVectorMapLayer.SParams
         * @param ppTargetCoordinateSystem      ppTargetCoordinateSystem.Value :    IMcGridCoordinateSystem
         * @param ppTilingScheme                ppTilingScheme.Value :              IMcMapLayer.STilingScheme
         */
        GetCreateParams(pParams : any, ppTargetCoordinateSystem : any, ppTilingScheme : any) : void;
	    GetDataSourceSubLayersProperties(strDataSource : string, bMultiGeometriesSuffixByName : boolean) : IMcRawVectorMapLayer.SDataSourceSubLayersProperties;
	    GetStylingParams() : IMcRawVectorMapLayer.SInternalStylingParams;
	    IsRasterizedVectorLayer() : boolean;
    }
    namespace IMcRawVectorMapLayer {
        function Create(Params : IMcRawVectorMapLayer.SParams, pTargetCoordinateSystem? : IMcGridCoordinateSystem,
		    pTilingScheme? : IMcMapLayer.STilingScheme, pReadCallback? : IMcMapLayer.IReadCallback, 
            pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcRawVectorMapLayer;
        var LAYER_TYPE : number;

        enum EAutoStylingType {
            EAST_NONE,
            EAST_INTERNAL,
            EAST_S52,
            EAST_CUSTOM
        }

        class SInternalStylingParams {
            constructor(_strOutputFolder? : string, _strOutputXMLFileName? : string, _eVersion? : IMcOverlayManager.ESavingVersionCompatibility, _fMaxScaleFactor? : number, 
                _pDefaultFont? : IMcFont, _fTextMaxScale? : number, _strStylingFile? : string);
            strOutputFolder : string;
            strOutputXMLFileName : string;
            strStylingFile : string;
            eVersion : IMcOverlayManager.ESavingVersionCompatibility;
            fMaxScaleFactor : number;
            pDefaultFont : IMcFont;
            fTextMaxScale : number;
        }

        class SParams {
            constructor(_strDataSource : string,
                _pSourceCoordinateSystem : IMcGridCoordinateSystem,
                _fMinScale? : number, _fMaxScale? : number,
                _strPointTextureFile? : string,
                _strLocaleStr? : string,
                _dSimplificationTolerance? : number,
                _pClipRect? : SMcBox,
                _StylingParams? : IMcRawVectorMapLayer.SInternalStylingParams,
                _eAutoStylingType? : EAutoStylingType,
                _strCustomStylingFolder? : string);
            strDataSource : string;
            fMinScale : number;
            fMaxScale : number;
            strPointTextureFile : string;
            strLocaleStr : string;
            dSimplificationTolerance : number;
            pSourceCoordinateSystem : IMcGridCoordinateSystem;
            pClipRect : SMcBox;
            eAutoStylingType : EAutoStylingType;
            strCustomStylingFolder : string;
            StylingParams : SInternalStylingParams;
            uMaxNumVerticesPerTile : number;
            uMaxNumVisiblePointObjectsPerTile : number;
            uMinPixelSizeForObjectVisibility : number;
            fOptimizationMinScale : number;
        }

        class SDataSourceSubLayerProperties {
            constructor();
            uLayerIndex : number;						
            strLayerName : string;			
            eGeometry : EGeometry;					
            eExtendedGeometry : EExtendedGeometry;	
            strMultiGeometriesSuffix : string;
            uNumVectorItems : number;					
        }

        class SDataSourceSubLayersProperties {
            constructor();
            aLayersProperties : IMcRawVectorMapLayer.SDataSourceSubLayerProperties[];
        }

    }

    interface IMcGlobalMap {
        SetGlobalMapAutoCenterMode(bAutoCenter : boolean) : void;
        GetGlobalMapAutoCenterMode() : boolean;
        RegisterLocalMap(pLocalMap : IMcMapViewport) : void;
	    GetRegisteredLocalMaps() : IMcMapViewport[];
        UnRegisterLocalMap(pLocalMap : IMcMapViewport) : void;
        SetActiveLocalMap(pLocalMap : IMcMapViewport) : void;
        GetActiveLocalMap() : IMcMapViewport;
        SetLocalMapFootprintItem(pInactiveLine : IMcLineItem, pActiveLine : IMcLineItem, pInactiveCameraPosIcon? : IMcPictureItem, pActiveCameraPosIcon? : IMcPictureItem, 
			pInactiveLookAtTargetIcon? : IMcPictureItem, pActiveLookAtTargetIcon? : IMcPictureItem, pLocalMap? : IMcMapViewport) : void;
        /**
         * @param ppInactiveLine                ppInactiveLine.Value :              IMcLineItem
         * @param ppActiveLine                  ppActiveLine.Value :                IMcLineItem
         * @param ppInactiveCameraPosIcon       ppInactiveCameraPosIcon.Value :     IMcPictureItem
         * @param ppActiveCameraPosIcon         ppActiveCameraPosIcon.Value :       IMcPictureItem
         * @param ppInactiveLookAtTargetIcon    ppInactiveLookAtTargetIcon.Value :  IMcPictureItem
         * @param ppActiveLookAtTargetIcon      ppActiveLookAtTargetIcon.Value :    IMcPictureItem
         */
        GetLocalMapFootprintItem(pInactiveLine : any, ppActiveLine : any, ppInactiveCameraPosIcon? : any, ppActiveCameraPosIcon? : any, 
			ppInactiveLookAtTargetIcon? : any, ppActiveLookAtTargetIcon? : any, ppLocalMap? : IMcMapViewport) : void;
        /**
         * @param paPolygonPoints   array created by the user, allocated and filled by MapCore
         * @param paArrowPoints     array created by the user, allocated and filled by MapCore
         */
        GetLocalMapFootprintScreenPositions(pLocalMap : IMcMapViewport, paPolygonPoints : SMcVector2D[], paArrowPoints? : SMcVector2D[]) : void;
        /**
         * @param pbRenderNeeded    pbRenderNeeded.Value :   boolean
         * @param peCursorType      peCursorType.Value :     IMcGlobalMap.ECursorType
         */
        OnMouseEvent(eEvent : IMcGlobalMap.EMouseEvent, MousePosition : SMcPoint, pbRenderNeeded : any, peCursorType : any) : void;
    }
    namespace IMcGlobalMap {
        enum EMouseEvent {
            EME_BUTTON_PRESSED, 
            EME_BUTTON_RELEASED, 
            EME_MOUSE_MOVED_BUTTON_DOWN, 
            EME_MOUSE_MOVED_BUTTON_UP
        }
        enum ECursorType {
            ECT_DEFAULT_CURSOR, 
            ECT_DRAG_CURSOR, 
            ECT_RESIZE_CURSOR
        }
    }

    interface IMcHeatMapLayer extends IMcMapLayer {
        /**
         * @param pdMin        pdMin.Value :     number
         * @param pdMax        pdMax.Value :     number
         */
        GetMinMaxValues(fScale : number, pdMin : any, pdMax : any) : void;
        SetColorTable(aColors : SMcBColor[]) : void;
        GetColorTable() : SMcBColor[];
    }

    interface IMcNativeHeatMapLayer extends IMcHeatMapLayer {
        /**
         * @param puFirstLowerQualityLevel          puFirstLowerQualityLevel.Value :    number
         * @param pbThereAreMissingFiles            pbThereAreMissingFiles.Value :      boolean
         * @param puNumLevelsToIgnore               puNumLevelsToIgnore.Value :         number
         * @param pbEnhanceBorderOverlap            pbEnhanceBorderOverlap.Value :      boolean
         */
        GetCreateParams(puFirstLowerQualityLevel : any, pbThereAreMissingFiles : any, puNumLevelsToIgnore : any, pbEnhanceBorderOverlap : any) : void;
    }
    namespace IMcNativeHeatMapLayer {
        function Create(strDirectory : string, uFirstLowerQualityLevel? : number, bThereAreMissingFiles? : boolean, uNumLevelsToIgnore? : number, 
            pReadCallback? : IMcMapLayer.IReadCallback, bEnhanceBorderOverlap? : boolean, pLocalCacheLayerParams? : IMcMapLayer.SLocalCacheLayerParams) : IMcNativeHeatMapLayer;
        var LAYER_TYPE : number;
    }

    interface IMcHeatMapViewport extends IMcMapViewport {
        UpdateHeatMapPoints(bRemoveAllPrevPoints : boolean, aPoints : IMcHeatMapViewport.SHeatMapPoint[], eItemType : boolean,  uItemInfluenceRadius : number, bIsRadiusInPixels : boolean) : void;
        GetHeatMapPixelNormalizedValue(WorldPos : SMcVector3D) : number;
        GetHeatMapPixelSumValue(WorldPos : SMcVector3D) : number;
        GetHeatMapPixelCountValue(WorldPos : SMcVector3D) : number;
        GetHeatMapNormalizedBuffer() : Uint8Array;
        GetHeatMapSumBuffer() : Float32Array;
        GetHeatMapCountBuffer() : Float32Array;
        /**
         * @param pdMinValue        pdMinValue.Value :     number
         * @param pdMaxValue        pdMaxValue.Value :     number
         */
        GetHeatMapUnNormalizedMinMaxValue(pdMinValue : any, pdMaxValue : any) : void;
        IsHeatMapAverageCalculatedPerPoint() : boolean;
        IsHeatMapPictureShown() : boolean;
        SetHeatMapMinThresholdValues(dMinValThreshold : number, dMinValToUse : number) : void;
        /**
         * @param pdMinValThreshold        pdMinValThreshold.Value :     number
         * @param pdMinValToUse            pdMinValToUse.Value :         number
         */
        GetHeatMapMinThresholdValues(pdMinValThreshold : any, pdMinValToUse : any) : void;
        SetHeatMapMaxThresholdValues(dMaxValThreshold : number, dMaxValToUse : number) : void;
         /**
         * @param pdMaxValThreshold        pdMaxValThreshold.Value :     number
         * @param pdMaxValToUse            pdMaxValToUse.Value :         number
         */
        GetHeatMapMaxThresholdValues(pdMaxValThreshold : any, pdMaxValToUse : any) : void;
        SetHeatMapDrawPriority(nDrawPriority : number) : void;
        GetHeatMapDrawPriority() : number;
        SetHeatMapTransparency(byTransparency : number) : void;
        GetHeatMapTransparency() : number;
        SetHeatMapVisibility(bVisible : boolean) : void;
        GetHeatMapVisibility() : boolean;
    }
    namespace IMcHeatMapViewport {  
        /**
         * @param pCamera        pCamera.Value :     IMcMapCamera
         */
        function CreateHeatMap(pCamera : any, CreateData : IMcMapViewport.SCreateData,
		apTerrains : IMcMapTerrain[], bCalcAveragePerPoint : boolean, bShowHeatMapPicture : boolean) : IMcHeatMapViewport;

        class SHeatMapPoint {
            constructor();
            aLocations : SMcVector2D[];
            uIntensity : number;
        }
        var INTERFACE_TYPE : number;
    } 

    interface IMcMapGrid extends IMcBase {
        IsUsingBasicItemPropertiesOnly() : boolean;
        SetGridRegions(aGridRegions : IMcMapGrid.SGridRegion[]) : void;
        GetGridRegions() : IMcMapGrid.SGridRegion[];
	    SetScaleSteps(aScaleSteps : IMcMapGrid.SScaleStep[]) : void;
	    GetScaleSteps() : IMcMapGrid.SScaleStep[];
    }
    namespace IMcMapGrid {
        function Create(aGridRegions : IMcMapGrid.SGridRegion[], aScaleSteps : IMcMapGrid.SScaleStep[], bUseBasicItemPropertiesOnly? : boolean) : IMcMapGrid;

        enum EAngleFormat {
            EAF_DECIMAL_DEG,
            EAF_DEG_MIN_SEC,
            EAF_DEG_MIN
        }
        class SGridRegion {
            constructor();
            pCoordinateSystem : IMcGridCoordinateSystem;
            GeoLimit : SMcBox;
            pGridLine : IMcLineItem;
            pGridText : IMcTextItem;
            uFirstScaleStepIndex : number;
            uLastScaleStepIndex : number;
        }
        class SScaleStep {
            constructor();
            fMaxScale : number;
            NextLineGap : SMcVector2D;
            uNumOfLinesBetweenDifferentTextX : number;
            uNumOfLinesBetweenDifferentTextY : number;
            uNumOfLinesBetweenSameTextX : number;
            uNumOfLinesBetweenSameTextY : number;
            uNumMetricDigitsToTruncate : number;
            eAngleValuesFormat : EAngleFormat;
        }
    }

    interface IMcMapHeightLines extends IMcBase {
        	SetScaleSteps( aScaleSteps : IMcMapHeightLines.SScaleStep[]) : void;
            GetScaleSteps() : IMcMapHeightLines.SScaleStep[];
            SetColorInterpolationMode(bEnabled : boolean, fMinHeight? : number, fMaxHeight? : number) : void;
            /**
             * @param pfMinHeight        pfMinHeight.Value :     number
             * @param pfMaxHeight        pfMaxHeight.Value :     number
             */
            GetColorInterpolationMode(pbEnabled : boolean, pfMinHeight? : number, pfMaxHeight? : number) : void;
            SetLineWidth(fWidth : number) : void;
	        GetLineWidth() : number;
    }
    namespace IMcMapHeightLines {
        function Create(aScaleSteps : IMcMapHeightLines.SScaleStep[], fLineWidth? : number) : IMcMapHeightLines;

        class SScaleStep {
            constructor();
            fMaxScale : number;
            fLineHeightGap : number;
            aColors : SMcBColor[];
        }
    }

    interface IMcMapWaterElement extends IMcBase {
        SetGeometricParams(aBoundingPolygonPoints : SMcVector3D[], dAbsoluteHeight : number) : void;
        /**
        * @param paBoundingPolygonPoints       array created by the user, allocated and filled by MapCore
        * @param pdAbsoluteHeight              pdAbsoluteHeight.Value : number
        */
        GetGeometricParams(paBoundingPolygonPoints : SMcVector3D[], pdAbsoluteHeight : any) : void;
        SetPhysicalParams(PhysicalParams : IMcMapWaterElement.SPhysicalParams) : void;
        GetPhysicalParams() : IMcMapWaterElement.SPhysicalParams;
    }    
    namespace IMcMapWaterElement {
        function Create(strConfigFile : string, aBoundingPolygonPoints : SMcVector3D[]) : IMcMapWaterElement;

        class SPhysicalParams {
            constructor();
            dWaveStrength : number;
            uWaveComplexity : number;
        }
    }

    interface IMcSectionMapViewport extends IMcMapViewport {
        SetSectionRoutePoints(aSectionRoutePoints : SMcVector3D[], aSectionHeightPoints? : SMcVector3D[]) : void;
        /**
        * @param aSectionRoutePoints       array created by the user, allocated and filled by MapCore
        * @param aSectionHeightPoints      array created by the user, allocated and filled by MapCore
        */
        GetSectionRoutePoints(aSectionRoutePoints : SMcVector3D[], aSectionHeightPoints? : SMcVector3D[]) : void;
        SetAxesRatio(fYXRatio : number) : void;
        GetAxesRatio() : number;
        SetSectionPolygonItem(pPolygonItem : IMcPolygonItem) : void;
        GetSectionPolygonItem() : IMcPolygonItem;
        SectionToWorld(SectionPoint : SMcVector3D) : SMcVector3D;
        WorldToSection(WorldPoint : SMcVector3D) : number;
        /**
         * @param pdY            pdY.Value :         number
         * @param pdSlope        pdSlope.Value :     number
         */
        GetSectionHeightAtPoint(dX : number, pdY : any, pdSlope? : any) : void;
        /**
         * @param pdMinY         pdMinY.Value :         number
         * @param pdMaxY         pdMaxY.Value :         number
         */
        GetHeightLimits(dMinX : number, dMaxX : number, pdMinY : any, pdMaxY : any) : void;
    }
    namespace IMcSectionMapViewport {
        function CreateSection(pCamera : IMcMapCamera, CreateData : IMcMapViewport.SCreateData,
            apTerrains : IMcMapTerrain[], aSectionRoutePoints : SMcVector3D[], aSectionHeightPoints? : SMcVector3D[]) : IMcSectionMapViewport;
        var INTERFACE_TYPE: number;
    }

    interface IMcMapTerrain extends IMcBase {
        SetCoordinateSystem(pCoordinateSystem : IMcGridCoordinateSystem) : void;
        GetCoordinateSystem() : IMcGridCoordinateSystem;
        GetBoundingBox() : SMcBox;
        SetVisibility(bVisibility : boolean,pMapViewport? :  IMcMapViewport) : void;
        GetVisibility(pMapViewport? : IMcMapViewport) : boolean;
        SetID(uID : number) : void;
        GetID() : number;
        SetUserData(pUserData : IMcUserData) : void;
        GetUserData() : IMcUserData;
        GetDisplayItemsAttachedTo3DModelWithoutDtm() : boolean;
        AddLayer(pLayer : IMcMapLayer) : void;
        RemoveLayer(pLayer : IMcMapLayer) : void;
        SetLayerParams(pLayer : IMcMapLayer, Params : IMcMapTerrain.SLayerParams) : void;
        GetLayerParams(pLayer : IMcMapLayer) : IMcMapTerrain.SLayerParams;
        GetLayerByID(uID : number) : IMcMapLayer;
        GetLayers() : IMcMapLayer[];
        GetDtmLayer() : IMcDtmMapLayer;
        Save(strBaseDirectory? : string, bSaveUserData? : boolean) : Uint8Array;
    }
    namespace IMcMapTerrain {
        function Create(pCoordinateSystem : IMcGridCoordinateSystem, apLayers : IMcMapLayer[], pTilingScheme? : IMcMapLayer.STilingScheme, pBoundingRect? : SMcBox,
            bDisplayItemsAttachedToStaticObjectsWithoutDtm? : boolean): IMcMapTerrain;
        function LoadFromFile(strFileName : string, strBaseDirectory? : string, pUserDataFactory? : IMcUserDataFactory,
            pReadCallbackFactory? : IMcMapLayer.IReadCallbackFactory) : IMcMapTerrain;
        function Load(abMemoryBuffer : Uint8Array, strBaseDirectory? : string, pUserDataFactory? : IMcUserDataFactory, 
            pReadCallbackFactory? : IMcMapLayer.IReadCallbackFactory) : IMcMapTerrain;
        class SLayerParams {
            constructor();
            constructor(fMinScale : number, fMaxScale : number, nDrawPriority : number, byTransparency : number, bVisibility : boolean, bNearestPixelMagFilter? : boolean);
            fMinScale : number;
            fMaxScale : number;
            nDrawPriority : number;
            byTransparency : number;
            bVisibility : boolean;
            bNearestPixelMagFilter: boolean;
        }
    }

    interface IMcMapDevice extends IMcBase {}
    namespace IMcMapDevice {
        function Create(params : IMcMapDevice.SInitParams) : IMcMapDevice;
        function FetchOptionalComponents(uOptionalComponentsBitField : number) : Promise<void>;
        function GetVersion() : string;
        function PerformPendingCalculations(uTimeout? : number) : boolean;
        function LoadResourceGroup(strGroupName : string, astrResourceLocations : string[], eResourceLocationType? : IMcMapDevice.EResourceLocationType) : void;
        function UnloadResourceGroup(strGroupName : string) : void;
        function GetWebServerLayers(strServerURL : string, eWebMapServiceType : IMcMapLayer.EWebMapServiceType, aRequestParams : SMcKeyStringValue[], pAsyncOperationCallback : IMcMapLayer.IAsyncOperationCallback) : void;
        function Get3DModelSmartRealityData(strSmartRealityServerURL : string, eSmartRealityQuery : IMcMapDevice.ESmartRealityQuery, uObjectID : SMcVariantID, pAsyncOperationCallback : IMcMapLayer.IAsyncOperationCallback) : void;
        function GetGpuInfo() : IMcMapDevice.SGpuInfo;
        function LoadFilesListAsync(strFilesServerURL : string, strFilesListPath : string, pCallback : IMcMapDevice.ICallback) : void;
        function UnloadFilesListSync(strFilesListPath : string) : void;
        function LoadSingleFileAsync(strFilesServerURL : string, strFilePath : string, pCallback : IMcMapDevice.ICallback) : void;
        function UnloadSingleFileSync(strFilePath : string) : void;
        function GetMemorySize() : BigInt;
	    function SetWebWorkersHeapLimits(uSinleWorkerHeapMaxSize : BigInt, uTotalHeapMaxSize : BigInt) : void;
        function GetMaxMemoryUsage() : BigInt;
        function GetHeapSize(bIncludingWebWorkers? : boolean) : BigInt;
        function SetHeapSize(uSize : BigInt) : void;
        function MapNodeJsDirectory(strPhysicalDirectory : string, strVirtualDirectory : string) : void;
        function UnMapNodeJsDirectory(strVirtualDirectory : string) : void;
        function CreateFileSystemDirectory(strDirectory : string) : void;
        function DeleteFileSystemEmptyDirectory(strDirectory : string) : void;
        function GetFileSystemDirectoryContents(strDirectory : string) : string[] | null;
        function CreateFileSystemFile(strFileFullName : string, FileContents : Uint8Array | string) : void;
        function DeleteFileSystemFile(strFileFullName : string) : void;
        function GetFileSystemFileContents(strFileFullName : string, bString? : boolean) : Uint8Array | string | null;
        function DownloadBufferAsFile(Buffer : Uint8Array | ArrayBuffer, strDownloadFileName : string) : void;
        function DownloadFileSystemFile(strFileFullName : string, strDownloadFileName? : string) : boolean;
        function DoesFileSystemPathExist(strPathFullName : string) : boolean;

        enum EOptionalComponentFlags {
            EOCF_NONE,
            EOCF_SYMBOLOGY_APP6D,
            EOCF_SYMBOLOGY_2525C,
            EOCF_ALL
        }
        enum ETerrainObjectsQuality {
            ETOQ_HIGH,
            ETOQ_MEDIUM,
            ETOQ_LOW,
            ETOQ_EXTRA_LOW
        }
        enum ELoggingLevel {
            ELL_NONE,
            ELL_LOW,
            ELL_MEDIUM,
            ELL_HIGH
        }
        enum EAntiAliasingLevel {
            EAAL_NONE,
            EAAL_1,
            EAAL_2,
            EAAL_3,
            EAAL_4,
            EAAL_5,
            EAAL_6,
            EAAL_7,
            EAAL_8,
            EAAL_8_QUALITY,
            EAAL_9,
            EAAL_9_QUALITY,
            EAAL_10,
            EAAL_10_QUALITY,
            EAAL_11,
            EAAL_11_QUALITY,
            EAAL_12,
            EAAL_12_QUALITY,
            EAAL_13,
            EAAL_13_QUALITY,
            EAAL_14,
            EAAL_14_QUALITY,
            EAAL_15,
            EAAL_15_QUALITY,
            EAAL_16,
            EAAL_16_QUALITY
        }
        enum EStaticObjectsVisibilityQueryPrecision {
            ESOVQP_HIGH,
            ESOVQP_MEDIUM,
            ESOVQP_LOW,
            ESOVQP_EXTRA_LOW
        }
        enum ERenderingSystem {
            ERS_AUTO_SELECT, 
            ERS_NONE
        }
        enum EResourceLocationType {
            ERLT_FOLDER, 
            ERLT_FOLDER_RECURSIVE, 
            ERLT_ZIP_FILE, 
            ERLT_ZIP_FILE_RECURSIVE
        }
        enum EGpuVendor {
            EGV_UNKNOWN,
            EGV_NVIDIA,
            EGV_AMD,
            EGV_INTEL,
            EGV_IMAGINATION_TECHNOLOGIES,
            EGV_APPLE,
            EGV_NOKIA,
            EGV_MS_SOFTWARE,
            EGV_MS_WARP,
            EGV_ARM,
            EGV_QUALCOMM,
            EGV_MOZILLA,
            EGV_WEBKIT
        }
        enum ESmartRealityQuery {
            ESRQ_BUILDING_HISTORY,
            ESRQ_BUILDING_DATA_BY_ID
        }
        class SInitParams {
            constructor();
            uNumBackgroundThreads : number;
            eLoggingLevel : IMcMapDevice.ELoggingLevel;
            strConfigFilesDirectory : string;
			strPrefixForPathsInResourceFile : string;
            eViewportAntiAliasingLevel : IMcMapDevice.EAntiAliasingLevel;
            eTerrainObjectsAntiAliasingLevel : IMcMapDevice.EAntiAliasingLevel;
            eTerrainObjectsQuality : IMcMapDevice.ETerrainObjectsQuality;
            eStaticObjectsVisibilityQueryPrecision : IMcMapDevice.EStaticObjectsVisibilityQueryPrecision;
            uDtmVisualizationPrecision : number;
            fObjectsBatchGrowthRatio : number;
            uObjectsTexturesAtlasSize : number;
            bObjectsTexturesAtlas16bit : boolean;
            bDisableDepthBuffer : boolean;
            eRenderingSystem : IMcMapDevice.ERenderingSystem;
            bIgnoreRasterLayerMipmaps : boolean;
            bFullScreen : boolean;
            uNumTerrainTileRenderTargets : number;
            bPreferUseTerrainTileRenderTargets : boolean; 
            uObjectsBatchInitialNumVertices : number;
            uObjectsBatchInitialNumIndices : number; 
            bEnableObjectsBatchEnlarging : boolean; 
            bAlignScreenSizeObjects : boolean;
            uWebRequestRetryCount : number;
            uAsyncQueryTilesMaxActiveWebRequests : number;
        }
        class SGpuInfo {
            constructor();
            eVendor : EGpuVendor;
            strVendorName : string;
            strDeviceName : string;
        }
        interface ICallback { 
            /** Mandatory */
            OnFilesLoaded(bFilesListSuccess : boolean, bFilesSuccess : boolean) : void;
        }
        namespace ICallback {
            function extend(strName : string, Class : any) : ICallback;
        }
    }

    interface IMcMapEnvironment extends IMcBase {
            EnableComponents(uComponentsBitField : number) : void;
	        DisableComponents(uComponentsBitField : number) : void;
            GetEnabledComponents() : number;
	        ShowComponents(uComponentsBitField : number) : void;
            HideComponents(uComponentsBitField : number) : void;
            GetVisibleComponents() : number;
            SetSkyParams(eType : IMcMapEnvironment.ESkyType, strMaterial? : string,	BackgroundColor? : SMcFColor) : void;
            /**
            * @param peType             peType.Value            :  IMcMapEnvironment.ESkyType
            * @param pstrMaterial       pstrMaterial.Value      :  string
            * @param pBackgroundColor   pBackgroundColor.Value  :  SMcFColor
            */
            GetSkyParams(peType : any, pstrMaterial : any, pBackgroundColor : any) : void;
            SetSunParams(eType : IMcMapEnvironment.ESunType) : void;
            GetSunParams() : IMcMapEnvironment.ESunType;
            SetFogParams(eType : IMcMapEnvironment.EFogType, Color? : SMcFColor, fExpDensity? : number,fLinearStart? : number,fLinearEnd? : number) : void;
            /**
            * @param peType             peType.Value        :  IMcMapEnvironment.EFogType
            * @param pColor             pColor.Value        :  SMcFColor
            * @param pfExpDensity       pfExpDensity.Value  :  number
            * @param pfLinearStart      pfLinearStart.Value :  number
            * @param pfLinearEnd        pfLinearEnd.Value   :  number
            */
            GetFogParams(peType : any,pColor : any,	pfExpDensity : any,pfLinearStart : any, pfLinearEnd : any) : void;
            SetCloudsParams(fCloudCover? : any, CloudSpeed? : SMcFVector2D) : void;
            /**
            * @param pfCloudCover       pfCloudCover.Value  :  number
            * @param pCloudSpeed        pCloudSpeed.Value   :  SMcFVector2D
            */
	        GetCloudsParams(pfCloudCover : any, pCloudSpeed : any) : void;
            SetRainParams(fRainSpeed? : number, RainDirection? : SMcFVector3D, fRainAngleDegrees? :any, fRainIntensity? : number) : void;
            /**
            * @param pfRainSpeed           pfRainSpeed.Value  :           number
            * @param pRainDirection        pRainDirection.Value   :       SMcFVector2D
            * @param pfRainAngleDegrees    pfRainAngleDegrees.Value   :   SMcFVector2D
            * @param pfRainIntensity       pfRainIntensity.Value   :      SMcFVector2D
            */
            GetRainParams(pfRainSpeed : any, pRainDirection : any, pfRainAngleDegrees : any, pfRainIntensity : any) : void;
	        SetSnowParams(fSnowSpeed? : number, SnowDirection? : SMcFVector3D, fSnowAngleDegrees? : number, fSnowIntensity? : number) : void;
            /**
            * @param pfSnowSpeed           pfSnowSpeed.Value  :           number
            * @param pSnowDirection        pSnowDirection.Value   :       SMcFVector3D
            * @param pfSnowAngleDegrees    pfSnowAngleDegrees.Value   :   number
            * @param pfSnowIntensity       pfSnowIntensity.Value   :      number
            */
            GetSnowParams(pfSnowSpeed : any, pSnowDirection : any, pfSnowAngleDegrees : any, pfSnowIntensity : any) : void;
            SetDefaultAmbientLight(Color? : SMcFColor) : void;
            GetDefaultAmbientLight() : SMcFColor;
            SetAbsoluteTime(Time : Date) : void;
            GetAbsoluteTime() : Date;
            IncrementTime(nSeconds : number) : void;
            SetTimeAutoUpdate(bEnabled : boolean) : void;
            GetTimeAutoUpdate() : boolean;
	        SetTimeAutoUpdateFactor(fFactor :number) : void;
            GetTimeAutoUpdateFactor() : number;
    }
    namespace IMcMapEnvironment {
        function Create(pViewport : IMcMapViewport) : IMcMapEnvironment;
        enum EComponentType {
            ECT_SKY, 
            ECT_STARS, 
            ECT_SUN, 
            ECT_FOG, 
            ECT_CLOUDS,
            ECT_RAIN, 
            ECT_SNOW, 
            ECT_NONE, 
            ECT_ALL
        }
        enum ESkyType {
            EST_BACKGROUND, 
            EST_SKYBOX, 
            EST_SKYDOME, 
            EST_ANIMATED_SKY
        }
        enum ESunType {
            EST_LENS_FLARE, 
            EST_ANIMATED_SUN
        }
        enum EFogType {
            EFT_LINEAR, 
            EFT_EXPONENTIAL, 
            EFT_EXPONENTIAL_SQUARED, 
            EFT_ADVANCED_FOG
        }
    }

interface IMcPathFinder extends IMcDestroyable {
	UpdateTables() : void;
    /**
     * @param paLocationPoints          array created by the user, allocated and filled by MapCore
     * @param aEdgeIds                  aEdgeIds.Value : Uint32Array
     */
    FindShortestPath(SourcePoint : SMcVector3D, TargetPoint : SMcVector3D, strCostField : string, strReverseCostField : string, bConsiderObstacles : boolean, paLocationPoints : SMcVector3D[], aEdgeIds : any) : void;
}
namespace IMcPathFinder {
    function Create(strVectorData : string, strTableName : string, strObstaclesTables : string[], uPointTolerance : number,	strCostFields : string[]) : IMcPathFinder;
}
    
/////////////////////////////////////////////////////////////////////////////
// Overlay Management

    interface IMcFont extends IMcBase {
        	GetIsStaticFont() : boolean;
	        GetCharactersRanges() : IMcFont.SCharactersRange[];
	        GetMaxNumCharsInDynamicAtlas() : number;
            GetTextOutlineWidth() : number;
            /**
             * @param aSpecialChars             array created by the user, allocated and filled by MapCore
             * @param pbUseSpecialCharsColors   pbUseSpecialCharsColors.Value : boolean
             */
            GetSpecialChars(aSpecialChars : IMcFont.SSpecialChar[], pbUseSpecialCharsColors : any) : void;
	        IsCreatedWithUseExisting() : boolean;
        	GetEffectiveCharacterSpacing() : number;
	        GetEffectiveNumAntialiasingAlphaLevels() : number;
    }
    namespace IMcFont {
        function SetCharacterSpacing(uSpacing : number) : void;
        function GetCharacterSpacing() : number;
	    function SetNumAntialiasingAlphaLevels(uNumAlphaLevels : number) : void;
	    function GetNumAntialiasingAlphaLevels() : number;

        enum ESpecialCharSizeMeaning
	    {
	    	ESCSM_FACTOR_OF_FONT_HEIGHT,
	    	ESCSM_FACTORS_OF_IMAGE_SIZE,
	    	ESCSM_ABSOLUTE_SIZE
	    }

        class SCharactersRange {
            nFrom : number;
            nTo : number;
        }

        class SSpecialChar {
            pImage : IMcImage;
            fCharWidthParam : number;
            fCharHeightParam : number;
            nVerticalOffset : number;
            nLeftSpacing : number;
            nRightSpacing : number;
            uCharCode : number;
            eSizeParamMeaning : IMcFont.ESpecialCharSizeMeaning;
        }
    }

    interface IMcLogFont extends IMcFont {
        	SetLogFont(LogFont : SMcVariantLogFont) : void;
	        GetLogFont() : SMcVariantLogFont;
    }
    namespace IMcLogFont {
        function SetLogFontToTtfFileMap(aLogFonts : IMcLogFont.SLogFontToTtfFile) : void;
        function GetLogFontToTtfFileMap() : IMcLogFont.SLogFontToTtfFile;
        /**
         * @param pbExistingUsed       pbExistingUsed.Value : boolean
         */
        function Create(LogFont : SMcVariantLogFont, bStaticFont? : boolean, aCharactersRanges? : IMcFont.SCharactersRange[],
            uMaxNumCharsInDynamicAtlas? : number, bUseExisting? : boolean, pbExistingUsed? : any, uTextOutlineWidth? : number, 
            aSpecialChars? : IMcFont.SSpecialChar[], bUseSpecialCharsColors? : boolean) : IMcLogFont;

        class SLogFontToTtfFile {
            constructor();
            LogFont : SMcVariantLogFont;
            strTtfFileFullPathName : string;
        }
    }

    interface IMcFileFont extends IMcFont {
        SetFontFileAndHeight(FontFile : SMcFileSource, nFontHeight : number) : void;
        /**
         * @param pFontFile       pFontFile.Value : SMcFileSource
         * @param pnFontHeight    pnFontHeight.Value : number
         */
         GetFontFileAndHeight(pFontFile : any, pnFontHeight : any) : void;
    }
    namespace IMcFileFont {
        /**
         * @param pbExistingUsed       pbExistingUsed.Value  :  boolean
         */
        function Create(FontFile : SMcFileSource, nFontHeight : number, bStaticFont? : boolean,	aCharactersRanges? : IMcFont.SCharactersRange[],
            uMaxNumCharsInDynamicAtlas? : number, bUseExisting? : boolean, pbExistingUsed? : any, uTextOutlineWidth? : number,
            aSpecialChars? : IMcFont.SSpecialChar[], bUseSpecialCharsColors? : boolean) : IMcFileFont;
    }

    interface IMcTexture extends IMcBase {
        GetTextureType() : number;
        /**
         * @param puWidth       puWidth.Value  :  number
         * @param puHeight      puHeight.Value :  number
         */
        GetSize(puWidth : any, puHeight : any) : void;
        /**
         * @param puWidth       puWidth.Value  :  number
         * @param puHeight      puHeight.Value :  number
         */
        GetSourceSize(puWidth : any, puHeight : any) : void;
        /**
         * @param pTransparentColor       pTransparentColor.Value  :  SMcBColor
         */
        GetTransparentColor(pTransparentColor : any) : boolean;
        GetColorSubstitutions() : IMcTexture.SColorSubstitution[];
        IsFillPattern() : boolean;
        IsTransparentMarginIgnored() : boolean;
        IsCreatedWithUseExisting() : boolean;
        GetName() : string;
    }
    namespace IMcTexture {
        enum EPixelFormat {
            EPF_UNKNOWN,
            EPF_L8,
            EPF_L16,
            EPF_A8,
            EPF_BYTE_LA,
            EPF_R5G6B5,
            EPF_B5G6R5,
            EPF_A4R4G4B4,
            EPF_A1R5G5B5,
            EPF_R8G8B8,
            EPF_B8G8R8,
            EPF_A8R8G8B8,
            EPF_A8B8G8R8,
            EPF_B8G8R8A8,
            EPF_A2R10G10B10,
            EPF_A2B10G10R10,
            EPF_DXT1,
            EPF_DXT2,
            EPF_DXT3,
            EPF_DXT4,
            EPF_DXT5,
            EPF_FLOAT16_RGB,
            EPF_FLOAT16_RGBA,
            EPF_FLOAT32_RGB,
            EPF_FLOAT32_RGBA,
            EPF_X8R8G8B8,
            EPF_X8B8G8R8,
            EPF_R8G8B8A8,
            EPF_DEPTH,
            EPF_SHORT_RGBA,
            EPF_R3G3B2,
            EPF_FLOAT16_R,
            EPF_FLOAT32_R,
            EPF_SHORT_GR,
            EPF_FLOAT16_GR,
            EPF_FLOAT32_GR,
            EPF_SHORT_RGB,
            EPF_COUNT
        }
        enum EUsage {
            EU_STATIC, 
            EU_STATIC_WRITE_ONLY, 
            EU_STATIC_WRITE_ONLY_IN_ATLAS, 
            EU_DYNAMIC, 
            EU_DYNAMIC_WRITE_ONLY, 
            EU_DYNAMIC_WRITE_ONLY_DISCARDABLE, 
            EU_RENDERTARGET
        }

        class SColorSubstitution {
            constructor(ColorToSubstitute? : SMcBColor, SubstituteColor? : SMcBColor);
            ColorToSubstitute : SMcBColor;
            SubstituteColor : SMcBColor;
        }

        function GetPixelFormatByteCount(ePixelFormat : IMcTexture.EPixelFormat) : number;
    }

    interface IMcMemoryBufferTexture extends IMcTexture {
        UpdateFromMemoryBuffer(uBufferWidth : number, uBufferHeight : number, 
		    eBufferPixelFormat : IMcTexture.EPixelFormat, uBufferRowPitch : number, pBuffer : Uint8Array) : void;
        UpdateFromColorData(aColors : SMcBColor[], afColorPositions? : Float32Array, bColorInterpolation? : boolean, bColorColumns? : boolean) : void;
        GetToMemoryBuffer(uBufferWidth : number, uBufferHeight : number, eBufferPixelFormat : IMcTexture.EPixelFormat, uBufferRowPitch : number) :Uint8Array;
        GetPixelFormat() : IMcTexture.EPixelFormat;
        GetSourcePixelFormat() : IMcTexture.EPixelFormat;
        /**
        * @param paColors    			    array created by the user, allocated and filled by MapCore
		* @param pafColorPositions          pafColorPositions.Value : Float32Array
        * @param pbColorInterpolation       pbColorInterpolation.Value  :  boolean
        * @param pbColorColumns             pbColorColumns.Value  :  boolean
		*/
        GetColorData(paColors : SMcBColor[], pafColorPositions : any, pbColorInterpolation : any, pbColorColumns : any) : void;
    }
    namespace IMcMemoryBufferTexture {
        function Create(uWidth : number, uHeight : number, ePixelFormat? : IMcTexture.EPixelFormat,
		    eUsage? : IMcTexture.EUsage, bAutoMipmap? : boolean, pBuffer? : Uint8Array,
		    uBufferRowPitch? : number, strUniqueName? : string) : IMcMemoryBufferTexture;
        function Create(uWidth : number, uHeight : number, aColors : SMcBColor[], afColorPositions? : Float32Array, 
            bColorInterpolation? : boolean, bColorColumns? : boolean, ePixelFormat? : IMcTexture.EPixelFormat,
		    eUsage? : IMcTexture.EUsage, bAutoMipmap? : boolean) : IMcMemoryBufferTexture;
        var TEXTURE_TYPE: number;
    }

    interface IMcImageFileTexture extends IMcTexture {
        SetImageFile(ImageSource : SMcFileSource, pTransparentColor? : SMcBColor, 
		    aColorSubstitutions? : IMcTexture.SColorSubstitution[]) : void;
        GetImageFile() : SMcFileSource;
    }
    namespace IMcImageFileTexture {
        /**
         * @param pbExistingUsed       pbExistingUsed.Value : boolean
         */
        function Create(ImageSource : SMcFileSource, bFillPattern : boolean, bIgnoreTransparentMargin? : boolean, 
		    pTransparentColor? : SMcBColor, aColorSubstitutions? : IMcTexture.SColorSubstitution[], bUseExisting? : boolean, pbExistingUsed? : any) : IMcImageFileTexture;
        var TEXTURE_TYPE: number;
    }

    interface IMcIconHandleTexture extends IMcTexture {
        SetIcon(hIcon : HTMLImageElement, pTransparentColor? : SMcBColor, aColorSubstitutions? : IMcTexture.SColorSubstitution[], bTakeOwnership? : boolean) : void;
        GetIcon() : HTMLImageElement;
    }
     namespace IMcIconHandleTexture {
         /**
         * @param pbExistingUsed       pbExistingUsed.Value : boolean
         */
        function Create(hIcon : HTMLImageElement, bFillPattern : boolean, bIgnoreTransparentMargin? : boolean, pTransparentColor? : SMcBColor, 
            aColorSubstitutions? : IMcTexture.SColorSubstitution[], bTakeOwnership? : boolean, bUseExisting? : boolean, pbExistingUsed? : any) : IMcIconHandleTexture;
         var TEXTURE_TYPE: number;
     }

     interface IMcBitmapHandleTexture extends IMcTexture {
        SetBitmap(hBitmap : HTMLCanvasElement | HTMLImageElement, pTransparentColor? : SMcBColor, aColorSubstitutions? : IMcTexture.SColorSubstitution[], bTakeOwnership? : boolean) : void;
        GetBitmap() : HTMLCanvasElement | HTMLImageElement;
     }
      namespace IMcBitmapHandleTexture {
         /**
         * @param pbExistingUsed       pbExistingUsed.Value : boolean
         */
        function Create(hBitmap : HTMLCanvasElement | HTMLImageElement, bFillPattern : boolean, bIgnoreTransparentMargin? : boolean, pTransparentColor? : SMcBColor, 
            aColorSubstitutions? : IMcTexture.SColorSubstitution[], bTakeOwnership? : boolean, bUseExisting? : boolean, pbExistingUsed? : any) : IMcBitmapHandleTexture;
          var TEXTURE_TYPE: number;
     }

     interface IMcVideoTexture extends IMcTexture {
        SetState(eState : IMcVideoTexture.EState) : void;
        GetState() : IMcVideoTexture.EState;
        SetFrameRateForRenderBasedUpdate(fFramesPerSecond : number) : void;
        GetFrameRateForRenderBasedUpdate() : number;
        SetManualUpdateMethod(bManual : boolean) : void;
        GetManualUpdateMethod() : boolean;
        UpdateFrame() : void;
        GetToMemoryBuffer(uBufferWidth : number, uBufferHeight : number, eBufferPixelFormat : IMcTexture.EPixelFormat,  uBufferRowPitch : number) : Uint8Array;
         /**
         * @param puBufferWidth       puBufferWidth.Value : number
         * @param puBufferHeight      puBufferHeight.Value : number
         * @param peBufferPixelFormat peBufferPixelFormat.Value : IMcTexture.EPixelFormat
         * @param puBufferRowPitch    puBufferRowPitch.Value : number
         */
        GetCurrFrameBuffer(puBufferWidth : any, puBufferHeight : any, peBufferPixelFormat : any, puBufferRowPitch : any) : Uint8Array;
    }

    namespace IMcVideoTexture {
        enum EState {
            ES_STOPPED,
            ES_RUNNING,
            ES_PAUSED
        }
    }

    interface IMcHtmlVideoTexture extends IMcVideoTexture {
        GetVideoSource() : string | MediaStream | MediaSource | Blob | File;
    }
    namespace IMcHtmlVideoTexture {
        function Create(VideoSource : string | MediaStream | MediaSource | Blob | File, bPlayInLoop? : boolean, bReadable? : boolean, bWithSound? : boolean) : IMcHtmlVideoTexture;
        var TEXTURE_TYPE: number;
    }

     interface IMcTextureArray extends IMcTexture {
        GetTextures() : IMcTexture[];
     }
      namespace IMcTextureArray {
        function Create(apTextures : IMcTexture[]) : IMcTextureArray;
          var TEXTURE_TYPE: number;
     }

    interface IMcSightPresentationItemParams {
        	ReleaseSightPresentationParameters() : void;
            SetSightPresentationType(eSightPresentationType : IMcSightPresentationItemParams.ESightPresentationType, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightPresentationType(puPropertyID? : any, uObjectStateToServe? : number) : IMcSightPresentationItemParams.ESightPresentationType;
            SetSightObserverPosition(ObserverPosition : SMcVector2D, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObserverPosition(puPropertyID? : any, uObjectStateToServe? : number) : SMcVector2D;
            SetSightObserverHeight(fObserverHeight : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObserverHeight(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetIsSightObserverHeightAbsolute(bIsSightObserverHeightAbsolute : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetIsSightObserverHeightAbsolute(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
            SetSightObserverMinPitch(fMinPitch : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObserverMinPitch(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetSightObserverMaxPitch(pfMaxPitch : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObserverMaxPitch(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetSightObservedHeight(fObservedHeight : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightObservedHeight(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetIsSightObservedHeightAbsolute(bIsSightObservedHeightAbsolute : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetIsSightObservedHeightAbsolute(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
            SetSightColor(eVisibilityType : IMcSpatialQueries.EPointVisibility, Color : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightColor(eVisibilityType : IMcSpatialQueries.EPointVisibility, puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
            SetSightQueryPrecision(eQueryPrecision : IMcSpatialQueries.EQueryPrecision, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightQueryPrecision(puPropertyID? : any, uObjectStateToServe? : number) : IMcSpatialQueries.EPointVisibility;
            SetSightNumEllipseRays(uNumRays : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightNumEllipseRays(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetSightTextureResolution(fTextureResolution : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
            /**
             * @param puPropertyID               puPropertyID.Value         : number
             */
            GetSightTextureResolution(puPropertyID? : any, uObjectStateToServe? : number) : number;
            SetSightNoDTMResult(eNoDTMResult : IMcSpatialQueries.ENoDTMResult) : void;
            GetSightNoDTMResult() : IMcSpatialQueries.ENoDTMResult;
    }   
    namespace IMcSightPresentationItemParams {
        enum ESightPresentationType {
            ESPT_NONE,
            ESPT_CPU,
            ESPT_GPU,
            ESPT_MIXED
        }
    }

    interface IMcSymbolicItem extends IMcObjectSchemeItem {
        Clone(pObject? : IMcObject) : IMcSymbolicItem;
        /**
         * @param peErrorStatus         peErrorStatus.Value : IMcErrors.ECode
         */
        Connect(ParentNodeOrArray : IMcObjectSchemeNode | IMcObjectSchemeNode[], peErrorStatus? : any) : void;
        /**
         * @param paPoints                      array created by the user, allocated and filled by MapCore
         * @param peCoordSystem                 peCoordSystem.Value : EMcPointCoordSystem
         * @param pauOriginalPointsIndices      pauOriginalPointsIndices.Value : Uint32Array
         */
        GetAllCalculatedPoints(pMapViewport : IMcMapViewport , pObject : IMcObject, paPoints : SMcVector3D[], peCoordSystem : any, pauOriginalPointsIndices? : any) : void;
        SetAttachPointType(uParentIndex : number, eType : IMcSymbolicItem.EAttachPointType, uPropertyID? : number) : void;
         /**
          * @param puPropertyID       puPropertyID.Value :  number
          */
        GetAttachPointType(uParentIndex : number, puPropertyID? : any) : IMcSymbolicItem.EAttachPointType ;
        SetBoundingBoxAttachPointType(uParentIndex : number, uBoundingBoxPointBitField : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
          * @param puPropertyID       puPropertyID.Value :  number
          */
        GetBoundingBoxAttachPointType(uParentIndex : number, puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetAttachPointIndex(uParentIndex : number, nPointIndex : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
          * @param puPropertyID       puPropertyID.Value :  number
          */
        GetAttachPointIndex(uParentIndex : number, puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetNumAttachPoints(uParentIndex : number, nNumPoints : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
          * @param puPropertyID      puPropertyID.Value :   number
          */
        GetNumAttachPoints(uParentIndex : number, puPropertyID? : any, uObjectStateToServe?: any) : number;
        SetAttachPointPositionValue(uParentIndex : number, fPositionValue : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID          puPropertyID.Value :   number
         */
        GetAttachPointPositionValue(uParentIndex : number, puPropertyID? : any, uObjectStateToServe? : number) : number;
	    SetOffsetType(eOffsetType : IMcObjectSchemeItem.EGeometryType ) : void;
	    GetOffsetType() : IMcObjectSchemeItem.EGeometryType;
	    SetOffsetOrientation(eOffsetOrientation : IMcSymbolicItem.EOffsetOrientation, uPropertyID? : number, uObjectStateToServe? : number) : void;
	    /**
         * @param puPropertyID               puPropertyID.Value         : number
         */
        GetOffsetOrientation(puPropertyID? : any, uObjectStateToServe? : number) : IMcSymbolicItem.EOffsetOrientation;
	    SetVectorTransformParentIndex(uParentIndex : number) : void;
	    GetVectorTransformParentIndex() : number;
        SetVectorTransformSegment(uSegmentIndexOrType : number,	uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value         : number
         */
        GetVectorTransformSegment(puPropertyID? : any, uObjectStateToServe? : number) : number;
	    SetVectorOffsetCalc(eCalc : IMcSymbolicItem.EVectorOffsetCalc, uPropertyID? : number, uObjectStateToServe? : number) : void;
	    /**
         * @param puPropertyID               puPropertyID.Value         : number
         */
        GetVectorOffsetCalc(puPropertyID? : any, uObjectStateToServe? : number) : IMcSymbolicItem.EVectorOffsetCalc;
        SetCoordinateSystemConversion(eCoordinateSystem : EMcPointCoordSystem, bEnabled? : boolean) : void;
        /**
         * @param peCoordinateSystem        peCoordinateSystem.Value : EMcPointCoordSystem
         * @param pbEnabled                 pbEnabled.Value :          boolean
         */
        GetCoordinateSystemConversion(peCoordinateSystem : any, pbEnabled? : any) : void;
        SetRotationAlignment(eAlignToCoordinateSystem : EMcPointCoordSystem, bAlignYaw? : boolean , bAlignPitch? : boolean, bAlignRoll? : boolean) : void;
        /**
         * @param peAlignToCoordinateSystem        peAlignToCoordinateSystem.Value : EMcPointCoordSystem
         * @param pbAlignYaw                       pbAlignYaw.Value                : boolean
         * @param pbAlignPitch                     pbAlignPitch.Value              : boolean
         * @param pbAlignRoll                      pbAlignRoll.Value               : boolean
         */
        GetRotationAlignment(peAlignToCoordinateSystem : any, pbAlignYaw? : boolean, pbAlignPitch? : boolean, pbAlignRoll? : boolean) : void;
        SetVectorOffsetValue(fVectorOffsetValue : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID         puPropertyID.Value  :      number
         */
        GetVectorOffsetValue(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetOffset(Offset : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID         puPropertyID.Value  :      number
         */
        GetOffset(pOffset : SMcFVector3D, puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector3D;
        SetPointsDuplication(anPointIndicesAndDuplicates : IMcProperty.SArrayPropertyInt, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsDuplication(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertyInt;
        SetPointsDuplicationOffsets(aDuplicationOffsets : IMcProperty.SArrayPropertyFVector3D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsDuplicationOffsets(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertyFVector3D;



        SetVectorRotation(bEnabled : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
	    /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetVectorRotation(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
        SetRotationYaw(fYaw : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetRotationYaw(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRotationPitch(fPitch : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetRotationPitch(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRotationRoll(fRoll : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetRotationRoll(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetSubItemsData(SubItemsData : IMcProperty.SArrayPropertySubItemData, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetSubItemsData(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertySubItemData;
        SetDrawPriorityGroup(eDrawPriorityGroup : IMcSymbolicItem.EDrawPriorityGroup, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID          puPropertyID.Value :  number
         */
	    GetDrawPriorityGroup(puPropertyID? : any, uObjectStateToServe? : number) :number;
	    SetDrawPriority(nPriority : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetDrawPriority(puPropertyID? : any, uObjectStateToServe? : number) : number;
	    SetCoplanar3DPriority(nPriority : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetCoplanar3DPriority(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetTransparency(byTransparency : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID       puPropertyID.Value  :      number
         */
        GetTransparency(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetTextureFiltering(eMinFilter : IMcSymbolicItem.ETextureFilter, eMagFilter : IMcSymbolicItem.ETextureFilter, eMipmapFilter : IMcSymbolicItem.ETextureFilter) : void;
        SetSpecialMaterial(strSpecialMaterial : string, bSpecialMaterialUseItemTexture : boolean) : void;
        /**
         * @param pstrSpecialMaterial                   pstrSpecialMaterial.Value :              string
         * @param pbSpecialMaterialUseItemTexture       pbSpecialMaterialUseItemTexture.Value :  boolean
         */
        GetSpecialMaterial(pstrSpecialMaterial : any, pbSpecialMaterialUseItemTexture : any) : void;
        SetMoveIfBlockedMaxChange(fMaxChange : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID           puPropertyID.Value :   number
         */
        GetMoveIfBlockedMaxChange(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetMoveIfBlockedHeightAboveObstacle(fHeightAboveObstacle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID                 puPropertyID.Value :             number
         */
        GetMoveIfBlockedHeightAboveObstacle(puPropertyID? : any, uObjectStateToServe? : number) : number;

    }
    namespace IMcSymbolicItem {
        enum EAttachPointType {
            EAPT_ALL_POINTS,
            EAPT_NONE,
            EAPT_BOUNDING_BOX_POINT,
            EAPT_INDEX_POINTS,
            EAPT_EXCEPT_INDEX_POINTS,
            EAPT_SEGMENTS_INTERP,
		    EAPT_ALL_SEGMENTS_INTERPS,
            EAPT_FIRST_POINTS,
            EAPT_LAST_POINTS,
            EAPT_MID_POINT,
            EAPT_ALL_MIDDLES,
            EAPT_CENTER_POINT,
		    EAPT_SCREEN_TOP_MOST,
            EAPT_SCREEN_BOTTOM_MOST,
            EAPT_SCREEN_LEFT_MOST,
            EAPT_SCREEN_RIGHT_MOST,
            EAPT_SCREEN_EQUIDISTANT,
            EAPT_INDEX_CALC_POINTS,
            EAPT_POLY_INTERP,
            EAPT_LONGEST_SEGMENT_INTERP,
            EAPT_POLE_OF_INACCESSIBILITY,
            EAPT_NUM
        }
        enum EBoundingRectanglePoint{
            EBRP_TOP_LEFT,      
            EBRP_TOP_MIDDLE,   
            EBRP_TOP_RIGHT,    
            EBRP_MIDDLE_RIGHT, 
            EBRP_BOTTOM_RIGHT,   
            EBRP_BOTTOM_MIDDLE, 
            EBRP_BOTTOM_LEFT,   
            EBRP_MIDDLE_LEFT,    
            EBRP_CENTER         
        }
        enum EBoundingBoxPointFlags {
            EBBPF_NONE, 
            EBBPF_TOP_LEFT, 
            EBBPF_TOP_MIDDLE, 
            EBBPF_TOP_RIGHT, 
            EBBPF_MIDDLE_RIGHT,
            EBBPF_BOTTOM_RIGHT, 
            EBBPF_BOTTOM_MIDDLE, 
            EBBPF_BOTTOM_LEFT, 
            EBBPF_MIDDLE_LEFT, 
            EBBPF_CENTER,
            EBBPF_REVERSED_ORDER, 
            EBBPF_UPPER_PLANE, 
            EBBPF_LOWER_PLANE
        }
        enum EDrawPriorityGroup {
            EDPG_REGULAR,
            EDPG_TOP_MOST,
            EDPG_SCREEN_BACKGROUND,
            EDPG_BOTTOM_MOST,
            EDPG_WORLD_WITH_TERRAIN
        }
        enum EVectorOffsetCalc {
            EVOC_PARALLEL_DISTANCE, EVOC_PARALLEL_RATIO, 
            EVOC_PERPENDICULAR_DISTANCE, 
            EVOC_PERPENDICULAR_RATIO, 
            EVOC_SEGMENT_LENGTH_RATIO_UPWARD, 
            EVOC_PERPENDICULAR_LENGTH_RATIO_UPWARD, 
            EVOC_PERPENDICULAR_RATIO_PARALLEL
        }
        enum EOffsetOrientation {
            EOO_RELATIVE_TO_PARENT_ROTATION,
            EOO_RELATIVE_TO_ITEM_ROTATION,	
            EOO_ABSOLUTE					
        }
        enum ETextureFilter {
            ETF_DEFAULT, 
            ETF_NONE, 
            ETF_POINT, 
            ETF_LINEAR, 
            ETF_ANISOTROPIC				
        }
        class SAttachPointParams {
            constructor();
            eType: IMcSymbolicItem.EAttachPointType;
            nPointIndex : number;
            nNumPoints : number;
            fPositionValue : number;
            uBoundingBoxPointTypeBitField : number;
        }
    }

    interface IMcClosedShapeItem extends IMcLineBasedItem {
        SetFillStyle(eFillStyle : IMcLineBasedItem.EFillStyle, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID     puPropertyID.Value : number
         */
        GetFillStyle(puPropertyID? : any, uObjectStateToServe? : number) : IMcLineBasedItem.EFillStyle;
        SetFillColor(FillColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID     puPropertyID.Value : number
         */
        GetFillColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetFillTexture(pFillTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetFillTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetFillTextureScale(FillTextureScale : SMcFVector2D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetFillTextureScale(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector2D;
    }


    interface IMcLineBasedItem extends IMcSymbolicItem, IMcSightPresentationItemParams {
        SetShapeType(eShapeType : IMcLineBasedItem.EShapeType) : void;
        GetShapeType() : IMcLineBasedItem.EShapeType;
        SetLineStyle(LineStyle : IMcLineBasedItem.ELineStyle, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID      puPropertyID.Value : number
         */
        GetLineStyle(puPropertyID? : any, uObjectStateToServe? : number) : IMcLineBasedItem.ELineStyle;
        SetLineColor(LineColor : SMcBColor,	uPropertyID? : number,	uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID      puPropertyID.Value :    number
         */
        GetLineColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetOutlineColor(OutlineColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID      puPropertyID.Value : number
         */
        GetOutlineColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetLineWidth(fLineWidth : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID          puPropertyID.Value :    number
         */
        GetLineWidth(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetOutlineWidth(fOutlineWidth : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID          puPropertyID.Value :    number
         */
        GetOutlineWidth(puPropertyID? : any, uObjectStateToServe? : number) : number;
        
        SetLineTexture(pLineTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetLineTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetLineTextureHeightRange(LineTextureHeightRange : SMcFVector2D , uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetLineTextureHeightRange(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector2D;
        
        SetLineTextureScale(fLineTextureScale : number , uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetLineTextureScale(uPropertyID? : number, uObjectStateToServe? : number) : number;
        SetPointOrderReverseMode(ePointOrderReverseMode : IMcLineBasedItem.EPointOrderReverseMode, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetPointOrderReverseMode(puPropertyID? : any, uObjectStateToServe? : number) : IMcLineBasedItem.EPointOrderReverseMode;
        SetVerticalHeight(fVerticalHeight : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetVerticalHeight(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetSidesFillStyle(eSidesFillStyle : IMcLineBasedItem.EFillStyle, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetSidesFillStyle(puPropertyID? : any, uObjectStateToServe? : number) : IMcLineBasedItem.EFillStyle;
        SetSidesFillColor(SidesFillColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetSidesFillColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetSidesFillTexture(pSidesFillTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetSidesFillTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetSidesFillTextureScale(SidesFillTextureScale : SMcFVector2D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :    number
         */
        GetSidesFillTextureScale(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector2D;
        SetGreatCirclePrecision(fGreatCirclePrecision : number) : void;
        GetGreatCirclePrecision() : number;
        SetNumSmoothingLevels(uNumSmoothingLevels : number , uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetNumSmoothingLevels(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetClippingItems(apClippingItems : IMcObjectSchemeItem[], bSelfClippingOnly? : boolean) : void;
        /**
         * @param papClippingItems              array created by the user, allocated and filled by MapCore
         * @param pbSelfClippingOnly            pbSelfClippingOnly.Value :      boolean
         */
        GetClippingItems(papClippingItems : IMcObjectSchemeItem[], pbSelfClippingOnly : any) : void;
    }
    namespace IMcLineBasedItem {
        enum EFillStyle {
            EFS_HORIZONTAL, 
            EFS_VERTICAL, 
            EFS_FDIAGONAL, 
            EFS_BDIAGONAL,
            EFS_CROSS, 
            EFS_DIAGCROSS, 
            EFS_SOLID, 
            EFS_TEXTURE, 
            EFS_NONE
        }
        enum EPointOrderReverseMode {
            EPORM_NONE,
            EPORM_REVERSE_ALWAYS,
            EPORM_REVERSE_IF_CLOCKWISE,
            EPORM_REVERSE_IF_COUNTER_CLOCKWISE
        }
        enum EShapeType {
            EST_2D,
            EST_3D_EXTRUSION
        }

        enum ELineStyle {
            ELS_SOLID, 
            ELS_DASH, 
            ELS_DOT, 
            ELS_DASH_DOT, 
            ELS_DASH_DOT_DOT, 
            ELS_TEXTURE, 
            ELS_NO_LINE
        }
        class SSlopePresentationColor {
            fMaxSlope : number;
            Color : SMcBColor;

        }
    }

    interface IMcProceduralGeometryItem extends IMcSymbolicItem {
        GetProceduralGeometryCoordinateSystem() : EMcPointCoordSystem;
    }
    namespace IMcProceduralGeometryItem {
        enum ERenderingMode {
        	ERM_POINTS,
            ERM_LINES,
            ERM_TRIANGLES
        }
	}

    interface IMcEmptySymbolicItem extends IMcSymbolicItem {
        Clone(pObject? : IMcObject): IMcEmptySymbolicItem;
    }
    namespace IMcEmptySymbolicItem {
        function Create() : IMcEmptySymbolicItem;
        var NODE_TYPE: number;
    }
       
    interface IMcPictureItem extends IMcSymbolicItem {
        Clone(pObject? : IMcObject): IMcPictureItem;
        GetPictureCoordinateSystem() : EMcPointCoordSystem;
        SetRectAlignment(eRectAlignment : IMcSymbolicItem.EBoundingRectanglePoint, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetRectAlignment(puPropertyID? : any, uObjectStateToServe? : number) : IMcSymbolicItem.EBoundingRectanglePoint;
        SetWidth(fWidth : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetWidth(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetHeight(fHeight : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetHeight(puPropertyID? : any, uObjectStateToServe? : number) : number;
        IsUsingTextureGeoReferencing() : boolean;
        SetTexture(pTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetTextureColor(TextureColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetTextureColor(puPropertyID? : any, uObjectStateToServe? : number): SMcBColor;
        SetNeverUpsideDown(bNeverUpsideDown : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetNeverUpsideDown(puPropertyID?: any, uObjectStateToServe?: number): boolean;
        SetIsSizeFactor(bIsSizeFactor : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetIsSizeFactor(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
    }
    namespace IMcPictureItem {
        function Create(uItemSubTypeBitField : number, ePictureCoordinateSystem : EMcPointCoordSystem, pDefaultTexture : IMcTexture, fDefaultWidth? : number,fDefaultHeight? : number, 
            bIsSizeFactor? : boolean,	DefaultTextureColor? : SMcBColor,eDefaultRectAlignment? : IMcSymbolicItem.EBoundingRectanglePoint,
            bUseTextureGeoReferencing? : boolean) : IMcPictureItem;
        var NODE_TYPE: number;
    }

    interface IMcTextItem extends IMcSymbolicItem {
        Clone(pObject? : IMcObject): IMcTextItem;
        GetTextCoordinateSystem() : EMcPointCoordSystem;
        SetText(Text : SMcVariantString, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :  number
         */
        GetText(puPropertyID? : any, uObjectStateToServe? : number) : SMcVariantString;
        SetFont(pFont : IMcFont, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :  number
         */
        GetFont(puPropertyID? : any, uObjectStateToServe? : number) : IMcFont;
        SetTextAlignment(eTextAlignment : EAxisXAlignment, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :  number
         */
        GetTextAlignment(puPropertyID? : any, uObjectStateToServe? : number) : EAxisXAlignment;
        SetRightToLeftReadingOrder(bRightToLeftReadingOrder : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :  number
         */
        GetRightToLeftReadingOrder(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
        SetRectAlignment(eRectAlignment : IMcSymbolicItem.EBoundingRectanglePoint, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetRectAlignment(puPropertyID? : any, uObjectStateToServe? : number) : IMcSymbolicItem.EBoundingRectanglePoint;
        SetScale(Scale : SMcFVector2D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetScale(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector2D;
        SetMaxWidth(uMaxWidth : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetMaxWidth(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetMargin(uMargin : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetMargin(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetMarginY(uMargin : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetMarginY(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetTextColor(TextColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :   number
         */
        GetTextColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetBackgroundColor(BackgroundColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :         number
         */
        GetBackgroundColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetBackgroundShape(eBackgroundShape : IMcTextItem.EBackgroundShape, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :         number
         */
        GetBackgroundShape(puPropertyID? : any, uObjectStateToServe? : number) : IMcTextItem.EBackgroundShape;
        SetBackgroundBorderColor(BackgroundBorderColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :         number
         */
        GetBackgroundBorderColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetBackgroundBorderWidth(uBackgroundBorderWidth : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :         number
         */
        GetBackgroundBorderWidth(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetOutlineColor(OutlineColor : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :         number
         */
        GetOutlineColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
        SetNeverUpsideDownMode(eNeverUpsideDownMode : IMcTextItem.ENeverUpsideDownMode, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :         number
         */
        GetNeverUpsideDownMode(puPropertyID? : any, uObjectStateToServe? : number) : IMcTextItem.ENeverUpsideDownMode;
        SetCollisionPrevention(bCollisionPrevention : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :  number
         */
        GetCollisionPrevention(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
    }
    namespace IMcTextItem {
        function Create(uItemSubTypeBitField : number, eTextCoordinateSystem : EMcPointCoordSystem, pDefaultFont : IMcFont, DefaultScale? : SMcFVector2D,
            eNeverUpsideDownMode? : IMcTextItem.ENeverUpsideDownMode, eDefaultTextAlignment? : EAxisXAlignment,
            eDefaultRectAlignment? : IMcSymbolicItem.EBoundingRectanglePoint, bDefaultRightToLeftReadingOrder? : boolean, uDefaultMargin? : number,
            DefaultTextColor? : SMcBColor, DefaultBackgroundColor? : SMcBColor) : IMcTextItem;
        enum ENeverUpsideDownMode {
            ENUDM_NONE, 
            ENUDM_ROTATE_TEXT, 
            ENUDM_ROTATE_EACH_LINE
        }
        enum EBackgroundShape {
            EBS_RECTANGLE,
            EBS_RECTANGLE_ROUNDED_SIDES,
            EBS_RECTANGLE_ROUNDED_CORNERS
        }
        var NODE_TYPE: number;
    }

    interface IMcManualGeometryItem extends IMcProceduralGeometryItem {
        Clone(pObject? : IMcObject) : IMcManualGeometryItem;
        SetRenderingMode(eRenderingMode : IMcProceduralGeometryItem.ERenderingMode, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRenderingMode(puPropertyID? : any, uObjectStateToServe? : number) : IMcProceduralGeometryItem.ERenderingMode;
        SetTexture(pTexture : IMcTexture ,uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
        SetConnectionIndices(auConnectionIndices : IMcProperty.SArrayPropertyUInt, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetConnectionIndices(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertyUInt;
        SetPointsCoordinates(aPointsCoordinates : IMcProperty.SArrayPropertyVector3D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsCoordinates(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertyVector3D;
        SetPointsTextureCoordinates(aPointsTextureCoordinates : IMcProperty.SArrayPropertyFVector2D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsTextureCoordinates(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertyFVector2D;
        SetPointsColors(aPointsColors : IMcProperty.SArrayPropertyBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetPointsColors(puPropertyID? : any, uObjectStateToServe? : number) : IMcProperty.SArrayPropertyBColor;
        SetPointsData(aPointsCoordinates : SMcVector3D[], aPointsTextureCoordinates : SMcFVector2D[], aPointsColors : SMcBColor[]) : void;
        /**
         * @param aPointsCoordinates          array created by the user, allocated and filled by MapCore
         * @param aPointsTextureCoordinates   array created by the user, allocated and filled by MapCore
         * @param aPointsColors               array created by the user, allocated and filled by MapCore
         */
        GetPointsData(paPointsCoordinates : SMcVector3D[], paPointsTextureCoordinates : SMcFVector2D[], paPointsColors : SMcBColor[]) : void;
    }
    namespace IMcManualGeometryItem {
        function Create(uItemSubTypeBitField : number, eProceduralGeometryCoordinateSystem : EMcPointCoordSystem,
            eRenderingMode : IMcProceduralGeometryItem.ERenderingMode, pTexture? : IMcTexture, 
            auConnectionIndices? : Uint8Array,  aPointsCoordinates? : SMcVector3D[], 
            aPointsTextureCoordinates? : SMcFVector2D[], aPointsColors? : SMcBColor[]) : IMcManualGeometryItem;
        var NODE_TYPE: number;
    }

    interface IMcArcItem extends IMcLineBasedItem {
        Clone(pObject? : IMcObject) : IMcArcItem;
        GetEllipseCoordinateSystem() : EMcPointCoordSystem;
        SetEllipseType(eEllipseType : IMcObjectSchemeItem.EGeometryType) : void;
        GetEllipseType() : IMcObjectSchemeItem.EGeometryType;
        SetEllipseDefinition(eEllipseDefinition : IMcObjectSchemeItem.EEllipseDefinition) : void; 
        GetEllipseDefinition() : IMcObjectSchemeItem.EEllipseDefinition;
        SetStartAngle(fStartAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetStartAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetEndAngle(fEndAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetEndAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusX(fRadiusX : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadiusX(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusY(fRadiusY : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadiusY(puPropertyID? : any, uObjectStateToServe? : number) : number;
     }
    namespace IMcArcItem {
        function Create(uItemSubTypeBitField : number, eEllipseCoordinateSystem : EMcPointCoordSystem, eEllipseType? : IMcObjectSchemeItem.EGeometryType,
            fDefaultRadiusX? : number, fDefaultRadiusY? : number, fDefaultStartAngle? : number,
            fDefaultEndAngle? : number, eDefaultLineStyle? : IMcLineBasedItem.ELineStyle, DefaultLineColor? : SMcBColor,
            fDefaultLineWidth? : number, pDefaultLineTexture? : IMcTexture, DefaultLineTextureHeightRange? : SMcFVector2D,
            fDefaultLineTextureScale? : number) : IMcArcItem;
        var NODE_TYPE: number;
    }

    interface IMcLineItem extends IMcLineBasedItem {
        Clone(pObject? : IMcObject): IMcLineItem;

        SetSlopePresentationColors(aColors : IMcLineBasedItem.SSlopePresentationColor[]) : void;
        GetSlopePresentationColors() : IMcLineBasedItem.SSlopePresentationColor[];
        SetSlopeQueryPrecision(eQueryPrecision : IMcSpatialQueries.EQueryPrecision, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetSlopeQueryPrecision(puPropertyID? : any, uObjectStateToServe? : number) : IMcSpatialQueries.EQueryPrecision;
        SetShowSlopePresentation(bShowSlopePresentation : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetShowSlopePresentation(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
        SetShowTraversabilityPresentation(bShowTraversabilityPresentation : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetShowTraversabilityPresentation(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
        SetTraversabilityColor(eTraversabilityType : IMcSpatialQueries.EPointTraversability, Color : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
         GetTraversabilityColor(eTraversabilityType : IMcSpatialQueries.EPointTraversability, puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
    }
    namespace IMcLineItem {
        function Create(uItemSubTypeBitField : number,
            eDefaultLineStyle? : IMcLineBasedItem.ELineStyle,
            DefaultLineColor? : SMcBColor,
            fDefaultLineWidth? : number,
            pDefaultLineTexture? : IMcTexture,
            DefaultLineTextureHeightRange? : SMcFVector2D,
            fDefaultLineTextureScale? : number) : IMcLineItem;
        var NODE_TYPE: number;
    }

    interface IMcRectangleItem extends IMcClosedShapeItem {
        Clone(pObject? : IMcObject) : IMcRectangleItem;
        GetRectangleCoordinateSystem() : EMcPointCoordSystem;
        SetRectangleType(eRectangleType : IMcObjectSchemeItem.EGeometryType) : void;
        GetRectangleType() : IMcObjectSchemeItem.EGeometryType;
	    SetRectangleDefinition(eRectangleDefinition : IMcRectangleItem.ERectangleDefinition) : void;
	    GetRectangleDefinition() : IMcRectangleItem.ERectangleDefinition;
        SetRadiusX(fRadiusX : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetRadiusX(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusY(fRadiusY : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
          * @param puPropertyID            puPropertyID.Value :      number
          */
        GetRadiusY(puPropertyID? : any, uObjectStateToServe? : number) : number;
    }
    namespace IMcRectangleItem{
        function Create(uItemSubTypeBitField : number,
            eRectangleCoordinateSystem : EMcPointCoordSystem,
            eRectangleType? : IMcObjectSchemeItem.EGeometryType,
            eRectangleDefinition? : IMcRectangleItem.ERectangleDefinition,
            fDefaultRadiusX? : number, fDefaultRadiusY? : number,
            eDefaultLineStyle? : IMcLineBasedItem.ELineStyle,
            DefaultLineColor? : SMcBColor,
            fDefaultLineWidth? : number,
            pDefaultLineTexture? : IMcTexture,
            DefaultLineTextureHeightRange? : SMcFVector2D,
            fDefaultLineTextureScale? : number,
            eDefaultFillStyle? : IMcLineBasedItem.EFillStyle,
            DefaultFillColor? : SMcBColor,
            pDefaultFillTexture? : IMcTexture,
            DefaultFillTextureScale? : SMcFVector2D) : IMcRectangleItem;
        enum ERectangleDefinition {
            ERD_RECTANGLE_DIAGONAL_POINTS, 
            ERD_RECTANGLE_CENTER_DIMENSIONS, 
            ERD_SQUARE_CENTER_DIMENSION
        }
        var NODE_TYPE: number;
    }

    interface IMcPolygonItem extends IMcClosedShapeItem {
        Clone(pObject? : IMcObject) : IMcPolygonItem;
    }
    namespace IMcPolygonItem {
        function Create(uItemSubTypeBitField : number, DefaultLineStyle? : IMcLineBasedItem.ELineStyle, DefaultLineColor? : SMcBColor,
            fDefaultLineWidth? : number, pDefaultLineTexture? : IMcTexture,	DefaultLineTextureHeightRange? : SMcFVector2D,
            fDefaultLineTextureScale? : number,	eDefaultFillStyle? : IMcLineBasedItem.EFillStyle,
            DefaultFillColor? : SMcBColor, pDefaultFillTexture? : IMcTexture,
            DefaultFillTextureScale? : SMcFVector2D) : IMcPolygonItem;
        var NODE_TYPE: number;
    }

    interface IMcLineExpansionItem extends IMcClosedShapeItem {
        Clone(pObject? : IMcObject) : IMcLineExpansionItem;
        GetLineExpansionCoordinateSystem() : EMcPointCoordSystem;
        SetLineExpansionType(eLineExpansionType : IMcObjectSchemeItem.EGeometryType) : void;
        GetLineExpansionType() : IMcObjectSchemeItem.EGeometryType;
        SetRadius(fRadius : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadius(puPropertyID? : any, uObjectStateToServe? : number) : number;
    }
    namespace IMcLineExpansionItem {
        function Create(uItemSubTypeBitField : number,
            eLineExpansionCoordinateSystem : EMcPointCoordSystem,
            eLineExpansionType? : IMcObjectSchemeItem.EGeometryType,
            fDefaultRadius? : number,
            DefaultLineStyle? : IMcLineBasedItem.ELineStyle,
            DefaultLineColor? : SMcBColor,
            fDefaultLineWidth? : number,
            pDefaultLineTexture? : IMcTexture,
            DefaultLineTextureHeightRange? : SMcFVector2D,
            fDefaultLineTextureScale? : number,
            eDefaultFillStyle? : IMcLineBasedItem.EFillStyle,
            DefaultFillColor? : SMcBColor,
            pDefaultFillTexture? : IMcTexture,
            DefaultFillTextureScale? : SMcFVector2D) : IMcLineExpansionItem;
        var NODE_TYPE: number;
    }

    interface IMcEllipseItem extends IMcClosedShapeItem {
        Clone(pObject? : IMcObject) : IMcEllipseItem;
        GetEllipseCoordinateSystem() : EMcPointCoordSystem;
        SetEllipseType(eEllipseType : IMcObjectSchemeItem.EGeometryType) : void;
        GetEllipseType() : IMcObjectSchemeItem.EGeometryType;
        SetEllipseDefinition(eEllipseDefinition : IMcObjectSchemeItem.EEllipseDefinition) : void;
        GetEllipseDefinition() : IMcObjectSchemeItem.EEllipseDefinition;
        SetFillTexturePolarMapping(bPolar : boolean) : void;
        GetFillTexturePolarMapping() : boolean;
        SetStartAngle(fStartAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetStartAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetEndAngle(fEndAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetEndAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusX(fRadiusX : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadiusX(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetRadiusY(fRadiusY : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetRadiusY(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetInnerRadiusFactor(fInnerRadiusFactor : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetInnerRadiusFactor(puPropertyID? : any, uObjectStateToServe? : number) : number;
    }
    namespace IMcEllipseItem {
        function Create(uItemSubTypeBitField : number, eEllipseCoordinateSystem : EMcPointCoordSystem,
            eEllipseType? : IMcObjectSchemeItem.EGeometryType, fDefaultRadiusX?  : number, fDefaultRadiusY? : number,
            fDefaultStartAngle? : number, fDefaultEndAngle? : number, fDefaultInnerRadiusFactor? : number,
            eDefaultLineStyle? : IMcLineBasedItem.ELineStyle, DefaultLineColor? : SMcBColor, fDefaultLineWidth? : number,
            pDefaultLineTexture? : IMcTexture, DefaultLineTextureHeightRange? : SMcFVector2D, fDefaultLineTextureScale? : number,
            eDefaultFillStyle? : IMcLineBasedItem.EFillStyle,	DefaultFillColor? : SMcBColor, pDefaultFillTexture? : IMcTexture,
            DefaultFillTextureScale? : SMcFVector2D) : IMcEllipseItem;
        var NODE_TYPE: number;
    }

    interface IMcArrowItem extends IMcClosedShapeItem {
        Clone(pObject? : IMcObject) : IMcArrowItem;
        GetArrowCoordinateSystem() : EMcPointCoordSystem;
        SetHeadSize(fHeadSize : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetHeadSize(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetHeadAngle(fHeadAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetHeadAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetGapSize(fGapSize : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetGapSize(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetSlopePresentationColors(aColors : IMcLineBasedItem.SSlopePresentationColor[]) : void;
        GetSlopePresentationColors() : IMcLineBasedItem.SSlopePresentationColor[];
        SetSlopeQueryPrecision(eQueryPrecision : IMcSpatialQueries.EQueryPrecision, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetSlopeQueryPrecision(puPropertyID? : any, uObjectStateToServe? : number) : IMcSpatialQueries.EQueryPrecision;
        SetShowSlopePresentation(bShowSlopePresentation : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetShowSlopePresentation(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
        SetShowTraversabilityPresentation(bShowTraversabilityPresentation : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
        GetShowTraversabilityPresentation(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
        SetTraversabilityColor(eTraversabilityType : IMcSpatialQueries.EPointTraversability, Color : SMcBColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID               puPropertyID.Value :         number
         */
         GetTraversabilityColor(eTraversabilityType : IMcSpatialQueries.EPointTraversability, puPropertyID? : any, uObjectStateToServe? : number) : SMcBColor;
    }
    namespace IMcArrowItem {
        function Create(uItemSubTypeBitField : number, eArrowCoordinateSystem : EMcPointCoordSystem, fDefaultHeadSize? : number,
            fDefaultHeadAngle? : number, fDefaultGapSize? : number,	eDefaultLineStyle? : IMcLineBasedItem.ELineStyle,
            DefaultLineColor? : SMcBColor, fDefaultLineWidth? : number,	pDefaultLineTexture? : IMcTexture,
            DefaultLineTextureHeightRange? : SMcFVector2D, fDefaultLineTextureScale? : number) : IMcArrowItem;
        var NODE_TYPE: number;
    }

    interface IMcConditionalSelector extends IMcBase {
        GetOverlayManager() : IMcOverlayManager;
        SetID(uID : number) : void;
        GetID() : number;
        SetName(strName : string) : void;
        GetName() : string;
        GetConditionalSelectorType() : number;
    }
    namespace IMcConditionalSelector {
        enum EActionOptions {
            EAO_FORCE_FALSE,
            EAO_FORCE_TRUE, 
            EAO_USE_SELECTOR
        }
        enum EActionType {
            EAT_ACTIVITY,
            EAT_VISIBILITY,
            EAT_TRANSFORM,
            EAT_NUM
        }
    }

    interface IMcScaleConditionalSelector extends IMcConditionalSelector {
        SetMinScale(fMinScale : number) : void;
        GetMinScale() : number;
        SetMaxScale(fMaxScale : number) : void;
        GetMaxScale() : number;
        SetCancelScaleMode(uCancelScaleMode : number) : void;
        GetCancelScaleMode() : number;
        SetCancelScaleModeResult(uCancelScaleModeResult : number) : void;
        GetCancelScaleModeResult() : number;
    }
    namespace IMcScaleConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager, fMinScale : number, fMaxScale : number, uCancelScaleMode : number, uCancelScaleModeResult : number) : IMcScaleConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
    }

    interface IMcViewportConditionalSelector extends IMcConditionalSelector {
        SetViewportTypeBitField(uViewportTypeBitField : number) : void;
        GetViewportTypeBitField() : number;
        SetViewportCoordinateSystemBitField(uViewportCoordinateSystemBitField : number) : void;
        GetViewportCoordinateSystemBitField() : number;
        SetSpecificViewports(auViewportsIDs : Uint8Array, bIDsInclusive : boolean) : void;
       /**
         * @param pbIDsInclusive               pbIDsInclusive.Value :         boolean
         */
        GetSpecificViewports(pbIDsInclusive : any): Uint32Array;
    }
    namespace IMcViewportConditionalSelector{
        function Create(pOverlayManager : IMcOverlayManager, uViewportTypeBitField? : number,
    		uViewportCoordinateSystemBitField? : number, uViewportsIDs? : Uint8Array, bIDsInclusive? : boolean) : IMcViewportConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
        enum EViewportTypeFlags {
            EVT_NONE, 
            EVT_2D_REGULAR_VIEWPORT, 
            EVT_2D_IMAGE_VIEWPORT, 
            EVT_2D_SECTION_VIEWPORT,
            EVT_2D_VIEWPORT, 
            EVT_3D_VIEWPORT, 
            EVT_ALL_VIEWPORTS
        }
        enum EViewportCoordinateSystem {
            EVCS_GEO_COORDINATE_SYSTEM, 
            EVCS_UTM_COORDINATE_SYSTEM, 
            EVCS_ALL_COORDINATE_SYSTEMS
        }
    }

    interface IMcBlockedConditionalSelector extends IMcConditionalSelector {
    }
    namespace IMcBlockedConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager) : IMcBlockedConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
    
    }

    interface IMcObjectStateConditionalSelector extends IMcConditionalSelector {
        SetObjectState(uObjectState : number) : void;
        GetObjectState() : number;
    }
    namespace IMcObjectStateConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager, uObjectState? : number) : IMcObjectStateConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
    }

    interface IMcLocationConditionalSelector extends IMcConditionalSelector {
        
        SetPolygonPoints(aPoints : SMcVector3D[]) : void;
        GetPolygonPoints() : SMcVector3D[];
    }
    namespace IMcLocationConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager, aPoints : SMcVector3D[]) : IMcLocationConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
    }

    interface IMcMesh extends IMcBase {
            GetMeshType() : number;
        	IsCreatedWithUseExisting() : boolean;
    }
    namespace IMcMesh {
    }

    interface IMcXFileMesh extends IMcMesh {
        SetXFile(strXFile : string, pTransparentColor? :  SMcBColor) : void;
        GetXFile() : string;
        /**
         * @param pTransparentColor     pTransparentColor.Value :  SMcBColor
         */
	    GetTransparentColor(pTransparentColor : any) : boolean;
    }
    namespace IMcXFileMesh {
        /**
         * @param pbExistingUsed     pbExistingUsed.Value :  boolean
         */
        function Create(strXFile : string, pTransparentColor? : SMcBColor,	bUseExisting? : boolean, pbExistingUsed? : any) : IMcXFileMesh;
        var MESH_TYPE: number;
    }

    interface IMcNativeMesh extends IMcMesh {
        	SetMappedNameID(eType : IMcNativeMesh.EMappedNameType, uID : number, strName : string) : void;
            GetMappedNameByID(eType : IMcNativeMesh.EMappedNameType, uID : number) : string;
            SetMappedNamesIDs(eType : IMcNativeMesh.EMappedNameType, aMappedNamesData : IMcNativeMesh.SMappedNameData[]) : void;
            GetMappedNamesIDs(eType : IMcNativeMesh.EMappedNameType) : Uint32Array;
            GetTextureUnitStatesNames() : string[];
	        GetAttachPointsNames() : string[];
	        GetNumAttachPoints() : number;
            GetAttachPointIndexByName(strName : string) : number;
            GetAttachPointNameByIndex(uIndex : number) : string;
            GetAttachPointChildren(uParentIndex : number) : Uint32Array;
            GetAnimationsNames() : string[];
    }
    namespace IMcNativeMesh {
        enum EMappedNameType {
            EMNT_ATTACH_POINT, 
            EMNT_TEXTURE_UNIT_STATE
        }
        class SMappedNameData {
            constructor();
            uID : number;
            strName : string;
        }
        var MESH_TYPE: number;
    } 

    interface IMcNativeMeshFile extends IMcNativeMesh {
        	SetMeshFile(strMeshFile : string) : void;
            GetMeshFile() : string;
    }
    namespace IMcNativeMeshFile {
        /**
         * @param pbExistingUsed     pbExistingUsed.Value :  boolean
         */
        function Create(strMeshFile : string, bUseExisting? : boolean, pbExistingUsed? : any) : IMcNativeMeshFile;
        var MESH_TYPE: number;        
    }

    interface IMcBooleanConditionalSelector extends IMcConditionalSelector {
        SetListOfSelectors(ppSelectorList : IMcConditionalSelector[]) : void;
        GetListOfSelectors() : IMcConditionalSelector[];
        SetBooleanOperation(eOperation : IMcBooleanConditionalSelector.EBooleanOp) : void;
        GetBooleanOperation() : IMcBooleanConditionalSelector.EBooleanOp;
    }
    namespace IMcBooleanConditionalSelector {
        function Create(pOverlayManager : IMcOverlayManager, ppSelectorList : IMcConditionalSelector[], eOperation : IMcBooleanConditionalSelector.EBooleanOp) : IMcBooleanConditionalSelector;
        var CONDITIONAL_SELECTOR_TYPE : number;
        enum EBooleanOp{
            EB_AND,
            EB_OR, 
            EB_NOT
        }
    }

    interface IMcCollection extends IMcBase {
        Remove() : void;
        Clear() : void;
        GetOverlayManager() : IMcOverlayManager;
        SetCollectionVisibility(bVisibility : boolean, pMapViewport? : IMcMapViewport) : void;
        GetCollectionVisibility(pMapViewport? : IMcMapViewport) : boolean;
        AddObjects(pObjects : IMcObject[]) : void;
        RemoveObjectFromCollection(pObject : IMcObject) : void;
        RemoveObjectsFromTheirOverlays() : void;
        GetObjects() : IMcObject[];
        MoveObjects(Offset : SMcVector3D) : void;
        SetObjectsState(StateOrStatesArray : number | Uint8Array, pMapViewport? :  IMcMapViewport) : void;
        SetObjectsVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, pMapViewport? : IMcMapViewport) : void;
        AddOverlays(pOverlays : IMcOverlay[]) : void;
        RemoveOverlayFromCollection(pOverlay : IMcOverlay) : void;
        RemoveOverlaysFromOverlayManager() : void;
        GetOverlays() : IMcOverlay[];
        SetOverlaysVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, pMapViewport? : IMcMapViewport) : void;
    }
    namespace IMcCollection {
        function Create(pOverlayManager : IMcOverlayManager) : IMcCollection;
    }

    interface IMcObject extends IMcBase {
        Clone(pOverlay : IMcOverlay, bCloneObjectScheme : boolean , bClonePointsAndSubItems? : boolean) : IMcObject;
        SetObjectToObjectAttachment(uAttachedLocationIndex : number, pAttachmentParams : IMcObject.SObjectToObjectAttachmentParams) : void;
        GetObjectToObjectAttachment(uAttachedLocationIndex : number) : IMcObject.SObjectToObjectAttachmentParams;
        IsAttachedToAnotherObject() : boolean;
        Remove() : void;
        GetSymbologyStandard() : IMcObject.ESymbologyStandard;
        SetSymbologyAnchorPointsAndGeometricAmplifiers(aAnchorPoints : SMcVector3D[], aGeometricAmplifiers : SMcKeyFloatValue[]) : void;
        /**
         * @param paAnchorPoints            array created by the user, allocated and filled by MapCore
         * @param paGeometricAmplifiers     array created by the user, allocated and filled by MapCore
         */
        GetSymbologyAnchorPointsAndGeometricAmplifiers(paAnchorPoints : SMcVector3D[], paGeometricAmplifiers : SMcKeyFloatValue[]) : void;
        SetSymbologyGraphicalProperties(strSymbolID : string, aAmplifiers : IMcObject.SKeyVariantValue[]) : void;
         /**
         * @param pstrSymbolID      pstrSymbolID.Value :  string          
         * @param paAmplifiers      array created by the user, allocated and filled by MapCore
         */
        GetSymbologyGraphicalProperties(pstrSymbolID : any, paAmplifiers? : IMcObject.SKeyVariantValue[]) : void;
        UpdateSymbologyTextualAmplifiersFromGeometricData() : void;
        GetNumLocations() : number;
        GetLocationIndexByID(uNodeID : number) : number;
        SetNumLocationPoints(uNumLocationPoints : number, uLocationIndex? : number) : void;
        SetLocationPoints(aLocationPoints : SMcVector3D[], uLocationIndex? : number) : void;
        UpdateLocationPoints(aLocationPoints: SMcVector3D[], uStartIndex? : number, uLocationIndex? : number) : void;
        GetLocationPoints(uLocationIndex? : number) : SMcVector3D[];
        AddLocationPoint(uInsertIndex : number, LocationPoint : SMcVector3D, uLocationIndex? : number) : number;
        RemoveLocationPoint(uRemoveIndex : number, uLocationIndex? : number) : void;
        UpdateLocationPoint(uUpdateIndex : number,LocationPoint : SMcVector3D, uLocationIndex? : number) : void;
        MoveAllLocationsPoints(Offset : SMcVector3D) : void;
        PlayPathAnimation(aPathAnimationNodes : IMcObject.SPathAnimationNode[], ePositionInterpolationMode : IMcObject.EPositionInterpolationMode, 
            eRotationInterpolationMode : IMcObject.ERotationInterpolationMode,fStartingTimePoint : number, fRotationAdditionalYaw : number, 
            bAutomaticRotation : boolean,	bLoop : boolean) : void;
        StopPathAnimation() : void;
        RotateByItem(Rotation : SMcRotation) : void;
        SetScreenArrangementOffset(pMapViewport : IMcMapViewport, Offset : SMcFVector2D) : void;
        GetScreenArrangementOffset(pMapViewport : IMcMapViewport) : SMcFVector2D;
        SetImageCalc(pLocationImageCalc : IMcImageCalc) : void;
        GetImageCalc() : IMcImageCalc;
        SetOverlay(pOverlay : IMcOverlay) : void;
        GetOverlay() : IMcOverlay;
        GetOverlayManager() : IMcOverlayManager;
        GetCollections() : IMcCollection[];
        SetScheme(pObjectScheme : IMcObjectScheme, bKeepRelevantProperties : boolean) : void;
        GetScheme() : IMcObjectScheme;
        GetNodeByID(uNodeID : number) : IMcObjectSchemeNode;
        GetNodeByName(strNodeName : string) : IMcObjectSchemeNode;
	    SetSuppressQueryPresentationMapTilesWebRequests(bSuppress: boolean) : void;
		GetSuppressQueryPresentationMapTilesWebRequests() : boolean;
        SetTraversabilityPresentationMapLayer(pMapLayer : IMcTraversabilityMapLayer) : void;
        GetTraversabilityPresentationMapLayer() : IMcTraversabilityMapLayer;
        SetID(uID : number) : void;
        GetID() : number;
        SetNameAndDescription(strName : string, strDescription : string) : void;
        /**
         * @param pstrName              pstrName.Value :  string        
         * @param pstrDescription       pstrDescription.Value :  string  
         */
        GetNameAndDescription(pstrName : any, pstrDescription : any) : void;
        SetUserData(pUserData : IMcUserData) : void;
        GetUserData() : IMcUserData;
        SetDrawPriority(nPriority : number, pMapViewport? : IMcMapViewport) : void;
        GetDrawPriority(pMapViewport : IMcMapViewport) : number;
        SetVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, MapViewportOrArray? : IMcMapViewport | IMcMapViewport[]) : void;
        GetVisibilityOption(pMapViewport? : IMcMapViewport) : IMcConditionalSelector.EActionOptions;
        GetEffectiveVisibilityInViewport(pMapViewport : IMcMapViewport) : boolean;
        SetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, bActionOnResult : boolean, pSelector : IMcConditionalSelector) : void;           
        /**
         * @param pbActionOnResult     pbActionOnResult.Value :  boolean
         * @param pSelector            pSelector.Value :  IMcConditionalSelector
         */
        GetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, pbActionOnResult : any, pSelector : any) : void;
        SetIgnoreViewportVisibilityMaxScale(bIgnoreViewportVisibilityMaxScale : boolean) : void;
        GetIgnoreViewportVisibilityMaxScale() : boolean;
        SetDetectibility(bDetectibility : boolean , pMapViewport? : IMcMapViewport) : void;
        GetDetectibility(pMapViewport? : IMcMapViewport) : boolean;
        SetInEditing(bInEditing : boolean , pMapViewport? : IMcMapViewport) : void;
        GetInEditing(pMapViewport? : IMcMapViewport) : boolean;
        SetState(StateOrStatesArray: number | Uint8Array, pMapViewport?: IMcMapViewport) : void;
        GetState(pMapViewport? : IMcMapViewport) : Uint8Array;
        GetEffectiveState(pMapViewport? : IMcMapViewport) : Uint32Array;
        ResetProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : void;
        ResetAllProperties() : void;
        IsPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : boolean;
        SetBoolProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : boolean) : void;
        GetBoolProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : boolean;
        SetByteProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetByteProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetSByteProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetSByteProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetEnumProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetEnumProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetIntProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetIntProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetUIntProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetUIntProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetFloatProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetFloatProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetDoubleProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetDoubleProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetVector2DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcVector2D) : void;
        GetVector2DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcVector2D;
        SetFVector2DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcFVector2D) : void;
        GetFVector2DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcFVector2D;
        SetVector3DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcVector3D) : void;
        GetVector3DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcVector3D;
        SetFVector3DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcFVector3D) : void;
        GetFVector3DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcFVector3D;
        SetBColorProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcBColor) : void;
        GetBColorProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcBColor;
        SetFColorProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcFColor) : void;
        GetFColorProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcFColor;
        SetStringProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcVariantString) : void;
        GetStringProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcVariantString;
        SetFontProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : IMcFont) : void;
        GetFontProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcFont;
        SetTextureProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : IMcTexture) : void;
        GetTextureProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcTexture;
        SetMeshProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : IMcMesh) : void;
        GetMeshProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcMesh;
        SetConditionalSelectorProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : IMcConditionalSelector) : void;
        GetConditionalSelectorProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcConditionalSelector;
        SetRotationProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcRotation) : void;
        GetRotationProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcRotation;
        SetAnimationProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcAnimation) : void;
        GetAnimationProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcAnimation;
        SetArraySubItemDataProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySubItemData) : void;
        GetArraySubItemDataProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySubItemData;
        SetArrayIntProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyInt) : void;
        GetArrayIntProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyInt;
        SetArrayUIntProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyUInt) : void;
        GetArrayUIntProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyUInt;
        SetArrayFVector2DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyFVector2D) : void;
        GetArrayFVector2DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyFVector2D;
        SetArrayVector2DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyVector2D) : void;
        GetArrayVector2DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyVector2D;
        SetArrayFVector3DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyFVector3D) : void;
        GetArrayFVector3DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyFVector3D;
        SetArrayVector3DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyVector3D) : void;
        GetArrayVector3DProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyVector3D;
        SetArrayBColorProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyBColor) : void;
        GetArrayBColorProperty(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyBColor;
        SetProperty(Property : IMcProperty.SVariantProperty) : void;
        GetProperty(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcProperty.SVariantProperty;
        SetProperties(aProperties :  IMcProperty.SVariantProperty[]) : void;
        GetProperties() : IMcProperty.SVariantProperty[];
        GetPropertyType(NameOrID : number | string | IMcProperty.SPropertyNameID, bNoFailOnNonExistent? : boolean) : IMcProperty.EPropertyType;
        GetEnumPropertyActualType(NameOrID : number | string | IMcProperty.SPropertyNameID) : string;
	    UpdatePropertiesAndLocationPoints(aProperties : IMcProperty.SVariantProperty[], aLocationPoints : SMcVector3D[], uStartIndex? : number, uLocationIndex? : number) : void;
	    /**
         * @param paProperties              array created by the user, allocated and filled by MapCore
         * @param paLocationPoints          array created by the user, allocated and filled by MapCore
         */
        GetPropertiesAndLocationPoints(paProperties : IMcProperty.SVariantProperty[], paLocationPoints: SMcVector3D[], uLocationIndex? : number) : void;
    }
    namespace IMcObject {
        function Create(pOverlay : IMcOverlay, pObjectScheme : IMcObjectScheme, aLocationPoints? : SMcVector3D[]) : IMcObject;
        /**
         * @param ppLocation     ppLocation.Value : IMcObjectLocation
         */
        function Create(ppLocation : any, pOverlay : IMcOverlay, eLocationCoordSystem : EMcPointCoordSystem,	aLocationPoints : SMcVector3D[], bLocationRelativeToDTM? : boolean) : IMcObject;
        function Create(pOverlay : IMcOverlay, pItem : IMcObjectSchemeItem, eLocationCoordSystem : EMcPointCoordSystem, aLocationPoints : SMcVector3D[], bLocationRelativeToDTM? : boolean) : IMcObject;
        function SetEachObjectLocationPoint(apObjects : IMcObject[], aLocationPoints : SMcVector3D[], uLocationIndex? :number) : void;
	    function SetEachObjectProperty(apObjects : IMcObject[], aProperties : IMcProperty.SVariantProperty[]) : void;
	    function CreatePointlessFromSymbology(pOverlay : IMcOverlay, eSymbologyStandard : ESymbologyStandard, strSymbolID : string, aAmplifiers: SKeyVariantValue[], bFlipped? : boolean) : IMcObject;
	    function CreateFromSymbology(pOverlay : IMcOverlay, eSymbologyStandard : ESymbologyStandard, strSymbolID : string, aAnchorPoints : SMcVector3D[], aGeometricAmplifiers : SMcKeyFloatValue[], aAmplifiers : SKeyVariantValue[]) : IMcObject;

        enum EPositionInterpolationMode {
            EPIM_LINEAR, 
            EPIM_SPLINE
        }
        enum ERotationInterpolationMode {
            ERIM_LINEAR, 
            ERIM_SPHERICAL
        }
        enum ESymbologyStandard {
            ESS_NONE,
            ESS_APP6D,
            ESS_2525C
        }
        class SObjectToObjectAttachmentParams {
            constructor();
            pTargetObject : IMcObject;
            pTargetNode : IMcObjectSchemeNode;
            AttachPointParams : IMcSymbolicItem.SAttachPointParams;
            Offset : SMcFVector3D;
        }

        class SPathAnimationNode {
            constructor();
            Position : SMcVector3D; 
            fTime : number;
            ManualRotation : SMcRotation;
        }
        class SKeyVariantValue{
            strKey: string;
            Value: IMcProperty.SVariantProperty;
        }
        class SMultiKeyName{
            strKeyBaseName : string;
            uNumAdditionalNames : number;
        }
    }

    interface IMcObjectLocation extends IMcObjectSchemeNode {
        GetIndex() : number;
	    GetCoordSystem() : EMcPointCoordSystem;
	    SetRelativeToDTM(bRelativeToDTM : boolean, uPropertyID? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :      number
         */
	    GetRelativeToDTM(puPropertyID? : any) : boolean;
        SetMaxNumPoints(uMaxNumPoints : number, uPropertyID? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :      number
         */
        GetMaxNumPoints(puPropertyID? : any) : number;
    }
    namespace IMcObjectLocation {
        var NODE_TYPE: number;
    }

    interface IMcObjectScheme extends IMcBase {
        Clone() : IMcObjectScheme;
        GetOverlayManager() : IMcOverlayManager;
        SetTerrainObjectsConsideration(uTerrainObjectsConsiderationBitField : number) : void;
        GetTerrainObjectsConsideration() : number;
	    SetTerrainItemsConsistency(bEnabled : boolean) : void;
        GetTerrainItemsConsistency() : boolean;
        SetGroupingItemsByDrawPriorityWithinObjects(bEnabled : boolean) : void;
        GetGroupingItemsByDrawPriorityWithinObjects() : boolean;
        GetNumObjectLocations() : number;
	    GetObjectLocationIndexByID(uNodeID : number) : number;
         /**
         * @param puLocationIndex       puLocationIndex.Value :     number
         */
        AddObjectLocation(eLocationCoordSystem : EMcPointCoordSystem, bLocationRelativeToDTM? : boolean, puLocationIndex? : any, uInsertAtIndex? : number) : IMcObjectLocation;
        RemoveObjectLocation(uLocationIndex? : number) : void;
        GetObjectLocation(uLocationIndex? : number) : IMcObjectLocation;
        GetNodeByID(uNodeID : number) : IMcObjectSchemeNode;
        GetNodeByName(strNodeName : string) : IMcObjectSchemeNode;
        GetNodes(uNodeKindBitField? : number) : IMcObjectSchemeNode[];
        GetNodesByPropertyID(uPropertyID : number) : IMcObjectSchemeNode[];
        GetObjects() : IMcObject[];
        SetObjectStateName(strStateName : string, uState : number) : void;
        GetObjectStateByName(strStateName : string) : number;
        GetObjectStateName(uState : number) : string;
        SetObjectsState(StateOrStatesArray : number | Uint8Array, pMapViewport? :  IMcMapViewport) : void;
	    SetObjectStateModifiers(aObjectStateModifiers : IMcObjectScheme.SObjectStateModifier[]) : void;
        GetObjectStateModifiers() : IMcObjectScheme.SObjectStateModifier[];
        SetObjectRotationItem(pItem : IMcObjectSchemeItem) : void;
        GetObjectRotationItem() : IMcObjectSchemeItem;
        SetObjectScreenArrangementItem(pItem : IMcObjectSchemeItem) : void;
        GetObjectScreenArrangementItem(): IMcObjectSchemeItem;
        SetEditModeDefaultItem(pItem: IMcObjectSchemeItem) : void;
        GetEditModeDefaultItem(): IMcObjectSchemeItem;
        SetID(uID : number) : void;
        GetID() : number;
        SetName(strName : string) : void;
	    GetName() : string;
	    SetUserData(pUserData : IMcUserData) : void;
        GetUserData() : IMcUserData;
        GetProperties() : IMcProperty.SPropertyNameIDType[];
        GetPropertyType(NameOrID : number | string | IMcProperty.SPropertyNameID, bNoFailOnNonExistent? : boolean) :  IMcProperty.EPropertyType; 
        GetEnumPropertyActualType(NameOrID : number | string | IMcProperty.SPropertyNameID) : string;
        SetPropertyName(strPropertyName : string, NameOrID : number | string | IMcProperty.SPropertyNameID) : void;
        GetPropertyIDByName(strPropertyName : string) : number;
        GetPropertyNameByID(NameOrID : number | string | IMcProperty.SPropertyNameID) : string;
        SetPropertyNames(aProperties : IMcProperty.SPropertyNameID[]) : void;
	    GetPropertyNames() : IMcProperty.SPropertyNameID[];
	    SetBoolPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : boolean) : void;
        GetBoolPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : boolean;
        SetBytePropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetBytePropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetSBytePropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetSBytePropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetEnumPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetEnumPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetIntPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetIntPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetUIntPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetUIntPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetFloatPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetFloatPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetDoublePropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : number) : void;
        GetDoublePropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : number;
        SetVector2DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcVector2D) : void;
        GetVector2DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcVector2D;
        SetFVector2DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcFVector2D) : void;
        GetFVector2DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcFVector2D;
        SetVector3DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcVector3D) : void;
        GetVector3DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcVector3D;
        SetFVector3DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcFVector3D) : void;
        GetFVector3DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcFVector3D;
        SetBColorPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcBColor) : void;
        GetBColorPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcBColor;
        SetFColorPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcFColor) : void;
        GetFColorPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcFColor;
        SetStringPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcVariantString) : void;
        GetStringPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcVariantString;
        SetFontPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : IMcFont) : void;
        GetFontPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcFont;
        SetTexturePropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : IMcTexture) : void;
        GetTexturePropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcTexture;
        SetMeshPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : IMcMesh) : void;
        GetMeshPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcMesh;
        SetConditionalSelectorPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : IMcConditionalSelector) : void;
        GetConditionalSelectorPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcConditionalSelector;
        SetRotationPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcRotation) : void;
        GetRotationPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcRotation;
        SetAnimationPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, Value : SMcAnimation) : void;
        GetAnimationPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : SMcAnimation;
        SetArraySubItemDataPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertySubItemData) : void;
        GetArraySubItemDataPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertySubItemData;
        SetArrayUIntPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyUInt) : void;
        GetArrayUIntPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyUInt;
        SetArrayFVector2DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyFVector2D) : void;
        GetArrayFVector2DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyFVector2D;
        SetArrayVector2DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyVector2D) : void;
        GetArrayVector2DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyVector2D;
        SetArrayFVector3DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyFVector3D) : void;
        GetArrayFVector3DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyFVector3D;
        SetArrayVector3DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyVector3D) : void;
        GetArrayVector3DPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyVector3D;
        SetArrayBColorPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType, Value : IMcProperty.SArrayPropertyBColor) : void;
        GetArrayBColorPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID, ePropertyType : IMcProperty.EPropertyType) : IMcProperty.SArrayPropertyBColor;
        SetPropertyDefault(Property : IMcProperty.SVariantProperty) : void;
	    GetPropertyDefault(NameOrID : number | string | IMcProperty.SPropertyNameID) : IMcProperty.SVariantProperty;
        SetPropertyDefaults(aProperties : IMcProperty.SVariantProperty[]) : void;
	    GetPropertyDefaults() : IMcProperty.SVariantProperty[];
        SetEditModeParams(Params: IMcEditMode.SObjectOperationsParams) : void;
        GetEditModeParams() : IMcEditMode.SObjectOperationsParams;
    }
    namespace IMcObjectScheme {
         /**
          * @param ppLocation     ppLocation.Value : IMcObjectLocation
          */
        function Create(ppLocation : any, pOverlayManager : IMcOverlayManager, eLocationCoordSystem : EMcPointCoordSystem,
		    bLocationRelativeToDTM? : boolean, uTerrainObjectsConsiderationBitField? : number) : IMcObjectScheme;
        function Create(pOverlayManager : IMcOverlayManager,	pItem : IMcObjectSchemeItem, eLocationCoordSystem : EMcPointCoordSystem,
		    bLocationRelativeToDTM? : boolean, uTerrainObjectsConsiderationBitField? : number) : IMcObjectScheme;
        function SetIgnoreUpdatingNonExistentProperty(bIgnore : boolean) : void;
        function GetIgnoreUpdatingNonExistentProperty() : boolean;
        function SaveSchemeComponentInterface(eComponentKind: IMcObjectScheme.ESchemeComponentKind, uComponentType : number, strJsonFileName : string) : void;
        function SaveSchemeComponentInterface(eComponentKind: IMcObjectScheme.ESchemeComponentKind, uComponentType : number) : Uint8Array;
        enum ETerrainObjectsConsiderationFlags {
            ETOCF_NONE, 
            ETOCF_STATIC_OBJECTS_LAYER
        }
        enum ESchemeComponentKind {
            ESCK_OBJECT_SCHEME_NODE,
            ESCK_CONDITIONAL_SELECTOR,
            ESCK_FONT,
            ESCK_MESH,
            ESCK_TEXTURE,
            ESCK_ENUMERATION
        }
        class SObjectStateModifier {
            constructor();
            pConditionalSelector : IMcConditionalSelector;
            bActionOnResult : boolean;
            uObjectState : number;
        }
    }

    interface IMcObjectSchemeItem extends IMcObjectSchemeNode {
        Clone(pObject? : IMcObject) : IMcObjectSchemeItem;
        Disconnect() : void;
        SetDetectibility(bDetectibility : boolean) : void;
        GetDetectibility() : boolean;
        SetHiddenIfViewportOverloaded(bHiddenIfViewportOverloaded : boolean) : void;
	    GetHiddenIfViewportOverloaded() : boolean;
	    SetBlockedTransparency(byTransparency : number,	uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID        puPropertyID.Value :      number
         */
        GetBlockedTransparency(puPropertyID? : any, uObjectStateToServe? : number) : number;
		SetParticipationInSightQueries(bParticipates : boolean) : void;
	    GetParticipationInSightQueries() : boolean;

    }
    namespace IMcObjectSchemeItem {
        enum EItemSubTypeFlags {
            EISTF_WORLD, 
            EISTF_SCREEN, 
            EISTF_ATTACHED_TO_TERRAIN, 
            EISTF_ACCURATE_3D_SCREEN_WIDTH
        }
        enum EGeometryType {
            EGT_GEOMETRIC_IN_OVERLAY_MANAGER, 
            EGT_GEOMETRIC_IN_VIEWPORT,
            EGT_GEOGRAPHIC
        }
        enum EEllipseDefinition {
            EED_ELLIPSE_CENTER_RADIUSES_ANGLES, 
            EED_CIRCLE_CENTER_RADIUS_ANGLES, 
            EED_CIRCLE_CENTER_POINT_ANGLES, 
            EED_CIRCLE_START_POINT_CENTER_END_POINT
        }
    }

    interface IMcObjectSchemeNode extends IMcBase {
        GetNodeKind() : IMcObjectSchemeNode.ENodeKindFlags;
        GetNodeType() : number;
        GetGeometryCoordinateSystem(pObject? : IMcObject) : EMcPointCoordSystem;
        GetScheme() : IMcObjectScheme;
        GetParents() : IMcObjectSchemeNode[];
        GetChildren() : IMcObjectSchemeNode[];
        GetCoordinates(pMapViewport : IMcMapViewport, eCoordinateSystem : EMcPointCoordSystem, pObject : IMcObject) : SMcVector3D[];
        GetWorldBoundingBox(pMapViewport : IMcMapViewport,pObject : IMcObject) : SMcBox;
        GetScreenBoundingRect(pMapViewport : IMcMapViewport,pObject : IMcObject) : SMcBox;
        SetID(uID : number) : void;
        GetID() : number;
        SetName(strName : string) : void;
        GetName() : string;
        SetUserData(pUserData : IMcUserData) : void;
        GetUserData() : IMcUserData;
        SetVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, uPropertyID? : number,	uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID            puPropertyID.Value :  number
         */
        GetVisibilityOption(puPropertyID? : any, uObjectStateToServe? : number) : IMcConditionalSelector.EActionOptions;
        GetEffectiveVisibilityInViewport(pObject : IMcObject, pMapViewport : IMcMapViewport) : boolean;
        SetTransformOption(eTransform : IMcConditionalSelector.EActionOptions, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param puPropertyID           puPropertyID.Value : number
         */
        GetTransformOption(puPropertyID? : any, uObjectStateToServe? : number) : IMcConditionalSelector.EActionOptions;
        SetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, bActionOnResult : boolean,
		    pSelector : IMcConditionalSelector, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
         * @param pbActionOnResult        pbActionOnResult.Value :  boolean
         * @param ppSelector              ppSelector.Value :        IMcConditionalSelector
         * @param puPropertyID            puPropertyID.Value :      number
         */
        GetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, pbActionOnResult : any,
		    ppSelector : any, puPropertyID? : any, uObjectStateToServe? : number) : void;

    }
    namespace IMcObjectSchemeNode {
        enum ENodeKindFlags {
            ENKF_NONE, 
            ENKF_OBJECT_LOCATION, 
            ENKF_PHYSICAL_ITEM, 
            ENKF_SYMBOLIC_ITEM, 
            ENKF_ANY_ITEM, 
            ENKF_ANY_NODE
        }
    }

    interface IMcOverlay extends IMcBase {
            Remove() : void;
            /**
             * @param peStorageFormat       puVersion.Value :  IMcOverlayManager::EStorageFormat
             * @param puVersion             puVersion.Value :  number
             */
            LoadObjectsFromFile(strFileName : string, pUserDataFactory? : IMcUserDataFactory, peStorageFormat? : any, puVersion? : any) : IMcObject[];
            /**
             * @param peStorageFormat       puVersion.Value :  IMcOverlayManager::EStorageFormat
             * @param puVersion             puVersion.Value :  number
             */
            LoadObjects(abMemoryBuffer : Uint8Array, pUserDataFactory? : IMcUserDataFactory, peStorageFormat? : any, puVersion? : any) : IMcObject[];
	        SaveAllObjects(eStorageFormat? : IMcOverlayManager.EStorageFormat, eVersion? : IMcOverlayManager.ESavingVersionCompatibility ) : Uint8Array;
            SaveObjects(pObjects : IMcObject[], eStorageFormat? : IMcOverlayManager.EStorageFormat, eVersion? : IMcOverlayManager.ESavingVersionCompatibility) : Uint8Array;
            /**
             * @param paAdditionalFiles          array created by the user, allocated and filled by MapCore
             */
            SaveAllObjectsAsRawVectorDataToFile(pMapViewport : IMcMapViewport, fCameraYawAngle : number, fCameraScale : number, strLayerName : string, strFileName : string, paAdditionalFiles : string[], pAsyncCallback? : IMcOverlayManager.IAsyncOperationCallback, eGeometryFilter? : EGeometry) : void;
            /**
             * @param pauFileMemoryBuffer        pauFileMemoryBuffer.Value :    Uint8Array
             * @param paAdditionalFiles          array created by the user, allocated and filled by MapCore
             */
            SaveAllObjectsAsRawVectorData(pMapViewport : IMcMapViewport, fCameraYawAngle : number, fCameraScale : number, strLayerName : string, strFileName : string, pauFileMemoryBuffer : any, paAdditionalFiles : SMcFileInMemory[], pAsyncCallback? : IMcOverlayManager.IAsyncOperationCallback, eGeometryFilter? : EGeometry) : void;
            /**
             * @param paAdditionalFiles          array created by the user, allocated and filled by MapCore
             */
            SaveObjectsAsRawVectorDataToFile(apObjects : IMcObject[], pMapViewport : IMcMapViewport, fCameraYawAngle : number, fCameraScale : number, strLayerName : string, strFileName : string, paAdditionalFiles : string[], pAsyncCallback? : IMcOverlayManager.IAsyncOperationCallback, eGeometryFilter? : EGeometry) : void;
            /**
             * @param pauFileMemoryBuffer        pauFileMemoryBuffer.Value :    Uint8Array
             * @param paAdditionalFiles          array created by the user, allocated and filled by MapCore
             */
            SaveObjectsAsRawVectorData(apObjects : IMcObject[], pMapViewport : IMcMapViewport, fCameraYawAngle : number, fCameraScale : number, strLayerName : string, strFileName : string, pauFileMemoryBuffer : any, paAdditionalFiles : SMcFileInMemory[], pAsyncCallback? : IMcOverlayManager.IAsyncOperationCallback, eGeometryFilter? : EGeometry) : void;
            CancelAsyncSavingObjects(pAsyncCallback : IMcOverlayManager.IAsyncOperationCallback) : void;
            LoadObjectsFromRawVectorData(Params : IMcRawVectorMapLayer.SParams, pAsyncCallback? : IMcOverlayManager.IAsyncOperationCallback, bClearObjectSchemesCache? : boolean)  : IMcObject[];
            GetObjectByID(uObjectID : number) : IMcObject;
	        GetObjects() : IMcObject[];
             /**
             * @param aProperties            array of fixed size IMcOverlay.EColorPropertyType.ECPT_NUM
             */
            SetColorOverriding(aProperties : IMcOverlay.SColorPropertyOverriding[], pMapViewport? : IMcMapViewport) : void;
            GetColorOverriding(pMapViewport? : IMcMapViewport): IMcOverlay.SColorPropertyOverriding[];
            GetOverlayManager() : IMcOverlayManager;
            GetCollections() : IMcCollection[];
            SetState(StateOrStatesArray : number | Uint8Array, pMapViewport? : IMcMapViewport) : void;
            GetState(pMapViewport? : IMcMapViewport) : Uint8Array;
            SetID(uID : number) : void;
	        GetID() : number;
            SetUserData(pUserData : IMcUserData) : void;
            GetUserData() : IMcUserData;
            SetDrawPriority(nPriority : number, pMapViewport? : IMcMapViewport) : void;
            GetDrawPriority(pMapViewport : IMcMapViewport) : number;
            SetVisibilityOption(eVisibility : IMcConditionalSelector.EActionOptions, MapViewportOrArray? : IMcMapViewport | IMcMapViewport[]) : void;
            GetVisibilityOption(pMapViewport? : IMcMapViewport) : IMcConditionalSelector.EActionOptions;
            GetEffectiveVisibilityInViewport(pMapViewport : IMcMapViewport) : boolean;
            SetConditionalSelector(eActionType : IMcConditionalSelector.EActionType, bActionOnResult : boolean, pSelector : IMcConditionalSelector) : void;
             /**
             * @param pbActionOnResult      pbActionOnResult.Value :  boolean
             * @param ppSelector            ppSelector.Value :        IMcConditionalSelector
             */
            GetConditionalSelector(eActionType : IMcConditionalSelector.EActionType , pbActionOnResult : any, ppSelector : any) : void;
	        SetSubItemsVisibility(auSubItemsIDs : Uint32Array, bVisibility : boolean, pMapViewport? : IMcMapViewport) : void;
            /**
             * @param bVisibility        bVisibility.Value :    boolean
             */
            GetSubItemsVisibility(bVisibility : any, pMapViewport? : IMcMapViewport) : Uint32Array;
            SetDetectibility(bDetectibility : boolean, pMapViewport? : IMcMapViewport) : void;
            GetDetectibility(pMapViewport : IMcMapViewport) : boolean;
        }
    namespace IMcOverlay {
        function Create(overlayManager : IMcOverlayManager, bForInternalUse? : boolean) : IMcOverlay;
        enum EColorComponentFlags {
            ECCF_NONE, 
            ECCF_REPLACE_RGB, 
            ECCF_REPLACE_ALPHA, 
            ECCF_ADD_RGB, 
            ECCF_SUB_RGB,
            ECCF_ADD_ALPHA, 
            ECCF_SUB_ALPHA, 
            ECCF_MODULATE_RGB, 
            ECCF_MODULATE_ALPHA, 
            ECCF_POSTPROCESS_ADD_RGB,
            ECCF_POSTPROCESS_SUB_RGB, 
            ECCF_RGB_FLAGS, 
            ECCF_ALPHA_FLAGS
        }

        enum EColorPropertyType {
            ECPT_LINE, 
            ECPT_FILL, 
            ECPT_TEXT, 
            ECPT_TEXT_BACKGROUND, 
            ECPT_PICTURE,
            ECPT_SIGHT_SEEN,
            ECPT_SIGHT_UNSEEN,
            ECPT_SIGHT_UNKNOWN,
            ECPT_SIGHT_OUT_OF_QUERY_AREA,
            ECPT_SIGHT_SEEN_STATIC_OBJECT,
            ECPT_SIGHT_ASYNC_CALCULATING,
            ECPT_TRAVERSABILITY_TRAVERSABLE,
            ECPT_TRAVERSABILITY_UNTRAVERSABLE,
            ECPT_TRAVERSABILITY_UNKNOWN,
            ECPT_TRAVERSABILITY_ASYNC_CALCULATING,
            ECPT_LINE_OUTLINE, 
            ECPT_TEXT_OUTLINE, 
            ECPT_MANUAL_GEOMETRY, 
            ECPT_TEXT_BACKGROUND_BORDER,
            ECPT_NUM
        }

        class SColorPropertyOverriding {
            constructor();
            Color : SMcBColor;
            uColorComponentsBitField : number;
            bEnabled : boolean;
          }
    }

    interface IMcOverlayManager extends IMcBase {
        	GetViewportsIDs() : Uint8Array;
    	    GetOverlayByID(uOverlayID : number) : IMcOverlay;
	        GetOverlays() : IMcOverlay[];
	        GetCollections() : IMcCollection[];
	        SetCollectionsMode(eCollectionsMode : IMcOverlayManager.ECollectionsMode, pMapViewport? : IMcMapViewport) : void;
	        GetCollectionsMode(pMapViewport? : IMcMapViewport) : IMcOverlayManager.ECollectionsMode;
	        SetObjectSchemeLock(pObjectScheme : IMcObjectScheme, bLocked : boolean) : void;
	        IsObjectSchemeLocked(pObjectScheme : IMcObjectScheme) : boolean;
	        GetObjectSchemeByID(uObjectSchemeID : number) : IMcObjectScheme;
            GetObjectSchemeByName(strObjectSchemeName : string) : IMcObjectScheme;
            GetObjectSchemes() : IMcObjectScheme[];
	        SaveAllObjectSchemes(eStorageFormat? : IMcOverlayManager.EStorageFormat, eVersion? : IMcOverlayManager.ESavingVersionCompatibility) : Uint8Array;
            SaveObjectSchemes(pSchemes : IMcObjectScheme[], eStorageFormat? : IMcOverlayManager.EStorageFormat, 
                eVersion?: IMcOverlayManager.ESavingVersionCompatibility) : Uint8Array;
            /** 
            * @param pbObjectDataDetected           pbObjectDataDetected.Value :         boolean
            * @param peStorageFormat                peStorageFormat.Value :  IMcOverlayManager::EStorageFormat
            * @param puVersion                      puVersion.Value :  number
            */
            LoadObjectSchemesFromFile(strFileName : string, pUserDataFactory? : IMcUserDataFactory, pbObjectDataDetected? : any, peStorageFormat? : any, puVersion? : any) : IMcObjectScheme[];
            /** 
            * @param pbObjectDataDetected           pbObjectDataDetected.Value :         boolean
            * @param peStorageFormat                peStorageFormat.Value :  IMcOverlayManager::EStorageFormat
            * @param puVersion                      puVersion.Value :  number
            */
			LoadObjectSchemes(abMemoryBuffer : Uint8Array, pUserDataFactory? : IMcUserDataFactory, pbObjectDataDetected? : any, peStorageFormat? : any, puVersion? : any) : IMcObjectScheme[];
            SetConditionalSelectorLock(pSelector: IMcConditionalSelector, bLocked: boolean) : void;
            IsConditionalSelectorLocked(pSelector: IMcConditionalSelector): boolean;
            GetConditionalSelectorByID(uSelectorID: number): IMcConditionalSelector;
            GetConditionalSelectorByName(strSelectorName: string): IMcConditionalSelector;
            GetConditionalSelectors(): IMcConditionalSelector[];
           	SetItemSizeFactors(eSizeTypesBitField : number, fSizeFactor : number, pMapViewport? : IMcMapViewport, bVectorItems? : boolean) : void;
	        GetItemSizeFactor(eSizeType : IMcOverlayManager.ESizePropertyType, pMapViewport? : IMcMapViewport, bVectorItems? : boolean) : number;
            SetScaleFactor(fScaleFactor: number, pMapViewport?: IMcMapViewport) : void;
            GetScaleFactor(pMapViewport?: IMcMapViewport): number;
            SetState(StateOrStatesArray : number | Uint8Array, pMapViewport? : IMcMapViewport) : void;
            GetState(pMapViewport? : IMcMapViewport) : Uint8Array;
           	SetScreenArrangement(pMapViewport : IMcMapViewport, apObjects : IMcObject[]) : void;
	        CancelScreenArrangements(pMapViewport : IMcMapViewport) : void;
            SetEquidistantAttachPointsMinScale(fMinScale : number, pMapViewport? : IMcMapViewport) : void;
            GetEquidistantAttachPointsMinScale(pMapViewport? :  IMcMapViewport) : number;
            SetScreenTerrainItemsConsistencyScaleSteps(afScaleSteps: Float32Array, pMapViewport? : IMcMapViewport) : void;
            GetScreenTerrainItemsConsistencyScaleSteps(pMapViewport? : IMcMapViewport): Float32Array;
            SetCancelScaleMode(uModeBitField : number, pMapViewport? : IMcMapViewport) : void;
	        GetCancelScaleMode(pMapViewport? : IMcMapViewport) : number;
            SetMoveIfBlockedMode(bMoveIfBlocked : boolean , pMapViewport? : IMcMapViewport) : void;
            GetMoveIfBlockedMode(pMapViewport? : IMcMapViewport) : boolean;
            SetBlockedTransparencyMode(bBlockedTransparency : boolean, pMapViewport? : IMcMapViewport) : void;
            GetBlockedTransparencyMode(pMapViewport? : IMcMapViewport) : boolean;
            SetTopMostMode(bTopMost : boolean, pMapViewport? : IMcMapViewport) : void;
            GetTopMostMode(pMapViewport? : IMcMapViewport) : boolean;
            SetCollisionPreventionMode(bCollisionPrevention : boolean, pMapViewport? : IMcMapViewport) : void;
            GetCollisionPreventionMode(pMapViewport? : IMcMapViewport) : boolean;
            GetCoordinateSystemDefinition() : IMcGridCoordinateSystem;
            /**
            * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode  
            */
            ConvertWorldToImage(WorldPoints : SMcVector3D, pImageCalc : IMcImageCalc, peIntersectionStatus? : any) : SMcVector3D;
            /**
            * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode  
            */
            ConvertImageToWorld(ImagePoints : SMcVector3D, pImageCalc : IMcImageCalc, peIntersectionStatus? : any, pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : SMcVector3D;
            InitializeSymbologyStandardSupport(eSymbologyStandard : IMcObject.ESymbologyStandard, bShowGeoInMetricProportion : boolean, bIgnoreNonExistentAmplifiers? : boolean) : void;
            /**
             * @param paGeometricAmplifiers     array created by the user, allocated and filled by MapCore
             * @param pastrAmplifiers           array created by the user, allocated and filled by MapCore
            */
            GetSymbologyStandardNames(eSymbologyStandard : IMcObject.ESymbologyStandard, strSymbolID : string, paGeometricAmplifiers : IMcObject.SMultiKeyName[], pastrAmplifiers : string[]) : void;

    }
    namespace IMcOverlayManager {
        function Create(pCoordinateSystem : IMcGridCoordinateSystem) : IMcOverlayManager;
        enum ESavingVersionCompatibility {
            ESVC_7_6_1,	
            ESVC_7_7_3,	
            ESVC_7_7_7,	
            ESVC_7_7_8,	
            ESVC_7_7_9,	
            ESVC_7_7_10,
            ESVC_7_7_11,
            ESVC_7_8_1,	
            ESVC_7_8_2,	
            ESVC_7_8_3,	
            ESVC_7_8_4,	
            ESVC_7_9_0,	
            ESVC_7_9_1,	
            ESVC_7_9_3,	
            ESVC_7_9_4,	
            ESVC_7_9_5,
            ESVC_7_9_6,
            ESVC_7_9_7,
            ESVC_7_10_0,
            ESVC_7_11_2,
            ESVC_7_11_3,
            ESVC_7_11_4,
            ESVC_7_11_5,
            ESVC_7_11_6,
            ESVC_7_11_7,
            ESVC_7_11_8,
            ESVC_7_11_10,
            ESVC_7_11_11,
            ESVC_12_1_4,
            ESVC_12_2_0,
            ESVC_12_3_0,
            ESVC_LATEST
        }
        enum EStorageFormat {
            ESF_MAPCORE_BINARY, 
            ESF_JSON,
            ESF_JSON_FULL
        }
        enum ECollectionsMode {
            ECM_OR,
            ECM_AND
        }
        enum ESizePropertyType {
            ESPT_LINE_WIDTH, 
            ESPT_LINE_OUTLINE_WIDTH, 
            ESPT_TEXT_SCALE, 
            ESPT_TEXT_OUTLINE_WIDTH, 
            ESPT_TEXT_MARGIN,
            ESPT_PICTURE_SIZE,
            ESPT_FILL_TEXTURE_SCALE,
            ESPT_ARROW, ESPT_ELLIPSE_ARC_RADIUS,
            ESPT_RECTANGLE_RADIUS, 
            ESPT_LINE_EXPANSION_RADIUS,
            ESPT_MANUAL_GEOMETRY, 
            ESPT_OFFSET, 
            ESPT_EQUIDISTANT_DISTANCE, 
            ESPT_TEXT_BKG_BORDER_WIDTH,
            ESPT_TEXT_MAX_WIDTH,
            ESPT_ALL_LINE, 
            ESPT_ALL_TEXT, 
            ESPT_ALL_RADIUS, 
            ESPT_ALL
        }
        interface IAsyncOperationCallback {
            /** Optional */
            OnSaveObjectsAsRawVectorToFileResult(strFileName : string, eStatus : IMcErrors.ECode, aAdditionalFiles : string[]) : void;
            /** Optional */
            OnSaveObjectsAsRawVectorToBufferResult(strFileName : string, eStatus : IMcErrors.ECode, auFileMemoryBuffer : Uint8Array, aAdditionalFiles : SMcFileInMemory[]) : void;
            /** Optional */
            OnLoadObjectsFromRawVectorDataResult(strDataSource : string, eStatus : IMcErrors.ECode, apLoadedObjects : IMcObject[]) : void;
        }
        namespace IAsyncOperationCallback {
            function extend(strName : string, Class : any) : IAsyncOperationCallback;
        }
    }

    interface IMcPhysicalItem extends IMcObjectSchemeItem {
        Clone(pObject? : IMcObject) : IMcPhysicalItem;
        /**
         * @param peErrorStatus      peErrorStatus.Value : IMcErrors.ECode
         */
        Connect(pParentNode : IMcObjectSchemeNode, peErrorStatus? : any) : void;
        SetAttachPoint(uAttachPoint : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puAttachPoint   puAttachPoint.Value :  number
        * @param puPropertyID    puPropertyID.Value :   number 
        */
        GetAttachPoint(puAttachPoint : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetOffset(Offset : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param pOffset         pOffset.Value :        SMcFVector3D
        * @param puPropertyID    puPropertyID.Value :   number 
        */
        GetOffset(pOffset : SMcFVector3D, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetRotation(Rotation : SMcRotation, uPropertyID? : number) : void;
        /**
        * @param puPropertyID      puPropertyID.Value :   number 
        */
        GetRotation(puPropertyID? : any) : SMcRotation;
        GetCurrRotation(pMapViewport : IMcMapViewport, pObject : IMcObject, bRelativeToParentRotation : boolean) : SMcRotation;
        SetInheritsParentRotation(bInheritsParentRotation : boolean, uPropertyID? : number) : void;
        /**
        * @param puPropertyID      puPropertyID.Value :   number 
        */
        GetInheritsParentRotation(puPropertyID? : any) : boolean;
        SetColorModulateEffect(pObject : IMcObject, Color : SMcFColor, fFadeTimeMS : number) : void;
        /**
        * @param pbEnabled         pbEnabled.Value :    boolean 
        * @param pColor            pColor.Value :       SMcFColor 
        * @param pfFadeTimeMS      pfFadeTimeMS.Value : number 
        */
        GetColorModulateEffect(pObject : IMcObject, pbEnabled : boolean, pColor : any, pfFadeTimeMS : any) : void;
        RemoveColorModulateEffect(pObject : IMcObject) : void;
        SetWireFrameEffect(pObject : IMcObject, Color : SMcFColor, fFadeTimeMS : number, bWireFrameOnly : boolean) : void;
        /**
        * @param pbEnabled            pbEnabled.Value :         boolean 
        * @param pColor               pColor.Value :            SMcFColor 
        * @param pfFadeTimeMS         pfFadeTimeMS.Value :      number 
        * @param pbWireFrameOnly      pbWireFrameOnly.Value :   boolean 
        */
        GetWireFrameEffect(pObject : IMcObject, pbEnabled : any, pColor : any, pfFadeTimeMS : any, pbWireFrameOnly : any) : void;
        RemoveWireFrameEffect(pObject : IMcObject) : void;
    }  
    namespace IMcPhysicalItem {
        function GetCurrRotation(pMapViewport : IMcMapViewport, uPropertyID : number, pObject : IMcObject, bRelativeToParentRotation : boolean) : SMcRotation;
    }

    interface IMcEmptyPhysicalItem extends IMcPhysicalItem {
        Clone(pObject? : IMcObject): IMcEmptyPhysicalItem;
    }
    namespace IMcEmptyPhysicalItem {
        function Create() : IMcEmptyPhysicalItem;
        var NODE_TYPE: number;
    }
    
    interface IMcLightBasedItem extends IMcPhysicalItem {
        SetDiffuseColor(DiffuseColor : SMcFColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID      puPropertyID.Value :   number 
        */
        GetDiffuseColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcFColor;
        SetSpecularColor(DiffuseColor : SMcFColor, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID      puPropertyID.Value :   number 
        */
        GetSpecularColor(puPropertyID? : any, uObjectStateToServe? : number) : SMcFColor;
    }

    interface IMcLocationBasedLightItem extends IMcLightBasedItem {
        SetAttenuation(Attenuation : SMcAttenuation, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID      puPropertyID.Value :   number 
        */
        GetAttenuation(puPropertyID? : any, uObjectStateToServe? : number) : SMcAttenuation;
    }

    interface IMcParticleEffectItem extends IMcPhysicalItem {
        Clone(pObject? : IMcObject) : IMcParticleEffectItem;
        SetEffectName(strEffectName : string, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param pstrEffectName         pstrEffectName.Value : string
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetEffectName(pstrEffectName : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetState(eState : IMcParticleEffectItem.EState,	uPropertyID ? : number,	uObjectStateToServe ? : number) : void;
        /**
        * @param peState                peState.Value :        IMcParticleEffectItem.EState
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetState(peState : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetStartingTimePoint(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetStartingTimePoint(pfSeconds : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetStartingDelay(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetStartingDelay(pfSeconds : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetSamplingStep(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetSamplingStep(pfSeconds : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetTimeFactor(fFactor : number, uPropertyID : number, uObjectStateToServe? : number) : void;
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetTimeFactor(pfFactor : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetParticleVelocity(fVelocity : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param pfVelocity             pfVelocity.Value :     number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetParticleVelocity(pfVelocity : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetParticleDirection(Direction : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param pDirection             pDirection.Value :     SMcFVector3D
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetParticleDirection(pDirection : any, puPropertyID? : number, uObjectStateToServe? : number) : void;
        SetParticleAngle(fAngleDegrees : number, uPropertyID? : number,	uObjectStateToServe? : number) : void;
        /**
        * @param pfAngleDegrees         pDirection.Value :     number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetParticleAngle(pfAngleDegrees : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetParticleEmissionRate(fEmissionRate : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param pfEmissionRate         pfEmissionRate.Value : number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetParticleEmissionRate(pfEmissionRate : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetTimeToLive(fSeconds : number, uPropertyID? : number,	uObjectStateToServe? : number) : void;
        /**
        * @param pfSeconds              pfSeconds.Value :      number
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetTimeToLive(pfSeconds : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
    }
     namespace IMcParticleEffectItem {
        function Create(strEffectName : string) : IMcParticleEffectItem;
        enum EState {
            ES_STOPPED, 
            ES_RUNNING, 
            ES_PAUSED
        }
         var NODE_TYPE: number;
    }

     interface IMcMeshItem extends IMcPhysicalItem {
        Clone(pObject? : IMcObject) : IMcMeshItem;
        SetMesh(pMesh : IMcMesh, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetMesh(puPropertyID? : any, uObjectStateToServe? : number) : IMcMesh;
        SetAnimation(Animation : SMcAnimation, uPropertyID? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetAnimation(puPropertyID? : any) : SMcAnimation;
	    GetAnimationStates(pObject : IMcObject) : IMcAnimationState[];
        SetCastShadows(bCastShadows : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param pbCastShadows          pbCastShadows.Value :  bool
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetCastShadows(pbCastShadows : any, puPropertyID? : any, uObjectStateToServe? : number) : void;
        SetSubPartOffset(uAttachPointID : number, Offset : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetSubPartOffset(uAttachPointID: number, puPropertyID?: any, uObjectStateToServe?: number) : SMcFVector3D;
        SetSubPartRotation(uAttachPointID : number, Rotation : SMcRotation, uPropertyID? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetSubPartRotation(uAttachPointID : number, puPropertyID? : any): SMcRotation;
        GetSubPartCurrRotation(pMapViewport : IMcMapViewport, pObject : IMcObject, uAttachPointID : number, bRelativeToMeshRotation : boolean) : SMcRotation;
        SetSubPartInheritsParentRotation(uAttachPointID : number, bInheritsParentRotation : boolean, uPropertyID? : number) : void;
        /**
        * @param puPropertyID               puPropertyID.Value :                number 
        */
        GetSubPartInheritsParentRotation(uAttachPointID : number, puPropertyID? : any) : boolean;
        SetTextureScrollSpeed(uMeshTextureID : number, ScrollSpeed :  SMcFVector2D, uPropertyID? :number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID               puPropertyID.Value :    number 
        */
        GetTextureScrollSpeed(uMeshTextureID : number, puPropertyID?: any, uObjectStateToServe? : number) : SMcFVector2D;
        SetBasePointAlignment(eBasePointAlignment : IMcMeshItem.EBasePointAlignment, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID               puPropertyID.Value :           number 
        */
        GetBasePointAlignment(puPropertyID? : any, uObjectStateToServe? : number) : IMcMeshItem.EBasePointAlignment;
        GetParticipationInTerrainHeight() : boolean;
        GetStatic() : boolean;
        GetDisplayingItemsAttachedToTerrain() : boolean;
    }    
    namespace IMcMeshItem {
        function Create(pMesh : IMcMesh, eBasePointAlignment? : IMcMeshItem.EBasePointAlignment, bParticipateInTerrainHeight? : boolean,
		    bCastShadows? : boolean, bStatic? : boolean, bDisplayItemsAttachedToTerrain? : boolean) : IMcMeshItem;
        function GetSubPartCurrRotation(pMapViewport : IMcMapViewport, uPropertyID : number, pObject : IMcObject, bRelativeToMeshRotation : boolean) : SMcRotation;

        enum EBasePointAlignment {
            EBPA_MESH_ZERO, 
            EBPA_MESH_ZERO_LOWERED, 
            EBPA_BOUNDING_BOX_CENTER, 
            EBPA_BOUNDING_BOX_CENTER_LOWERED
        }
        var NODE_TYPE: number;
    }

     interface IMcProjectorItem extends IMcPhysicalItem {
         Clone(pObject? : IMcObject) : IMcProjectorItem;
         SetTexture(pTexture : IMcTexture, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetTexture(puPropertyID? : any, uObjectStateToServe? : number) : IMcTexture;
         IsUsingTextureMetadata() : boolean;
         SetFieldOfView(fHalfFieldOfViewHorizAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetFieldOfView(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetAspectRatio(fAspectRatio : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetAspectRatio(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetTargetTypes(uTargetTypesBitField : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetTargetTypes(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetProjectionBorders(fLeft : number, fTop : number, fRight : number, fBottom : number) : void;
         /**
         * @param pfLeft           pfLeft.Value :   number 
         * @param pfTop            pfTop.Value :    number 
         * @param pfRight          pfRight.Value :  number 
         * @param pfBottom         pfBottom.Value : number 
         */
         GetProjectionBorders(pfLeft : any, pfTop : any, pfRight : any, pfBottom : any) : void;
     }
     namespace IMcProjectorItem {
         function Create(pDefaultTexture : IMcTexture, fDefaultHalfFieldOfViewHorizAngle : number, fDefaultAspectRatio : number, uDefaultTargetTypesBitField? : number, bUseVideoTextureMetadata? : boolean) : IMcProjectorItem;
         enum ETargetTypesFlags {
            ETTF_NONE, ETTF_DTM, 
            ETTF_STATIC_OBJECTS, 
            ETTF_MESHES, 
            ETTF_TERRAIN_OBJECTS,
            ETTF_UNBLOCKED_ONLY
         }
         var NODE_TYPE: number;
     }

     interface IMcSoundItem extends IMcPhysicalItem {
         Clone(pObject? : IMcObject) : IMcSoundItem;
         SetSoundName(strSoundName : string, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetSoundName(puPropertyID? : any, uObjectStateToServe? : number ) : string;
         SetState(eState : IMcSoundItem.EState, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetState(puPropertyID? : any, uObjectStateToServe? : number) : IMcSoundItem.EState;
         SetStartingTimePoint(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetStartingTimePoint(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetTimePoint(fSeconds : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetTimePoint(puPropertyID? : any, uObjectStateToServe? : number) : number;
         GetCurrTimePoint(pMapViewport : IMcMapViewport, pObject : IMcObject) : number;
         SetLoop(bLoop : boolean, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetLoop(puPropertyID? : any, uObjectStateToServe? : number) : boolean;
         SetVolume(fVolume : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetVolume(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetMinVolume(fMinVolume : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetMinVolume(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetMaxVolume(fMaxVolume : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetMaxVolume(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetRollOffFactor(fRollOffFactor : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetRollOffFactor(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetMaxDistance(fMaxDistance : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetMaxDistance(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetHalfVolumeDistance(fHalfVolumeDistance : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetHalfVolumeDistance(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetHalfOuterAngle(fHalfOuterAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
         GetHalfOuterAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
         SetHalfInnerAngle(fHalfInnerAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
         /**
         * @param puPropertyID           puPropertyID.Value :   number 
         */
        GetHalfInnerAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetOuterAngleVolume(fOuterAngleVolume : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetOuterAngleVolume(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetVelocity(Velocity : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetVelocity(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector3D;
        SetPitch(fPitch : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetPitch(puPropertyID? : any, uObjectStateToServe? : number) : number;
     }
     namespace IMcSoundItem {
         function Create(strSoundName : string) : IMcSoundItem;
         function GetCurrTimePoint(pMapViewport : IMcMapViewport, uPropertyID : number, pObject : IMcObject) : number;
         enum EState {
             ES_STOPPED, 
             ES_RUNNING, 
             ES_PAUSED, 
             ES_FADE_IN, 
             ES_FADE_OUT
         }
         var NODE_TYPE: number;
     }

    interface IMcPointLightItem extends IMcLocationBasedLightItem {
        Clone(pObject? : IMcObject) : IMcPointLightItem;
    }
    namespace IMcPointLightItem {
        function Create(DefaultDiffusColor? : SMcFColor, DefaultSpecularColor? : SMcFColor, DefaultAttenuation? : SMcAttenuation) : IMcPointLightItem;
        var NODE_TYPE: number;
    }

    interface IMcSpotLightItem extends IMcLocationBasedLightItem {
        Clone(pObject? : IMcObject) : IMcSpotLightItem;
        SetDirection(Direction : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetDirection(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector3D;
        SetHalfOuterAngle(fHalfOuterAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetHalfOuterAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
        SetHalfInnerAngle(fHalfInnerAngle : number, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetHalfInnerAngle(puPropertyID? : any, uObjectStateToServe? : number) : number;
    }
    namespace IMcSpotLightItem {
        function Create(DefaultDiffusColor? : SMcFColor, DefaultSpecularColor? : SMcFColor, DefaultAttenuation? : SMcAttenuation, 
            DefaultDirection? : SMcFVector3D, fDefaultHalfOuterAngle? : number, fDefaultHalfInnerAngle? : number) : IMcSpotLightItem;
        var NODE_TYPE: number;
    }

    interface IMcDirectionalLightItem extends IMcLightBasedItem {
        Clone(pObject? : IMcObject) : IMcDirectionalLightItem;
        SetDirection(Direction : SMcFVector3D, uPropertyID? : number, uObjectStateToServe? : number) : void;
        /**
        * @param puPropertyID           puPropertyID.Value :   number 
        */
        GetDirection(puPropertyID? : any, uObjectStateToServe? : number) : SMcFVector3D;
    }
    namespace IMcDirectionalLightItem {
        function Create(DefaultDiffusColor? : SMcFColor, DefaultSpecularColor? : SMcFColor, DefaultDirection? : SMcFVector3D) : IMcDirectionalLightItem;
        var NODE_TYPE: number;
    }

    interface IMcAnimationState extends IMcBase {
        Remove() : void;
        AttachToAnimation(strAnimationName : string, bLoop? : boolean, fTimePoint? : number, fTimeDelay? : number, fSpeedFactor? : number, fWeight? : number, fLength? : number) : void;
        GetAttachedAnimation() : string;
        GetObject() : IMcObject;
	    GetMeshItem() : IMcMeshItem;
        SetEnabled(bEnabled : boolean) : void;
        GetEnabled() : boolean;
        SetTimePoint(fTimePoint : number) : void;
        GetTimePoint() : number;
        SetWeight(fWeight : number, fChangeDuration? : number) : void;
        GetWeight() : number;
        SetAttachPointsWeights(afWeights : Float32Array, fChangeDuration? : number) : void;
	    GetAttachPointsWeights() : Float32Array;
	    SetLength(fLength : number) : void;
        GetLength() : number;
        SetLoop(bLoop : boolean) : void;
        GetLoop() : boolean;
        SetSpeedFactor(fSpeedFactor : number) : void;
        GetSpeedFactor() : number;
	    HasEnded() : boolean;
    }
    namespace IMcAnimationState {
        function Create(pObject : IMcObject, MeshItemOrMeshID : IMcMeshItem | number, strAnimationName? : string,
		bLoop? : boolean, fTimePoint? : number, fTimeDelay? : number, fSpeedFactor? : number, fWeight? : number, fLength? : number) : IMcAnimationState;
    }

    interface IMcProperty  {}
    namespace IMcProperty {
        enum EPredefinedPropertyIDs {
            EPPI_FIRST_RESERVED_ID, 
            EPPI_SHARED_PROPERTY_ID, 
            EPPI_NO_STATE_PROPERTY_ID, 
            EPPI_NO_MORE_STATE_PROPERTIES_ID
        }

        enum EPropertyType {
            EPT_BOOL, 
            EPT_BYTE,
            EPT_INT, 
            EPT_UINT,
            EPT_FLOAT,
            EPT_DOUBLE,
            EPT_FVECTOR2D,
            EPT_VECTOR2D,
            EPT_FVECTOR3D,
            EPT_VECTOR3D,
            EPT_BCOLOR,
            EPT_FCOLOR,
            EPT_ATTENUATION,
            EPT_STRING,
            EPT_TEXTURE,
            EPT_FONT,
            EPT_MESH,
            EPT_CONDITIONALSELECTOR,
            EPT_ROTATION,
            EPT_ANIMATION,
            EPT_SUBITEM_ARRAY,
            EPT_INT_ARRAY,
            EPT_UINT_ARRAY,
            EPT_FVECTOR2D_ARRAY,
            EPT_VECTOR2D_ARRAY,
            EPT_FVECTOR3D_ARRAY,
            EPT_VECTOR3D_ARRAY,
            EPT_BCOLOR_ARRAY,
            EPT_MATRIX4D,
            EPT_SBYTE,
            EPT_ENUM,
            EPT_NUM
        }

        class SVariantProperty {
            constructor();
            strName : string;
            uID : number;
            eType : EPropertyType;
            Value : any;
        }

        class SPropertyNameIDType {
            constructor();
            strName : string;
            uID : number;
            eType : IMcProperty.EPropertyType;
        }

        class SPropertyNameID {
            constructor();
            constructor(NameOrID : string | number);
            strName : string;
            uID : number;
        }

        class SArrayPropertySubItemData {
            constructor();
            constructor(aElements : SMcSubItemData[]);
            aElements : any;
        }
        class SArrayPropertyInt {
            constructor();
            constructor(aElements : Int32Array);
            aElements : any;
        }
        class SArrayPropertyUInt {
            constructor();
            constructor(aElements : Uint32Array);
            aElements : any;
        }
        class SArrayPropertyFVector2D {
            constructor();
            constructor(aElements : SMcFVector2D[]);
            aElements : any;
        }
        class SArrayPropertyVector2D {
            constructor();
            constructor(aElements : SMcVector2D[]);
            aElements : any;
        }
        class SArrayPropertyFVector3D {
            constructor();
            constructor(aElements : SMcFVector3D[]);
            aElements : any;
        }
        class SArrayPropertyVector3D {
            constructor();
            constructor(aElements : SMcVector3D[]);
            aElements : any;
        }
        class SArrayPropertyBColor {
            constructor();
            constructor(aElements : SMcBColor[]);
            aElements : any;
        }
    }

////////////////////////////////////////////////////////////////////////////////////////
// Calculations

    interface IMcImageCalc extends IMcBase {
        GetSpatialQueries() : IMcSpatialQueries;
        /**
         * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode  
         */
        WorldCoordToImagePixel(WorldCoord : SMcVector3D, peIntersectionStatus? : any): SMcVector2D;
         /**
         * @param pbDTMAvailable              pbDTMAvailable.Value :        boolean 
         * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode 
         */
        ImagePixelToCoordWorld(ImagePixel : SMcVector2D, pbDTMAvailable? : any, peIntersectionStatus? : any, pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : SMcVector3D;
         /**
         * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode  
         */
        ImagePixelToCoordWorldOnHorzPlane(ImagePixel : SMcVector2D, dPlaneHeight : number, peIntersectionStatus? : any) : SMcVector3D;
        /**
         * @param pbDTMAvailable              pbDTMAvailable.Value :        boolean 
         * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode  
         */
        ImagePixelToCoordWorldWithCache(ImagePixel : SMcVector2D, pbDTMAvailable? : any, peIntersectionStatus? : any, pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : SMcVector3D;
        /**
         * @param peIntersectionStatus        peIntersectionStatus.Value :  IMcErrors.ECode  
         */
        WorldCoordToImagePixelWithCache(WorldCoord : SMcVector3D, peIntersectionStatus? : any) : SMcVector2D;
        /**
         * @param worldCoords                 worldCoords.Value :            SMcVector3D
         * @param successfulWorldCoords       successfulWorldCoords.Value :  boolean  
         */
        TwoImagesPixelsToWorldCoords(numberOfcorrelatedPixels : number, thisImagePixels : SMcVector2D[], otherImagePixels : SMcVector2D[], otherImageCalc : IMcImageCalc, worldCoords : SMcVector3D[], successfulWorldCoords : boolean[]) : void;
	    /**
         * @param pRayOrigin                pRayOrigin.Value :      SMcVector3D
         * @param pRayDirection             pRayDirection.Value :   SMcVector3D  
         */
        ImageToWorldRay(ImagePixel : SMcVector2D, pRayOrigin : any, pRayDirection : any) : void;
	    IsWorldCoordVisible(WorldCoord : SMcVector3D, pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : boolean;
	    CalcRPC(nPixelDensity : number) : IMcImageCalc.SRationalPolynomialCoefficients;
        CalculateHeightAboveGround(stGroundPixel : SMcVector2D, stUpperPixel : 	SMcVector2D) : number;
        CalculateBoxVolume(stBasePixel : SMcVector2D, stTopOfBasePixel : SMcVector2D, stTopPixel1 : SMcVector2D, stTopPixel2 : SMcVector2D) : number;
        GetHeight(x : number, y : number, pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : number;
        GetGeoImageFileName() : string;
        GetGridCoordSys() : IMcGridCoordinateSystem;
        GetLines() : number;
        GetSamples() : number;
        GetMinGSD() : number;
        GetMaxGSD() : number;
        GetWorkingAreaValid() : boolean;
        SetWorkingAreaValid(bWorkingAreaValid : boolean) : void;
	    SetWorkingArea(arrWorkingArea : SMcVector3D[]) : void;
        GetWorkingArea() : SMcVector3D
        IsInWorkingArea(WorldCoord : SMcVector3D) : boolean;
        GetPixelWorkingAreaValid () : boolean;
	    SetPixelWorkingAreaValid(bPixelWorkingAreaValid : boolean) : void;
	    SetPixelWorkingArea(PixelWorkingAreaUpperLeft : SMcVector2D, PixelWorkingAreaLowerRight : SMcVector2D) : void;
        /**
         * @param pPixelWorkingAreaUpperLeft            pPixelWorkingAreaUpperLeft.Value :      SMcVector2D
         * @param pPixelWorkingAreaLowerRight           pPixelWorkingAreaLowerRight.Value :     SMcVector2D  
         */
        GetPixelWorkingArea(pPixelWorkingAreaUpperLeft : any, pPixelWorkingAreaLowerRight : any) : void;
		IsInPixelWorkingArea(PixelCoord : SMcVector2D) : boolean;
        GetDefaultHeight() : number;
        SetDefaultHeight(height : number) : void;
        RegisterForImageCalcChanges(pImageCalcChange : IMcImageCalc.IImageCalcChangeCallBack) : void;
        UnregisterForImageCalcChanges(pImageCalcChange : IMcImageCalc.IImageCalcChangeCallBack) : void;

 }
    namespace IMcImageCalc {
        enum EImageType {
            EIT_NONE,		
            EIT_GALAXYAIDS,	
            EIT_LOROP,
            EIT_FRAME,		
            EIT_AFFINE,		
            EIT_ORTHO,	
            EIT_FRAME_MOSAIC,
            EIT_USER_DEFINED,
            EIT_NUM
        }
        class SRationalPolynomialCoefficients {
            dErrBias : number;					
            dErrRand : number;					
            adOffsets : Float64Array;				
            adScales : Float64Array;					
            adLineNumCoefficients : Float64Array;	
            adLineDenCoefficients : Float64Array;	
            adSampleNumCoefficients : Float64Array;	
            adSampleDenCoefficients : Float64Array;	
        }
        interface IImageCalcChangeCallBack {
            /** Mandatory */
            OnImageCalcChanged() : void;
            /** Optional */
            Release() : void;
        }
        namespace IImageCalcChangeCallBack {
            function extend(strName : string, Class : any) : IImageCalcChangeCallBack;
        }
    }

    interface IMcAffineImageCalc extends IMcImageCalc {
        GetImageType() : IMcImageCalc.EImageType;
    }
    namespace IMcAffineImageCalc {
        function Create(strImageDataFileName : string, DtmMapLayerOrMapTerrains : IMcDtmMapLayer | IMcMapTerrain[], pGridCoordinateSystem : IMcGridCoordinateSystem) : IMcAffineImageCalc;
    }

    interface IMcFrameIC extends IMcImageCalc {
            SetCameraParams(stParams : IMcFrameIC.SCameraParams) : void;
            GetCameraParams() : IMcFrameIC.SCameraParams;
            SetQueryMaxDistance(dMaxDistance : number) : void;
            GetQueryMaxDistance() : number;
            /**
             * @param arrCenterAndCorners     array created by the user, allocated and filled by MapCore
             * @param arrRayStatus            array created by the user, allocated and filled by MapCore
             */
            GetCameraCornersAndCenter(bCalcHorizon : boolean, arrCenterAndCorners : SMcVector3D[], arrRayStatus : IMcFrameImageCalc.ERayStatus[], 
                pAsyncQueryCallback? : IMcSpatialQueries.IAsyncQueryCallback) : void;
    }
    namespace IMcFrameIC {
        class SCameraParams {
            nPixelesNumX : number;
            nPixelesNumY : number;
            dCameraOpeningAngleX : number;
            dPixelRatio : number;			
            dCameraRoll : number;
            dCameraPitch : number;
            dCameraYaw : number;
            CameraPosition :SMcVector3D;
            dOffsetCenterPixelX : number;
            dOffsetCenterPixelY : number;
        }
    }

    interface IMcFrameImageCalc extends IMcFrameIC {
            GetImageType() : IMcImageCalc.EImageType;
              }
    namespace IMcFrameImageCalc {
        function Create(Params : IMcFrameIC.SCameraParams, DtmMapLayerOrMapTerrains : IMcDtmMapLayer | IMcMapTerrain[], pGridCoordinateSystem : IMcGridCoordinateSystem) : IMcFrameImageCalc;
        enum ERayStatus {
            ERS_Intersection,	
            ERS_HorizonPoint, 
            ERS_NoIntersection
        }
        class SCameraParams {
            constructor();
            nPixelesNumX : number;
            nPixelesNumY : number;
            dCameraOpeningAngleX : number;
            dPixelRatio : number;		
            dCameraRoll : number;
            dCameraPitch : number;
            dCameraYaw : number;
            CameraLocation : SMcVector3D;
            dOffsetCenterPixelX : number;
            dOffsetCenterPixelY : number;
        }
        
    }

    interface IMcUserDefinedImageCalc extends IMcImageCalc {
        SetQueryMaxDistance(dMaxDistance : number) : void;
	    GetQueryMaxDistance() : number;
        CameraModelChanged() : void;
        SetFrameDimensions(nPixelsNumX : number, nPixelsNumY : number) : void;
    }
    namespace IMcUserDefinedImageCalc {
        function Create(pCallBack : IMcUserDefinedImageCalc.ICallback, DtmMapLayerOrMapTerrains : IMcDtmMapLayer | IMcMapTerrain, pGridCoordinateSystem : IMcGridCoordinateSystem) : IMcUserDefinedImageCalc;

        interface ICallback {
            /**
             * Optional
             * @param pRayOrigin                 pRayOrigin.Value :  SMcVector3D
             */
            ImageToRay(ImagePixel : SMcVector2D, pRayOrigin : any) : boolean;
            /**
            * Optional
            * @param pCoord                       pCoord.Value :  SMcVector3D
            * @param pbDTMAvailable               pbDTMAvailable.Value :  boolean
            * @param pbImplemented                pbImplemented.Value :  boolean
            */
            ImageToCoord(ImagePixel : SMcVector2D, pCoord : any, pbDTMAvailable : any, pbImplemented : any) : boolean;
            /**
             * Mandatory
             * @param pImagePixel                 pImagePixel.Value :  SMcVector2D
             */
            /** Mandatory */
            WorldCoordToImagePixel(WorldCoord : SMcVector3D, pImagePixel : any) : boolean;
            /** Mandatory */
            GetScale(WorldCoord : SMcVector3D) : number;
            /** Optional */
            Release() : void;
        }
        namespace ICallback {
            function extend(strName : string, Class : any) : ICallback;
        }
    }

    interface IMcImageProcessing {
        SetFilterImageProcessing(pLayer : IMcRasterMapLayer, eOperation : IMcImageProcessing.EFilterProccessingOperation) : void;
	    GetFilterImageProcessing(pLayer : IMcRasterMapLayer) : IMcImageProcessing.EFilterProccessingOperation;
        SetCustomFilter(pLayer : IMcRasterMapLayer, uFilterXsize : number, uFilterYsize : number, aFilter : Float32Array, fBias : number, fDivider : number) : void;
        /**
         * @param puFilterXsize     puFilterXsize.Value : number
         * @param puFilterYsize     puFilterYsize.Value : number
         * @param paFilter          paFilter.Value : Float32Array
         * @param pfBias            pfBias.Value : number
         * @param pfDivider         pfDivider.Value : number
         */
        GetCustomFilter(pLayer : IMcRasterMapLayer, puFilterXsize : any, puFilterYsize : any, paFilter : any, pfBias : any, pfDivider : any) : void;
        SetEnableColorTableImageProcessing(pLayer : IMcRasterMapLayer, bEnable : boolean) : void;
        GetEnableColorTableImageProcessing(pLayer : IMcRasterMapLayer) : boolean;
        IsOriginalHistogramSet(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : boolean;
        SetOriginalHistogram(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, aHistogram : MC_HISTOGRAM) : void;
        GetOriginalHistogram(pLayer : IMcRasterMapLayer, eColorChannelm : IMcImageProcessing.EColorChannel) : MC_HISTOGRAM;
        SetVisibleAreaOriginalHistogram(pLayer : IMcRasterMapLayer, eColorChannelm : IMcImageProcessing.EColorChannel, bUse : boolean) : void;
        GetVisibleAreaOriginalHistogram(pLayer : IMcRasterMapLayer, eColorChannelm : IMcImageProcessing.EColorChannel) : boolean;
        GetCurrentHistogram(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : MC_HISTOGRAM;
        SetUserColorValues(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, aColorValues : IMcImageProcessing.MC_COLORTABLE, bUse : boolean) : void;
        /**
        * @param aColorValues          aColorValues.Value : IMcImageProcessing.MC_COLORTABLE
        */
        GetUserColorValues(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, aColorValues : any) : boolean;
        SetColorValuesToDefault(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : void;
        GetCurrentColorValues(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : IMcImageProcessing.MC_COLORTABLE;
        SetWhiteBalanceBrightness(pLayer : IMcRasterMapLayer, r : number, g : number, b : number) : void;
        /**
         * @param pR                pR.Value : number
         * @param pG                pG.Value : number
         * @param pB                pB.Value : number
         */
        GetWhiteBalanceBrightness(pLayer : IMcRasterMapLayer, pR : any, pG : any, pB : any) : void;
        SetColorTableBrightness(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, dBrightness : number) : void;
	    GetColorTableBrightness(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : number;
        SetContrast(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, dContrast : number) : void;
	    GetContrast(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : number;
        SetNegative(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, bUse : boolean) : void;
	    GetNegative(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : boolean;
        SetGamma(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, dGamma : number) : void;
	    GetGamma(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : number;
        SetHistogramEqualization(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, bUse : boolean) : void;
        GetHistogramEqualization(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel) : boolean;
        SetHistogramFit(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, bUse : boolean, aReferenceHistogram : MC_HISTOGRAM) : void;
        /**
        * @param aReferenceHistogram          aReferenceHistogram.Value : MC_HISTOGRAM
        */
        GetHistogramFit(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, aReferenceHistogram : any) : boolean;
        SetHistogramNormalization(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, bUse : boolean, dMean? : number, dStandardDeviation? : number) : void;
        /**
         * @param pdMean               pdMean.Value : number
         * @param pdStandardDeviation  pdStandardDeviation.Value : number
         */
        GetHistogramNormalization(pLayer : IMcRasterMapLayer, eColorChannel : IMcImageProcessing.EColorChannel, pdMean : any, pdStandardDeviation : any) : boolean;
    }
    namespace IMcImageProcessing {
        enum EColorChannel {
            ECC_RED, 
            ECC_GREEN, 
            ECC_BLUE, 
            ECC_MULTI_CHANNEL
        }
        enum EFilterProccessingOperation {
            EFPO_NO_FILTER, 
            EFPO_SMOOTH_LOW, 
            EFPO_SMOOTH_MID, 
            EFPO_SMOOTH_HIGH, 
            EFPO_SHARP_LOW, 
            EFPO_SHARP_MID, 
            EFPO_SHARP_HIGH, 
            EFPO_CUSTOM_FILTER
        }
        /**
         * The array size is always 256
         */
        type MC_COLORTABLE = Uint8Array;
        
    }

    interface IMcGeographicCalculations extends IMcDestroyable {
        CalcMagneticElements(Point : SMcVector3D, Date : Date) : IMcGeographicCalculations.SMagneticElements;
        SetCheckGridLimits(bCheckGridLimits : boolean) : void;
        GetCheckGridLimits() : boolean;
        /**
         * @param pdAzimuth                 pdAzimuth.Value :  number
         * @param pdDistance                pdDistance.Value : number
         */
        AzimuthAndDistanceBetweenTwoLocations(SourceLocation : SMcVector3D, TargetLocation : SMcVector3D, pdAzimuth : any, pdDistance? : any, bUseHeights? :boolean) : void;
        LocationFromAzimuthAndDistance(SourceLocation : SMcVector3D, dAzimuth : number, dDistance : number, bUseHeights? : boolean) : SMcVector3D;
        ArcSample(sArc : IMcGeographicCalculations.SEllipseArc, uFullEllipseReqPoints : number, bIsGeometric? : boolean) : SMcVector3D[];
        IsPointInArc(Point : SMcVector3D, sArc : IMcGeographicCalculations.SEllipseArc) : boolean;
        LineSample(StartPoint : SMcVector3D, EndPoint : SMcVector3D, dMaxError : number) : SMcVector3D[];
        PolyLineLength(aLineVertices : SMcVector3D[], bUseHeights? : boolean) : number;
        /**
        * @param pdArea                     pdArea.Value :         number
        */
        PolygonSphericArea(aPolygonVertices : SMcVector3D[], dEarthLocalRadius : number, pdArea : any) : boolean;
        CalcLocalRadius(Point : SMcVector3D) : number;
        CalcLocalAzimuthRadius(Point : SMcVector3D, dAzimuth : number) : number;
        /**
         * @param pdSunAzimuth              pdSunAzimuth.Value :  number
         * @param pdSunElevation            pdSunElevation.Value : number
         */
        CalcSunDirection(nYear : number, nMonth : number, nDay : number, nHour : number, nMin : number, nSec : number, fTimeZone : number,
		    Location : SMcVector3D, pdSunAzimuth : any, pdSunElevation? : any) : void;
        LocationFromLocationAndVector(SourceLocation : SMcVector3D, dVectorLengthInMeters : number, dVectorAzimuth : number, dVectorElevation : number) : SMcVector3D;
        /**
         * @param pdVectorLengthInMeters    pdVectorLengthInMeters.Value :  number
         * @param pdVectorAzimuth           pdVectorAzimuth.Value : number
         * @param pdVectorElevation         pdVectorElevation.Value : number
         */
        VectorFromTwoLocations(SourceLocation : SMcVector3D, TargetLocation : SMcVector3D, pdVectorLengthInMeters : any,
            pdVectorAzimuth? : any, pdVectorElevation? : any) : void;
        /**
         * @param pdRaysOriginDistance     pdRaysOriginDistance.Value :   number
         * @param pdRaysShortestDistance   pdRaysShortestDistance.Value : number
         * @param pLocation                pLocation.Value :              SMcVector3D
         */
        LocationFromTwoRays(FstRayOrigin : SMcVector3D,	FstRayOrientation : SMcVector3D, SndRayOrigin : SMcVector3D,	SndRayOrientation : SMcVector3D, 
            pdRaysOriginDistance : any,	pdRaysShortestDistance? : any, pLocation? : any, bOrientationsAsLocations? : boolean) : void;
        /**
         * @param pnNumOfIntersections     pnNumOfIntersections.Value :   number
         * @param pFstIntersection         pFstIntersection.Value : SMcVector3D
         * @param pSndIntersection         pSndIntersection.Value :              SMcVector3D
         */
        CirclesIntersection(FstCenter : SMcVector3D, dFstRadius : number, SndCenter : SMcVector3D,
		    dSndRadius : number, bCheckOnlyFstAzimuth : boolean, dFstAzimuth : number,
		    pnNumOfIntersections : any, pFstIntersection? : any, pSndIntersection? : any) : void;
        /**
        * @param pLeftUp       pLeftUp.Value :     SMcVector3D
        * @param pRightUp      pRightUp.Value :    SMcVector3D
        * @param pRightDown    pRightDown.Value :  SMcVector3D
        * @param pLeftDown     pLeftDown.Value :   SMcVector3D
        */
        CalcRectangleFromCenterAndLengths(RectangleCenterPoint : SMcVector3D,dRectangletHeight : number,
		    dRectangleWidth : number, dRotationAzimutDeg : number, pLeftUp : any,
		    pRightUp : any, pRightDown : any, pLeftDown : any, bIsGeometric? : boolean) : void;
        /**
        * @param pRectangleCenterPoint       pRectangleCenterPoint.Value :     SMcVector3D
        * @param pdRectangletHeight          pdRectangletHeight.Value :        number
        * @param pdRectangleWidth            pdRectangleWidth.Value :          number
        * @param pdRotationAzimutDeg         pdRotationAzimutDeg.Value :       number
        */
        CalcCenterAndLengthsFromRectangle(LeftUp : SMcVector3D, RightUp : SMcVector3D, RightDown : SMcVector3D, LeftDown : SMcVector3D,
		    pRectangleCenterPoint : any, pdRectangletHeight : any, pdRectangleWidth : any, pdRotationAzimutDeg : any, bIsGeometric? : boolean) : void;
        /**
        * @param pRectangleCenterPoint    pRectangleCenterPoint.Value :     SMcVector3D
        * @param pdRectangletHeight       pdRectangletHeight.Value :        number
        * @param pdRectangleWidth         pdRectangleWidth.Value :          number
        * @param bIsGeometric             bIsGeometric.Value :              boolean
        */
        CalcCenterAndLengthsFromRectangle(LeftUp : SMcVector3D, RightDown : SMcVector3D, dRotationAzimutDeg : number,
		    pRectangleCenterPoint : any, pdRectangletHeight : any, pdRectangleWidth : any,	bIsGeometric? : any) : void;
        CalcRectangleCenterFromCornerAndLengths(RectangleCornerPoint : SMcVector3D,	dRectangletHeight : number,	dRectangleWidth : number,
		    dRotationAzimutDeg : number, eCornerMeaning : IMcGeographicCalculations.ERectangleCorner, bIsGeometric? : boolean) : SMcVector3D;
        PolygonExpand(aPolygonVertices : SMcVector3D[], dExpansionDistance : number, uNumPointsInArc : number) : SMcVector3D[];
        PolylineExpand(aPolylineVertices : SMcVector3D[], dExpansionDistance : number, uNumPointsInArc : number) : SMcVector3D[];
        IsPointOn2DLine(Point : SMcVector3D, aPolylineVertices : SMcVector3D[], sLineAccuracy : number) : boolean;
        /**
        * @param pNearestPoint       pNearestPoint.Value :  SMcVector3D
        * @param pDist               pDist.Value :          number
        */
        ShortestDistPoint2DLine(Point : SMcVector3D,aPolylineVertices : SMcVector3D[],pNearestPoint : any, pDist? : any) : void;
        /**
        * @param pNearestPoint       pNearestPoint.Value :  SMcVector3D
        * @param pDist               pDist.Value :          number
        */
        ShortestDistPointArc(Point : SMcVector3D, Arc : IMcGeographicCalculations.SEllipseArc, pNearestPoint : any,	pDist? : any) : void;
        ConvertAzimuthFromOtherCoordSys(OriginLocation : SMcVector3D, bIsLocationInOtherCoordSys : boolean, OtherCoordSys : IMcGridCoordinateSystem, dOtherCoordSysAzimuth : number) : number;
        ConvertAzimuthToOtherCoordSys(OriginLocation : SMcVector3D, bIsLocationInOtherCoordSys : boolean, OtherCoordSys : IMcGridCoordinateSystem, dThisCoordSysAzimuth : number) : number;
        ConvertAzimuthFromGridToGeo(OriginLocation : SMcVector3D, dGridAzimuth : number, IsOriginLocationInGeoCoordinates : boolean) : number;
        ConvertAzimuthFromGeoToGrid(OriginLocation : SMcVector3D, dGeoAzimuth : number, IsOriginLocationInGeoCoordinates : boolean) : number;
        ConvertHeightFromEllipsoidToGeoid(EllipsoidLocation : SMcVector3D) : number;
        ConvertHeightFromGeoidToEllipsoid(GeoidLocation : SMcVector3D) : number;
        /**
        * @param pDestLocationsNum    pDestLocationsNum.Value :     number
        * @param pFstDestLocation     pFstDestLocation.Value :      SMcVector3D
        * @param pSndDestLocation     pSndDestLocation.Value :      SMcVector3D
        */
        LocationsFromTwoLocationsAndDistances(FstLocation : SMcVector3D, dDistanceFromFst : number, dElevationFromFst : number,	SndLocation : SMcVector3D, dDistanceFromSnd : number,
		    pDestLocationsNum : any, pFstDestLocation? : any, pSndDestLocation? : any) : void;
        /**
        * @param pCenterPoint    pCenterPoint.Value :  SMcVector3D
        * @param pdAzimuth       pdAzimuth.Value :     number
        * @param pdLength        pdLength.Value :      number
        * @param pdWidth         pdWidth.Value :       number
        * @param pdArea          pdArea.Value :        number
        */
        SmallestBoundingRect(aPoints : SMcVector3D[], dDeltaAngleToCheck : number,
		    pCenterPoint : any,	pdAzimuth? : any, pdLength? : any, pdWidth? : any,	pdArea? : any) : void;
         /**
        * @param pCenterPoint    pCenterPoint.Value :  SMcVector3D
        * @param pdAzimuth       pdAzimuth.Value :     number
        * @param pdLength        pdLength.Value :      number
        * @param pdWidth         pdWidth.Value :       number
        * @param pdArea          pdArea.Value :        number
        */
        BoundingRectAtAngle(aPoints : SMcVector3D[], dAngle : number,
		    pCenterPoint : any,	pdAzimuth? : any, pdLength? : any, pdWidth? : any, pdArea? : any) : void;
    }
    namespace IMcGeographicCalculations {
        function Create(pGridCoordinateSystem: IMcGridCoordinateSystem) : IMcGeographicCalculations;
        enum ERectangleCorner {
            ERC_LEFT_UP,
            ERC_RIGHT_UP,
            ERC_RIGHT_DOWN,
            ERC_LEFT_DOWN
        }
        class SEllipseArc {
            constructor(_Center? : SMcVector3D, _dRadiusX? : number, _dRadiusY? : number, _dRotationAngle? : number, _dInnerRadiusFactor? : number, _bClockWise? : boolean,
                _dStartAzimuth? : number, _dEndAzimuth ? : number);
            Center : SMcVector3D;				
            dRadiusX : number;			
            dRadiusY : number;			
            dRotationAngle : number;		
            dInnerRadiusFactor : number;	
            bClockWise : boolean;			
            dStartAzimuth : number;		
            dEndAzimuth : number;		
        }
        class SMagneticElements {
            constructor();
            dDecl : number;   
            dIncl : number;   
            dF : number;      
            dH : number;      
            dX : number;      
            dY : number;      
            dZ : number;      
            dDecldot : number;
            dIncldot : number;
            dFdot : number;   
            dHdot : number;   
            dXdot : number;   
            dYdot : number;   
            dZdot : number;   
            dGVdot : number;  
        }
    }

    interface IMcTrackSmoother extends IMcDestroyable {
        AddPoints(aOriginalPoints : SMcVector3D[]) : void;
        GetSmoothedTrack(paSmoothedTrackPoints : any, puNumSmoothedTrackPoints : any) : SMcVector3D[];
        ClearTrack(dSmoothDistance : number) : void;

    }
    namespace IMcTrackSmoother {
        function Create(pGeoCalc : IMcGeographicCalculations, dSmoothDistance : number) : IMcTrackSmoother;
    }

    namespace IMcGeometricCalculations {
        function EGParallelLine(stBaseLine : SMcVector3D[], dDist : number) : SMcVector3D[];
        function EGPerpendicularLine(stBaseLine : SMcVector3D[], dDist : number, stThroughPoint : SMcVector3D) : SMcVector3D[];
        function EG2DLineMove(stLine : SMcVector3D[], dX : number, dY : number) : void;
	    function EG2DLineRotate(stLine : SMcVector3D[], dAngle : number, stBasePoint : SMcVector3D) : void;
        function EG2DIsPointOnLine(stPoint : SMcVector3D, stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE, dAccuracy : number) : POINT_LINE_STATUS;
        function EGDistancePointLine(stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE,	stPoint : SMcVector3D) : number;
        /**
        * @param pstClosestPointOn1            pstClosestPointOn1.Value :  SMcVector3D
        * @param pstClosestPointOn2            pstClosestPointOn2.Value :  SMcVector3D
        * @param pDist                         pDist.Value :               number
        */
        function EGLineDistance(stLine1 : SMcVector3D[], eLineType1 : GEOMETRIC_SHAPE, stLine2 : SMcVector3D[], eLineType2 : GEOMETRIC_SHAPE,
            pstClosestPointOn1 : any, pstClosestPointOn2 : any, pDist : any) : void;
        /**
        * @param pstClosestPointOn1            pstClosestPointOn1.Value :  SMcVector3D
        * @param pstClosestPointOn2            pstClosestPointOn2.Value :  SMcVector3D
        * @param pDist                         pDist.Value :               number
        */
        function EGSegmentsDistance(stSegment1 : SMcVector3D[], stSegment2 : SMcVector3D[], pstClosestPointOn1: any, pstClosestPointOn2 : any, pDist : any) : void;
        /**
        * @param pstFstPoint            pstFstPoint.Value :  SMcVector3D
        * @param pstScdPoint            pstScdPoint.Value :  SMcVector3D
        * @param peStatus               peStatus.Value :     SL_SL_STATUS
        */
        function EG2DSegmentsRelation(stSegment1 : SMcVector3D[], stSegment2 : SMcVector3D[],	pnIntersectPointsNum : any, pstFstPoint : any, pstScdPoint : any, peStatus : any) : void;
        function EGAngleBetween3Points(stFstPoint : SMcVector3D, stMidPoint : SMcVector3D, stScdPoint : SMcVector3D) : number;
        function EG2DAngleFromX(stLine : SMcVector3D[]) : number;
	    function EG3DAngleFromXY(stLine : SMcVector3D[]) : number;
        /**
        * @param pnTangentsNum          pnTangentsNum.Value :       number
        * @param Tangent1               array created by the user, allocated and filled by MapCore
        * @param Tangent2               array created by the user, allocated and filled by MapCore
        */
        function EG2DTangentsThroughPoint(stCircleCenter : SMcVector3D, dRadius : number, stThroughPoint : SMcVector3D,	pnTangentsNum : SMcVector3D[], Tangent1 : SMcVector3D[], Tangent2 : any) : void;
        /**
        * @param pnTangentsNum          pnTangentsNum.Value :       number
        * @param Tangent1               array created by the user, allocated and filled by MapCore
        * @param Tangent2               array created by the user, allocated and filled by MapCore
        * @param Tangent3               array created by the user, allocated and filled by MapCore
        * @param Tangent4               array created by the user, allocated and filled by MapCore
        */
        function EG2DTangents2Circles(stCircleCenter1 : SMcVector3D, dRadius1 : number, stCircleCenter2 : SMcVector3D, dRadius2 : number, pnTangentsNum : SMcVector3D[], Tangent1 : SMcVector3D[],	Tangent2 : SMcVector3D[],	Tangent3 : SMcVector3D[],	Tangent4 : SMcVector3D[]) : void;
        function EGArcLengthFromAngle(dAngleDegrees : number, dRadius : number) : number;
        function EGArcAngleFromLength(dLength : number,	dRadius : number) : number;
        /**
        * @param pCenter            pCenter.Value :         SMcVector3D
        * @param pRadius            pRadius.Value :         number
        */
        function EG2DCircleFrom3Points(stCircle1stPoint : SMcVector3D, stCircle2ndPoint : SMcVector3D,	stCircle3rdPoint : SMcVector3D,	pCenter : any, pRadius : any) : void;
        /**
        * @param pstCircle1stPoint            pstCircle1stPoint.Value :         SMcVector3D
        * @param pstCircle2ndPoint            pstCircle2ndPoint.Value :         SMcVector3D
        * @param pstCircle3rdPoint            pstCircle3rdPoint.Value :         SMcVector3D
        */
        function EG2D3PointsFromCircle(pstCircle1stPoint : any, pstCircle2ndPoint : any, pstCircle3rdPoint : any, stCenter : SMcVector3D, dRadius : number) : void;
        function EG2DCircleCircleIntersection(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D,	e1stCircleType : GEOMETRIC_SHAPE, st2ndCircle1stPoint : SMcVector3D, 
            st2ndCircle2ndPoint : SMcVector3D, st2ndCircle3rdPoint : SMcVector3D, e2ndCircleType : GEOMETRIC_SHAPE) : SMcVector3D[];
        /**
        * @param pstClosestOn1st            pstClosestOn1st.Value :         SMcVector3D
        * @param pstClosestOn2nd            pstClosestOn2nd.Value :         SMcVector3D
        * @param pdDistance                 pdDistance.Value :              number
        */
        function EG2DCircleCircleDistance(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D, e1stCircleType : GEOMETRIC_SHAPE, st2ndCircle1stPoint : SMcVector3D,
		    st2ndCircle2ndPoint : SMcVector3D, st2ndCircle3rdPoint : SMcVector3D, e2ndCircleType : GEOMETRIC_SHAPE, pstClosestOn1st : any, pstClosestOn2nd : any, pdDistance : any) : void;
        function EG2DCircleLineIntersection(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D, e1stCircleType : GEOMETRIC_SHAPE, stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE) : SMcVector3D[];
        /** 
        * @param pstClosestOnCircle         pstClosestOnCircle.Value :      SMcVector3D
        * @param pstClosestOnLine           pstClosestOnLine.Value :        SMcVector3D
        * @param pdDistance                 pdDistance.Value :              number
        */
        function EG2DCircleLineDistance(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D, e1stCircleType : GEOMETRIC_SHAPE,
            stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE, pstClosestOnCircle : any, pstClosestOnLine : any, pdDistance : any) : void;
        /** 
        * @param pstClosestOnCirc           pstClosestOnCirc.Value :      SMcVector3D
        * @param pdDistance                 pdDistance.Value :            number
        */
        function EG2DCirclePointDistance(st1stCircle1stPoint : SMcVector3D, st1stCircle2ndPoint : SMcVector3D, st1stCircle3rdPoint : SMcVector3D, e1stCircleType : GEOMETRIC_SHAPE, stPoint : SMcVector3D, pstClosestOnCirc : any, pdDistance : any) : void;
        function EG2DIsPointOnCircle(stPoint : SMcVector3D, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, dAccuracy : number) : boolean;
        function EG2DIsPointInCircle(stPoint : SMcVector3D, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE) : POINT_PG_STATUS;
        /** 
        * @param pdLeft                     pdLeft.Value :         number
        * @param pdRight                    pdRight.Value :        number
        * @param pdDown                     pdDown.Value :         number
        * @param pdUp                       pdUp.Value :           number
        */
        function EG2DCircleBoundingRect(stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, pdLeft : any, pdRight : any, pdDown : any, pdUp : any) : void;
        function EG2DCircleSample(stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, unNumOfPoints : number) : SMcVector3D[];
        function EG2DPolyLineMove(pstPolyLine : SMcVector3D[], dX : number, dY : number) : void;
        function EG2DPolyLineRotate(pstPolyLine : SMcVector3D[], dAngle : number, stBasePoint : SMcVector3D) : void;
        /**
        * @param peCrossResult            peCrossResult.Value :         PL_PL_STATUS
        */
        function EGPolyLinesRelation(stPolyLine1 : SMcVector3D[], stPolyLine2 : SMcVector3D[], peCrossResult: any, unDimension : number) : SMcVector3D[];
        function EG2DIsPointOnPoly(stPoint : SMcVector3D, stPoly :  SMcVector3D[], ePolyType : GEOMETRIC_SHAPE , dAccuracy : number) : boolean;
        /**
        * @param pstClosest           pstClosest.Value :        SMcVector3D
        * @param puSegment            puSegment.Value :         number
        * @param pdDistance           pdDistance.Value :        number
        */
        function EGDistancePoint2Poly(stPoint : SMcVector3D, stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pstClosest : any, puSegment : any, pdDistance : any, unDimension : number) : void;
        /**
        * @param pstClosest1          pstClosest2.Value :       SMcVector3D
        * @param pstClosest2          pstClosest1.Value :       SMcVector3D
        * @param pdDistance           pdDistance.Value :        number
        */
        function EGDistancePoly2Poly(stPoly1 : SMcVector3D[], ePolyType1 : GEOMETRIC_SHAPE, stPoly2 : SMcVector3D[], ePolyType2 : GEOMETRIC_SHAPE, pstClosest1 : any, pstClosest2 : any, pdDistance : any, unDimension : number) : void;
        function EGPolyLength(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, unDimension : number) : number;
        function EG2DPolySelfIntersection(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE) : boolean;
        function EG2DLinePolyIntersection(stPoly :  SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE) : SMcVector3D[];
        /** 
        * @param pstClosestOnPoly          pstClosestOnPoly.Value :     SMcVector3D
        * @param pstClosestOnLine          pstClosestOnLine.Value :     SMcVector3D
        * @param pdDistance                pdDistance.Value :           number
        */
        function EG2DLinePolyDistance(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, stLine :  SMcVector3D[], eLineType : GEOMETRIC_SHAPE, pstClosestOnPoly : any, pstClosestOnLine : any, pdDistance : any) : void;
        function EG2DPolyCircleIntersection(stPoly :  SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE) : SMcVector3D[];
        /** 
        * @param pstClosestOnPoly          pstClosestOnPoly.Value :     SMcVector3D
        * @param pstClosestOnCircle        pstClosestOnCircle.Value :   SMcVector3D
        * @param pdDistance                pdDistance.Value :           number
        */
        function EG2DPolyCircleDistance(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, pstClosestOnPoly : any, pstClosestOnCircle : any, pdDistance : any) : void;
        /** 
        * @param pdLeft                     pdLeft.Value :         number
        * @param pdRight                    pdRight.Value :        number
        * @param pdDown                     pdDown.Value :         number
        * @param pdUp                       pdUp.Value :           number
        */
        function EG2DPolyBoundingRect(stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pdLeft : any, pdRight : any, pdDown : any, pdUp : any) : void;
        function EG2DPolySmoothingSample(aPolyPoints : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, uNumSmoothingLevels : number, pauOriginalPointsIndices? : Uint32Array) : SMcVector3D[];
        function EG2DClipPolyInRect(aPolyPoints : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pPolyBoundingRect : SMcBox, Rect2D : SMcBox) : Uint8Array;
        function EG2DPolyGonMove(stPolyGon : SMcVector3D[], dX : number, dY : number) : void;
        function EG2DPolyGonRotate(stPolyGon : SMcVector3D[], dAngle : number, stBasePoint : SMcVector3D) : void;
        function EG2DIsPointInPolyGon(stPoint : SMcVector3D, stPolyGon : SMcVector3D[]) : POINT_PG_STATUS;
        /**
        * @param peCrossResult            peCrossResult.Value :         PL_PL_STATUS
        * @param pePolygonStatus          pePolygonStatus.Value :       PG_PG_STATUS
        */
        function EG2DPolyGonsRelation(stPolyGon1 : SMcVector3D[], stPolyGon2 : SMcVector3D[], peCrossResult : any, pePolygonStatus : any) : SMcVector3D[];
        /**
        * @param pdArea                   pdArea.Value :         number
        */
        function EG2DPolyGonArea(stPolyGon : SMcVector3D[], pdArea : any) : boolean;
        function EG2DPolyGonInflate(stPolyGon : SMcVector3D	[], dProportion : number, stBasePoint : SMcVector3D) : void;
	    function EG2DPolyGonCenterOfGravity(stPolyGon : SMcVector3D[]) : SMcVector3D;
	    function EG2DPolyPoleOfInaccessibility(stPolyGon : SMcVector3D[], dPrecision : number) : SMcVector3D;
	    function EG2DPolyGonTriangulation(stPolyGon : SMcVector3D[]) : SMcVector3D[][];
        /** 
        * @param arrAminB                array created by the user, allocated and filled by MapCore
        * @param arrBminA                array created by the user, allocated and filled by MapCore
        * @param arrAandB                array created by the user, allocated and filled by MapCore
        * @param arrAorB                 array created by the user, allocated and filled by MapCore
        */
        function EG2DClipPolyGon(PolyGon1 : SMcVector3D[], PolyGon2 : SMcVector3D[], arrAminB : SMcVector3D[][], arrBminA : SMcVector3D[][], arrAandB : SMcVector3D[][], arrAorB : SMcVector3D[][]) : void;
		/**
        * @param paUnionPolyGonsPoints    					array created by the user, allocated and filled by MapCore
		* @param paUnionPolyGonsContourStarts             	paUnionPolyGonsContourStarts.Value :          Uint32Array
		*/
		function EG2DPolyGonsUnion(aPolyGon1Points : SMcVector3D[], aPolyGon1ContourStarts : Uint32Array, aPolyGon2Points : SMcVector3D[], aPolyGon2ContourStarts : Uint32Array, paUnionPolyGonsPoints : SMcVector3D[], paUnionPolyGonsContourStarts : any) : void;
		function EG2DPolyGonDirection(stPolyGon : SMcVector3D[], bCheckForSelfIntersection : boolean) : PG_DIRECTION;
	    function EG2DPolyGonIsConvex(stPolyGon : SMcVector3D[]) : boolean;
	    function EG2DPolyGonConvexHull(stPolyGon : SMcVector3D[]) : SMcVector3D[];
        function EG2DPolygonExpandWithCurves(stPolyGon : SMcVector3D[], dExpansionDistance : number) : STGeneralShapePoint[];
        function EG2DPolygonExpandWithCorners(stPolyGon : SMcVector3D[], dExpansionDistance : number) : SMcVector3D[];
        function EG2DOpenShapeMove(pstOGS : STGeneralShape, dX : number, dY : number) : void;
        function EG2DOpenShapeRotate(pstOGS : STGeneralShape, dAngle : number, stBasePoint : SMcVector3D) : void;
	    function EG2DOpenShapeOpenShapeIntersection(stOGS1 : STGeneralShape,  stOGS2 : STGeneralShape) : SMcVector3D[];
        function EG2DGeneralShapeSelfIntersection(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE) : boolean;
        function EG2DIsPointOnGeneralShape(stPoint : SMcVector3D, stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE , dAccuracy : number) : boolean;
	    function EG2DGeneralShapeLength(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE) : number;
        /**
        * @param pstClosestOnShape      pstClosestOnShape.Value :   SMcVector3D
        * @param pdDistance             pdDistance.Value :          number
        */
        function EG2DGeneralShapeDistance2Point(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stPoint : SMcVector3D, pstClosestOnShape : any, pdDistance : any) : void;
        /**
        * @param pstClosestOnShape      pstClosestOnShape.Value :   SMcVector3D
        * @param pstClosestOnCirc       pstClosestOnCirc.Value :    SMcVector3D
        * @param pdDistance             pdDistance.Value :          number
        */
        function EG2DGeneralShapeDistance2Circle(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnCirc : any, pdDistance : any) : void;
        /**
        * @param pstClosestOnShape      pstClosestOnShape.Value :   SMcVector3D
        * @param pstClosestOnPoly       pstClosestOnPoly.Value :    SMcVector3D
        * @param pdDistance             pdDistance.Value :          number
        */
        function EG2DGeneralShapeDistance2Poly(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnPoly : any, pdDistance : any) : void;
        /**
        * @param pstClosestOnShape          pstClosestOnShape.Value :         SMcVector3D
        * @param pstClosestOnOtherShape     pstClosestOnOtherShape.Value :    SMcVector3D
        * @param pdDistance                 pdDistance.Value :                number
        */
        function EG2DGeneralShapeDistance2GeneralShape(stGS1 : STGeneralShape, eGeneralShapeType1 : GEOMETRIC_SHAPE, stGS2 : STGeneralShape, eGeneralShapeType2 : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnOtherShape : any, pdDistance : any) : void;
        /** 
        * @param pdLeft                     pdLeft.Value :         number
        * @param pdRight                    pdRight.Value :        number
        * @param pdDown                     pdDown.Value :         number
        * @param pdUp                       pdUp.Value :           number
        */
        function EG2DGeneralShapeBoundingRect(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, pdLeft : any, pdRight : any, pdDown : any, pdUp : any) : void;
        function EG2DLineGeneralShapeIntersection(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stLine : SMcVector3D[], eLineType : GEOMETRIC_SHAPE) : void;
        function EG2DGeneralShapeCircleIntersection(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE) : SMcVector3D[];
        function EG2DGeneralShapePolyIntersection(stGS : STGeneralShape, eGeneralShapeType :GEOMETRIC_SHAPE, stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE ) : SMcVector3D[];
        function EG2DGeneralShapeSample(stGS : STGeneralShape, eGeneralShapeType : GEOMETRIC_SHAPE, unPointsNumPerArc : number) : SMcVector3D[];
        function EG2DClosedShapeMove(pstCGS : STGeneralShape, dX : number, dY : number) : void;
        function EG2DClosedShapeRotate(pstCGS : STGeneralShape, dAngle : number, stBasePoint : SMcVector3D) : void;
        function EG2DIsPointInClosedShape(stPoint : SMcVector3D, stCGS : STGeneralShape) : POINT_PG_STATUS;
	    function EG2DClosedShapeOpenShapeIntersection(stCGS1 : STGeneralShape, stOGS2 : STGeneralShape) : SMcVector3D[];
        /** 
        * @param pShapesRelation            pShapesRelation.Value :    PG_PG_STATUS
        */
        function EG2DClosedShapeClosedShapeIntersection(stCGS1 : STGeneralShape, stCGS2 : STGeneralShape, pShapesRelation : any) : SMcVector3D[];
        function EG2DClosedShapeArea(stCGS1 : STGeneralShape) : number;
        function EG2DClosedShapeWithHolesMove(astContours : STGeneralShape[], dX : number, dY : number) : void;
        function EG2DClosedShapeWithHolesRotate(astContours : STGeneralShape[], dAngle : number, stBasePoint : SMcVector3D) : void;
        function EG2DIsPointInClosedShapeWithHoles(stPoint : SMcVector3D, astContours : STGeneralShape[]) : POINT_PG_STATUS;
        function EG2DIsPointOnClosedShapeWithHoles(stPoint : SMcVector3D, astContours : STGeneralShape[], dAccuracy : number) : boolean;
        function EG2DClosedShapeWithHolesArea(astContours : STGeneralShape[]) : number;
        function EG2DClosedShapeWithHolesLength(astContours : STGeneralShape[]) : number;
        /** 
        * @param pstClosestOnShape         pstClosestOnShape.Value :    SMcVector3D
        * @param pdDistance                pdDistance.Value :           number
        */
        function EG2DClosedShapeWithHolesDistance2Point(astContours : STGeneralShape[], stPoint : SMcVector3D, pstClosestOnShape : any, pdDistance : any) : void;
        /** 
        * @param pstClosestOnShape         pstClosestOnShape.Value :    SMcVector3D
        * @param pstClosestOnCirc          pstClosestOnCirc.Value :     SMcVector3D
        * @param pdDistance                pdDistance.Value :           number
        */
        function EG2DClosedShapeWithHolesDistance2Circle(astContours : STGeneralShape[], stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnCirc : any, pdDistance : any) : void;
        /** 
        * @param pstClosestOnShape         pstClosestOnShape.Value :        SMcVector3D
        * @param pstClosestOnPolyLine      pstClosestOnPolyLine.Value :     SMcVector3D
        * @param pdDistance                pdDistance.Value :               number
        */
        function EG2DClosedShapeWithHolesDistance2Poly(astContours : STGeneralShape[], stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnPolyLine : any, pdDistance : any) : void;
        /** 
        * @param pstClosestOnShape         pstClosestOnShape.Value :        SMcVector3D
        * @param pstClosestOnOtherShape    pstClosestOnOtherShape.Value :   SMcVector3D
        * @param pdDistance                pdDistance.Value :               number
        */
        function EG2DClosedShapeWithHolesDistance2GeneralShape(astContours : STGeneralShape[], stGS2 : STGeneralShape, eGeneralShapeType2 : GEOMETRIC_SHAPE, pstClosestOnShape : any, pstClosestOnOtherShape : any, pdDistance : any) : void;
        function EG2DClosedShapeWithHolesCircleIntersection(astContours : STGeneralShape[], stCircle1st : SMcVector3D, stCircle2nd : SMcVector3D, stCircle3rd : SMcVector3D, eCircleType : GEOMETRIC_SHAPE) : void;
        function EG2DClosedShapeWithHolesPolyIntersection(astContours : STGeneralShape[], stPoly : SMcVector3D[], ePolyType : GEOMETRIC_SHAPE) : SMcVector3D[];
        function EG2DClosedShapeWithHolesGeneralShapeIntersection(astContours : STGeneralShape[], stGS2 : STGeneralShape, eGeneralShapeType2 : GEOMETRIC_SHAPE) : SMcVector3D[];
        /** 
        * functions EG2DDeleteUnionArcs() and EG2DDeleteUnionShapes() are not used
        * 
        * @param pastArcs         array created by the user, allocated and filled by MapCore
        * @param pastShapes       array created by the user, allocated and filled by MapCore
        */
        function EG2DCirclesUnion(astCircles : STCircle[], bAddParticipatingCircles : boolean, pastArcs : STUnionArc[], pastShapes : STUnionShape[]) : void;
        /** 
        * @param RotatedUpperLeft         RotatedUpperLeft.Value :    SMcVector3D
        * @param RotatedUpperRight        RotatedUpperRight.Value :   SMcVector3D
        * @param RotatedLowerRight        RotatedLowerRight.Value :   SMcVector3D
        * @param RotatedLowerLeft         RotatedLowerLeft.Value :    SMcVector3D
        */
        function EGGetRectanglePoints(firstCornerInDiagonal : SMcVector3D, secondCornerInDiagonal : SMcVector3D, rotationAzimDeg : number, RotatedUpperLeft : any, RotatedUpperRight : any, RotatedLowerRight : any, RotatedLowerLeft : any) : void;
        /** 
        * @param upperLeft          upperLeft.Value :       SMcVector3D
        * @param LowerRight         LowerRight.Value :      SMcVector3D
        * @param rotationAzim       rotationAzim.Value :    number
        */
        function EGGetRectangleParameters(RotatedUpperLeft : SMcVector3D, RotatedUpperRight : SMcVector3D, RotatedLowerRight : SMcVector3D, RotatedLowerLeft? : SMcVector3D, upperLeft? : any, LowerRight? : any,	rotationAzim? : any) : void;
        /** 
        * @param upperLeft          upperLeft.Value :       SMcVector3D
        * @param LowerRight         LowerRight.Value :      SMcVector3D
        */
        function EGGetRectangleParameters(RotatedUpperLeft : SMcVector3D, RotatedLowerRight : SMcVector3D, rotationAzim : number, upperLeft? : SMcVector3D, LowerRight? : SMcVector3D) : void;
        /** 
        * @param pdDeltaYawInPlatformSpace          pdDeltaYawInPlatformSpace.Value :       number
        * @param pdDeltaPitchInPlatformSpace        pdDeltaPitchInPlatformSpace.Value :     number
        */
        function EGCalcRotationDeltaAngles(dGunbarrelYaw : number, dGunbarrelPitch : number, dGunbarrelRoll : number, dCurrentGunbarrelYawInPlatformSpace : number, dCurrentGunbarrelPitchInPlatformSpace : number, 
            dTargetYaw : number, dTargetPitch : number, pdDeltaYawInPlatformSpace : any, pdDeltaPitchInPlatformSpace : any) : void;
    }

    interface IMcGridConverter extends IMcBase {
            /**
             * @param pnZoneB    pnZoneB.Value : IMcGridConverter
             */
            ConvertAtoB(LocationA : SMcVector3D, pnZoneB? : any) : SMcVector3D;
            /**
             * @param pnZoneA    pnZoneA.Value : IMcGridConverter
             */
            ConvertBtoA(LocationB : SMcVector3D, pnZoneA? : any) : SMcVector3D;
            IsSameCoordinateSystem() : boolean;
            GetGridCoordinateSystem_A() : IMcGridCoordinateSystem;
            GetGridCoordinateSystem_B(): IMcGridCoordinateSystem;
            SetConvertingHeight(bConvertHeight: boolean) : void;
            GetConvertingHeight() : boolean;
            SetCheckGridLimits(bCheckGridLimits : boolean) : void;
            GetCheckGridLimits() : boolean;
        }
    namespace IMcGridConverter {
        function Create(pGridCoordinateSystem_A : IMcGridCoordinateSystem, pGridCoordinateSystem_B : IMcGridCoordinateSystem, bConvertHeight? : boolean) : IMcGridConverter;
    }

    interface IMcGridCoordinateSystem extends IMcBase {
        GetGridCoorSysType() : number;
        IsEqual(pOtherCoordinateSystem : IMcGridCoordinateSystem) : boolean;
        GetDatum() : IMcGridCoordinateSystem.EDatumType;
        GetDatumParams() : IMcGridCoordinateSystem.SDatumParams;
        IsGeographicLocationLegal(Location : SMcVector3D) : boolean;
        IsLocationLegal(Location : SMcVector3D) : boolean;
        GetLegalValuesForGeographicCoordinates() : SMcBox;
        GetLegalValuesForGridCoordinates() : SMcBox;
        SetLegalValuesForGeographicCoordinates(LegalValues : SMcBox) : void;
        SetLegalValuesForGridCoordinates(LegalValues : SMcBox) : void;
	    IsMultyZoneGrid() : boolean;
	    GetZone() : number;
	    /**
         * @param pstrOgcCrsCode    pstrOgcCrsCode.Value : string
         */
        GetOgcCrsCode(pstrOgcCrsCode: any) : boolean;
        GetDefaultZoneFromGeographicLocation(GeographicLocation : SMcVector3D) : number;
	    IsGeographic() : boolean;
	    IsUtm() : boolean;
        CloneAsGeneric() : IMcGridGeneric;
    }
    namespace IMcGridCoordinateSystem {
        enum EDatumType {                       
                EDT_USER_DEFINED,	
                EDT_WGS84,		
                EDT_ED50_ISRAEL,	
                EDT_PULKOVO42_POLAND,
                EDT_HERMANSKOGEL,
                EDT_NAD27,	
                EDT_KKJ,
                EDT_INDIAN_EVEREST56,
                EDT_RT90_BESSEL1841,
                EDT_NAD83,
                EDT_PULKOVO_GEORGIA,
                EDT_IND,
                EDT_NZGD1949,
                EDT_NZGD2000,
                EDT_SAD69,
                EDT_PULKOVO_KAMIN,
                EDT_KERTAU,
                EDT_ED50_MEAN,
                EDT_PULKOVO_KZ,
                EDT_PULKOVO_RU,
                EDT_OSGB,
                EDT_IRISH1965,
                EDT_NUM
        }

        class SDatumParams {
            constructor();
            constructor(_dA : number, _dF : number, _dDX : number, _dDY : number, _dDZ : number, _dRx : number, _dRy : number, _dRz : number, _dS : number);
            dA : number;
            dF : number;
            dDX : number;
            dDY : number;
            dDZ : number;
            dRx : number;
            dRy : number;
            dRz : number;
            dS : number;
        }
    }

    interface IMcGridCoordSystemGeographic extends IMcGridCoordinateSystem {}
    namespace IMcGridCoordSystemGeographic {
        function Create(eDatum : IMcGridCoordinateSystem.EDatumType, pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridCoordSystemGeographic; 
        var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridCoordSystemGeocentric extends IMcGridCoordinateSystem {}
    namespace IMcGridCoordSystemGeocentric {
        function Create(eDatum : IMcGridCoordinateSystem.EDatumType, pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridCoordSystemGeocentric; 
        var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridGeneric extends IMcGridCoordinateSystem {
        IsEllipsoidOf(strEllipsoidName : string) : boolean;
        /**
         * @param pastrCreateParams    array created by the user, allocated and filled by MapCore
         * @param pbSRID               pstrOgcCrsCode.Value : boolean
         */
        GetCreateParams(pastrCreateParams : any, pbSRID : any) : void;
        CloneAsNonGeneric() : IMcGridCoordinateSystem;
    }
    namespace IMcGridGeneric {
        function GetFullInitializationString(strSRID : string) : string;
        function GetSupportedSRIDs() : SMcKeyStringValue[];
        function Create(strInitializationString : string, bIsSRID? : boolean) : IMcGridGeneric;
        function Create(astrGridParams : string[]) : IMcGridGeneric;
        var GRID_COOR_SYS_TYPE : number;
    }
    interface IMcGridCoordSystemTraverseMercator extends IMcGridCoordinateSystem {
        GetTMParams() : IMcGridCoordSystemTraverseMercator.STMGridParams;
    }
    namespace IMcGridCoordSystemTraverseMercator {
        class STMGridParams {
            constructor(_dFalseNorthing : number, _dFalseEasting : number, _dCentralMeridian : number, _dLatitudeOfGridOrigin : number, _dScaleFactor : number, _dZoneWidth : number);
            dFalseNorthing : number; 
            dFalseEasting : number; 
            dCentralMeridian : number;
            dLatitudeOfGridOrigin : number;
            dScaleFactor : number;
            dZoneWidth : number;
        }
    }

    interface IMcGridTMUserDefined extends IMcGridCoordSystemTraverseMercator {
    }
    namespace IMcGridTMUserDefined {
        function Create(GridParams : IMcGridCoordSystemTraverseMercator.STMGridParams, nZone : number, eDatum : IMcGridCoordinateSystem.EDatumType, 
            pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridTMUserDefined;
        var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridUTM extends IMcGridCoordSystemTraverseMercator {}
    namespace IMcGridUTM {
        function Create(nZone : number, eeDatum : IMcGridCoordinateSystem.EDatumType, pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridUTM;
        var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridMGRS extends IMcGridCoordSystemTraverseMercator {
        CoordToFullMGRS(Coord : SMcVector3D) : IMcGridMGRS.SFullMGRS;
        FullMGRSToCoord(FullMGRS : IMcGridMGRS.SFullMGRS) : SMcVector3D;
    }
    namespace IMcGridMGRS {
        function Create() : IMcGridMGRS;
        var GRID_COOR_SYS_TYPE : number;

        class SSquare {
            constructor();
            cSquareFst : string;
            cSquareSnd : string;
            cBand : string;     
            nZone : number;     
        }
        class SFullMGRS {
            constructor();
            Coord : SMcVector3D;
            Square : IMcGridMGRS.SSquare; 
        }
    }

    interface IMcGridBNG extends IMcGridCoordSystemTraverseMercator {
        CoordToFullBNG(Coord : SMcVector3D) : IMcGridBNG.SFullBNG;
        FullBNGToCoord(FullBNG : IMcGridBNG.SFullBNG) : SMcVector3D;
    }
    namespace IMcGridBNG {
          function Create() : IMcGridBNG;
          var GRID_COOR_SYS_TYPE : number;

          class SSquare {
              constructor();
              cSquareFst : string;
		      cSquareSnd : string;
          }
          class SFullBNG {
              constructor();
              Coord : SMcVector3D;
              Square : IMcGridBNG.SSquare; 
          }
    }

    interface IMcGridGARS extends IMcGridCoordinateSystem {
        CoordToFullGARS(Coord : SMcVector3D) : string;
        FullGARSToCoord(strGARS5minute : string) : SMcVector3D;
    }
    namespace IMcGridGARS {
          function Create() : IMcGridGARS;
          var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridGEOREF extends IMcGridCoordinateSystem {
        CoordToFullGEOREF(Coord : SMcVector3D) : string;
        FullGEOREFToCoord(strGEOREF_ThousandthMinute : string) : SMcVector3D;
    }
    namespace IMcGridGEOREF {
          function Create() : IMcGridGEOREF;
          var GRID_COOR_SYS_TYPE : number;
    }
    
    interface IMcGridIrish extends IMcGridCoordSystemTraverseMercator {
        CoordToFullIrish(Coord : SMcVector3D) : IMcGridIrish.SFullIrish;
        FullIrishToCoord(FullIrish : IMcGridIrish.SFullIrish) : SMcVector3D;
    }
    namespace IMcGridIrish {
          function Create() : IMcGridIrish;
          var GRID_COOR_SYS_TYPE : number;

          class SFullIrish {
              constructor();
              Coord : SMcVector3D;
              cLetter : string; 
          }
    }

    interface IMcGridNewIsrael extends IMcGridCoordSystemTraverseMercator {}
    namespace IMcGridNewIsrael {
        function Create() : IMcGridNewIsrael; 
        var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridS42 extends IMcGridCoordSystemTraverseMercator {}
    namespace IMcGridS42 {
        function Create(nZone : number, eDatum : IMcGridCoordinateSystem.EDatumType , pDatumParams? : IMcGridCoordinateSystem.SDatumParams) : IMcGridS42; 
        var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridRT90 extends IMcGridCoordSystemTraverseMercator {}
    namespace IMcGridRT90 {
        function Create() : IMcGridRT90; 
        var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridNZMG extends IMcGridCoordinateSystem {}
    namespace IMcGridNZMG {
        function Create() : IMcGridNZMG; 
        var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridCoordSystemRSO extends IMcGridCoordinateSystem {}
    
    interface IMcGridRSOSingapore extends IMcGridCoordSystemRSO {}
    namespace IMcGridRSOSingapore {
        function Create() : IMcGridRSOSingapore; 
        var GRID_COOR_SYS_TYPE : number;
    }

    interface IMcGridCoordSystemLambertConicConformic extends IMcGridCoordinateSystem {}
    
    interface IMcSpatialQueries extends IMcBase {
        GetQuerySecondaryDtmLayers(): IMcDtmMapLayer[];
        GetInterfaceType() : number;
        GetDevice() : IMcMapDevice;
	    GetOverlayManager() : IMcOverlayManager;
        GetCoordinateSystem() : IMcGridCoordinateSystem;
        GetViewportID() : number;
        /**
         * @param pbCanPerformSyncQuery            pbCanPerformSyncQuery.Value :    boolean   
         * @param pbCanPerformAsyncQuery           pbCanPerformAsyncQuery.Value :   boolean
         */
         CanPerformQuery(bQuerySupportedByNonNativeServer : boolean, pbCanPerformSyncQuery : any, pbCanPerformAsyncQuery : any, 
            pParams? : IMcSpatialQueries.SQueryParams, pLayer? : IMcMapLayer) : void;
        SetTerrainQueriesNumCacheTiles(pTerrain : IMcMapTerrain, eLayerKind : IMcMapLayer.ELayerKind, uNumTiles : number) : void;
        GetTerrainQueriesNumCacheTiles(pTerrain : IMcMapTerrain, eLayerKind : IMcMapLayer.ELayerKind) : number;
        GetTerrains() : IMcMapTerrain[];
        GetTerrainsBoundingBox() :SMcBox;
        /**
         * @param pdHeight                         pdHeight.Value :     number   
         * @param pNormal                          pNormal.Value :      SMcVector3D   
         */
        GetTerrainHeight(Point : SMcVector3D, pdHeight : any, pNormal? : any, pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        GetTerrainHeightMatrix(LowerLeftPoint : SMcVector3D, dHorizontalResolution : number, dVerticalResolution : number,
		    uNumHorizontalPoints : number, uNumVerticalPoints : number, pParams? : IMcSpatialQueries.SQueryParams) : Float64Array;
        /**
         * @param pdPitch                          pdPitch.Value :     number   
         * @param pdRoll                           pdRoll.Value :      number
         */
        GetTerrainAngles(Point : SMcVector3D, dAzimuth : number, pdPitch : any, pdRoll : any,
		    pParams? : IMcSpatialQueries.SQueryParams) : void;
        /**
         * @param pIntersection          pIntersection.Value :       SMcVector3D
         * @param pNormal                pNormal.Value :             SMcVector3D
         * @param pdDistance             pdDistance.Value :          number
         */
        GetRayIntersection(RayOrigin :SMcVector3D, RayDirection : SMcVector3D, dMaxDistance : number,
		 	pIntersection? : any, pNormal? : any, pdDistance? : any, pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        GetRayIntersectionTargets(RayOrigin : SMcVector3D, RayDirection : SMcVector3D, dMaxDistance : number,
		    pParams? : IMcSpatialQueries.SQueryParams) : IMcSpatialQueries.STargetFound[];
        /**
         * @param pdCrestClearanceAngle                          pdCrestClearanceAngle.Value :         number   
         * @param pdCrestClearanceDistance                       pdCrestClearanceDistance.Value :      number
         */
        GetLineOfSight(Scouter : SMcVector3D, bIsScouterHeightAbsolute : boolean, Target : SMcVector3D,
		 bTargetHeightAbsolute : boolean, pdCrestClearanceAngle? : any,
		 pdCrestClearanceDistance? : any, dMaxPitchAngle? : number,
		 dMinPitchAngle? : number, pParams? : IMcSpatialQueries.SQueryParams) : IMcSpatialQueries.SLineOfSightPoint[];
        /**
         * @param pMinimalTargetHeightForVisibility           pMinimalTargetHeightForVisibility.Value :      number               
         * @param pMinimalScouterHeightForVisibility          pMinimalScouterHeightForVisibility.Value :     number
         */
        GetPointVisibility(Scouter : SMcVector3D, bIsScouterHeightAbsolute : boolean, Target : SMcVector3D,
		   bTargetHeightAbsolute : boolean, pMinimalTargetHeightForVisibility? : any, pMinimalScouterHeightForVisibility? : any,
		   dMaxPitchAngle? : number, dMinPitchAngle? : number,
		   pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        /**
         * @param ppAreaOfSight         ppAreaOfSight.Value : IMcSpatialQueries.IAreaOfSight
         * @param paLinesOfSight        array created by the user, allocated and filled by MapCore
         * @param pSeenPolygons         pSeenPolygons.Value : SPolygonsOfSight
         * @param pUnseenPolygons       pUnseenPolygons.Value : SPolygonsOfSight
         * @param paSeenStaticObjects   array created by the user, allocated and filled by MapCore
         */
        GetPolygonAreaOfSight(Scouter : SMcVector3D, bIsScouterHeightAbsolute : boolean, aTargetPolygonPoints : SMcVector3D,
            dTargetHeight : number, bTargetsHeightAbsolute : boolean, fTargetResolutionInMeters : number,
            dRotationAngle : number, uNumRaysPer360Degrees : number, aVisibilityColors : SMcBColor[],
            ppAreaOfSight? : any, paLinesOfSight? : IMcSpatialQueries.SLineOfSightPoint[][], pSeenPolygons? :any, pUnseenPolygons? : any,
            paSeenStaticObjects? : IMcSpatialQueries.SStaticObjectsIDs[], dMaxPitchAngle? : number, dMinPitchAngle? : number, pParams? : IMcSpatialQueries.SQueryParams, bGPUBased? : boolean) : void;
        /**
         * @param ppAreaOfSight         ppAreaOfSight.Value : IMcSpatialQueries.IAreaOfSight
         * @param paLinesOfSight        array created by the user, allocated and filled by MapCore
         * @param pSeenPolygons         pSeenPolygons.Value : SPolygonsOfSight
         * @param pUnseenPolygons       pUnseenPolygons.Value : SPolygonsOfSight
         * @param paSeenStaticObjects   array created by the user, allocated and filled by MapCore
         */
        GetRectangleAreaOfSight(Scouter : SMcVector3D, bIsScouterHeightAbsolute: boolean, dRectangletHeight : boolean,
		    dRectangleWidth : number, dRotationAngle : number, dTargetHeight : number, bTargetsHeightAbsolute : boolean,
		    fTargetResolutionInMeters : number,	uNumRaysPer360Degrees : number, aVisibilityColors : SMcBColor[],
            ppAreaOfSight? : any, paLinesOfSight? : IMcSpatialQueries.SLineOfSightPoint[][], pSeenPolygons? :any, pUnseenPolygons? : any, paSeenStaticObjects? : IMcSpatialQueries.SStaticObjectsIDs[], 
            dMaxPitchAngle? : number, dMinPitchAngle? : number, pParams? : IMcSpatialQueries.SQueryParams, bGPUBased? : boolean) : void;
        /**
         * @param ppAreaOfSight         ppAreaOfSight.Value : IMcSpatialQueries.IAreaOfSight
         * @param paLinesOfSight        array created by the user, allocated and filled by MapCore
         * @param pSeenPolygons         pSeenPolygons.Value : SPolygonsOfSight
         * @param pUnseenPolygons       pUnseenPolygons.Value : SPolygonsOfSight
         * @param paSeenStaticObjects   array created by the user, allocated and filled by MapCore
         */
        GetEllipseAreaOfSight(Scouter : SMcVector3D, bIsScouterHeightAbsolute : boolean, dTargetHeight : number,
		    bTargetsHeightAbsolute : boolean, fTargetResolutionInMeters : number, fRadiusX : number,
            fRadiusY : number, fStartAngle : number, fEndAngle : number, fRotationAngle : number, uNumRaysPer360Degrees : number,
            aVisibilityColors : SMcBColor[], ppAreaOfSight? : any, paLinesOfSight? : IMcSpatialQueries.SLineOfSightPoint[][], pSeenPolygons? : any,
            pUnseenPolygons? : any, paSeenStaticObjects? : IMcSpatialQueries.SStaticObjectsIDs[], dMaxPitchAngle? : number, dMinPitchAngle? : number,
            pParams? : IMcSpatialQueries.SQueryParams, bGPUBased? : any) : void;
        /**
         * @param ppAreaOfSight         ppAreaOfSight.Value : IMcSpatialQueries.IAreaOfSight
         */
        GetEllipseAreaOfSightForMultipleScouters(Scouters : SMcVector3D[], bIsScoutersHeightsAbsolute : boolean, dTargetHeight : number, bTargetsHeightAbsolute : boolean, fTargetResolutionInMeters : number,
            TargetEllipseCenter : SMcVector3D, fRadiusX : number, fRadiusY : number, uNumRaysPer360Degrees : number, eScoutersSumType : IMcSpatialQueries.EScoutersSumType, ppAreaOfSight : any, 
            dMaxPitchAngle? : number, dMinPitchAngle? : number, pParams? : IMcSpatialQueries.SQueryParams, bGPUBased? : boolean) : void;
        GetBestScoutersLocationsInEllipse(TargetEllipseCenter : SMcVector3D, dTargetHeight : number, bTargetsHeightAbsolute : boolean, fRadiusX : number, fRadiusY : number, ScoutersCenter : SMcVector3D, 
                fScoutersRadiusX : number, fScoutersRadiusY : number, dScoutersHeight : number, bIsScoutersHeightsAbsolute : boolean, uMaxNumOfScouters : number, 
                pParams? : IMcSpatialQueries.SQueryParams) : SMcVector3D[];
            /**
         * @param pafSlopes                     pafSlopes.Value : Float32Array
         * @param pSlopesData                   pSlopesData.Value : IMcSpatialQueries.SSlopesData
         */
        GetTerrainHeightsAlongLine(LineVertices : SMcVector3D[], pafSlopes? : any, pSlopesData? : any, pParams? : IMcSpatialQueries.SQueryParams) : SMcVector3D[];
        /**
         * @param pHighestPoint    pHighestPoint.Value : SMcVector3D
         * @param pLowestPoint     pLowestPoint.Value :  SMcVector3D
         */
        GetExtremeHeightPointsInPolygon(aPolygonVertices : SMcVector3D[], pHighestPoint? : any, pLowestPoint? : any, pParams? : IMcSpatialQueries.SQueryParams) : boolean;
        GetDtmLayerTileGeometryByKey(pLayer : IMcDtmMapLayer, TileKey : IMcDtmMapLayer.STileGeometry, bBuildIfPossible : boolean, pParams? : IMcSpatialQueries.SQueryParams) : IMcDtmMapLayer.STileGeometry;
        /**
         * @param peBitmapPixelFormat           peBitmapPixelFormat.Value :       IMcTexture.EPixelFormat               
         * @param pbBitmapFromTopToBottom       pbBitmapFromTopToBottom.Value :   boolean
         * @param pBitmapSize                   pBitmapSize.Value :               SMcSize
         * @param pBitmapMargins                pBitmapMargins.Value :            SMcSize
         */
        GetRasterLayerTileBitmapByKey(pLayer : IMcRasterMapLayer, TileKey : IMcMapLayer.SLayerTileKey, bDecompress : boolean,
		    peBitmapPixelFormat : any, pbBitmapFromTopToBottom : any, pBitmapSize : any, pBitmapMargins : any, pParams? : IMcSpatialQueries.SQueryParams) : Uint8Array;
        GetRasterLayerColorByPoint(pLayer : IMcRasterMapLayer, Point : SMcVector3D, nLOD : number, bNearestPixel : boolean, pParams? : IMcSpatialQueries.SQueryParams) : SMcBColor;
        GetTraversabilityAlongLine(pLayer : IMcTraversabilityMapLayer, aLineVertices : SMcVector3D[], pParams? : IMcSpatialQueries.SQueryParams) : IMcSpatialQueries.STraversabilityPoint[];
        ScanInGeometry(Geometry : SMcScanGeometry, bCompletelyInsideOnly : boolean, pParams? :  IMcSpatialQueries.SQueryParams) : IMcSpatialQueries.STargetFound[];
       	LocationFromTwoDistancesAndAzimuth(FstOrigin : SMcVector3D, FstDistance : number, FstAzimuth : number,
            SndOrigin : SMcVector3D, SndDistance : number, dTargetHeightAboveGround : number, pParams? : IMcSpatialQueries.SQueryParams) : SMcVector3D;
        CancelAsyncQuery(pAsyncQueryCallback : IMcSpatialQueries.IAsyncQueryCallback) : void;
       	GetDebugOption(uKey : number) : number;
       	SetDebugOption(uKey : number, nValue : number) : void;
       	IncrementDebugOption(uKey : number) : void;
    }
    namespace IMcSpatialQueries {
        function Create(CreateData : IMcSpatialQueries.SCreateData, apTerrains? : IMcMapTerrain[], apQuerySecondaryDtmLayers? : IMcDtmMapLayer[]) : IMcSpatialQueries;
        function CloneAreaOfSightMatrix(Source : IMcSpatialQueries.SAreaOfSightMatrix, bFillPointsVisibility : boolean) : IMcSpatialQueries.SAreaOfSightMatrix;
        function SumAreaOfSightMatrices(pMatrix : IMcSpatialQueries.SAreaOfSightMatrix, MatrixToAdd : IMcSpatialQueries.SAreaOfSightMatrix, eScoutersSumType : IMcSpatialQueries.EScoutersSumType) : void;
        function AreSameRectAreaOfSightMatrices(First : IMcSpatialQueries.SAreaOfSightMatrix, Second : IMcSpatialQueries.SAreaOfSightMatrix) : boolean;
        enum EIntersectionTargetType {
                EITT_NONE,					
                EITT_DTM_LAYER,					
                EITT_STATIC_OBJECTS_LAYER,		
                EITT_VISIBLE_VECTOR_LAYER,		
                EITT_NON_VISIBLE_VECTOR_LAYER,	
                EITT_OVERLAY_MANAGER_OBJECT,		
                EITT_ANY_TARGET					
            }
            
            enum EQueryPrecision { 
                EQP_DEFAULT,
                EQP_DEFAULT_PLUS_LOWEST,
                EQP_HIGHEST,
                EQP_HIGH,
                EQP_MEDIUM,
                EQP_LOW,
                EQP_LOWEST
            }

            enum ENoDTMResult {
                ENDR_FAIL,
                ENDR_VISIBLE,
                ENDR_INVISIBLE
            }

            enum EItemPart {
                EAP_VERTEX,					
                EAP_LINE_SEGMENT,			
                EAP_ARC_SEGMENT,			
                EAP_ARROW_HEAD,				
                EAP_MESH_PART,				
                EAP_INSIDE				
            }

            enum EPointVisibility {
                EPV_SEEN,				
                EPV_UNSEEN,				
                EPV_UNKNOWN,			
                EPV_OUT_OF_QUERY_AREA,	
                EPV_SEEN_STATIC_OBJECT,	
                EPV_ASYNC_CALCULATING,
                EPV_NUM					
            }

            enum EPointTraversability {
                EPT_TRAVERSABLE,		
                EPT_UNTRAVERSABLE,		
                EPT_UNKNOWN,			
                EPT_ASYNC_CALCULATING,	
                EPT_NUM					
            }

            enum EScoutersSumType {
                ESST_OR,
                ESST_ADD,
                ESST_ALL
            }
            interface IAsyncQueryCallback {
                /** Optional */
                OnTerrainHeightResults(bHeightFound : boolean, dHeight : number, pNormal : SMcVector3D) : void;
                /** Optional */
                OnTerrainHeightMatrixResults(adHeightMatrix : Float64Array) : void;
                /** Optional */
                OnTerrainHeightsAlongLineResults(aPointsWithHeights : SMcVector3D[], afSlopes : Float32Array, pSlopesData : IMcSpatialQueries.SSlopesData) : void;
                /** Optional */
                OnExtremeHeightPointsInPolygonResults(bPointsFound : boolean, pHighestPoint : SMcVector3D, pLowestPoint : SMcVector3D) : void;
                /** Optional */
                OnTerrainAnglesResults(dPitch : number, dRoll : number) : void;
                /** Optional */
                OnRayIntersectionResults(bIntersectionFound : boolean, pIntersection : SMcVector3D, pNormal : SMcVector3D, pdDistance : number) : void;
                /** Optional */
                OnRayIntersectionTargetsResults(aIntersections : IMcSpatialQueries.STargetFound[]) : void;
                /** Optional */
                OnLineOfSightResults(aPoints : IMcSpatialQueries.SLineOfSightPoint[], dCrestClearanceAngle : number, dCrestClearanceDistance : number) : void;
                /** Optional */
                OnPointVisibilityResults(bIsTargetVisible : boolean, pdMinimalTargetHeightForVisibility : number, pdMinimalScouterHeightForVisibility : number) : void;
                /** Optional */
                OnAreaOfSightResults(pAreaOfSight : IMcSpatialQueries.IAreaOfSight, aLinesOfSight : IMcSpatialQueries.SLineOfSightPoint[][], pSeenPolygons : IMcSpatialQueries.SPolygonsOfSight, pUnseenPolygons : IMcSpatialQueries.SPolygonsOfSight, aSeenStaticObjects : IMcSpatialQueries.SStaticObjectsIDs[]) : void;
                /** Optional */
                OnBestScoutersLocationsResults(aScouters: SMcVector3D[]) : void;
                /** Optional */
                OnLocationFromTwoDistancesAndAzimuthResults(Target : SMcVector3D) : void;
                /** Optional */
                OnDtmLayerTileGeometryByKeyResults(TileGeometry : IMcDtmMapLayer.STileGeometry) : void;
                /** Optional */
                OnRasterLayerTileBitmapByKeyResults(eBitmapPixelFormat : IMcTexture.EPixelFormat, bBitmapFromTopToBottom : boolean,
                    BitmapSize : SMcSize, BitmapMargins : SMcSize, aBitmapBits : Uint8Array) : void;
                /** Optional */
                OnRasterLayerColorByPointResults(Color : SMcBColor) : void;
                /** Optional */
                OnTraversabilityAlongLineResults(aTraversabilitySegments : IMcSpatialQueries.STraversabilityPoint[]) : void;
                /** Mandatory */
                OnError(eErrorCode : IMcErrors.ECode) : void;
            }
            namespace IAsyncQueryCallback {
                function extend(strName : string, Class : any) : IAsyncQueryCallback;
            }

            class SQueryParams {
                constructor();
                uTargetsBitMask : number;
                uMaxNumTargetsToFind : number;
                fBoundingBoxExpansionDist : number;
                pOverlayFilter : IMcOverlay;
                uItemKindsBitField : number;
                uItemTypeFlagsBitField : number;
                eTerrainPrecision : IMcSpatialQueries.EQueryPrecision;
                bUseMeshBoundingBoxOnly : boolean;
                bUseFlatEarth : boolean;
                bAddStaticObjectContours : boolean;
                fGreatCirclePrecision: number;
                eNoDTMResult : IMcSpatialQueries.ENoDTMResult;
                pAsyncQueryCallback : IAsyncQueryCallback;
            }

            class SObjectItemFound {
                constructor();
                pObject : IMcObject;
                pItem : IMcObjectSchemeItem;
                uSubItemID : number;
                ePartFound : IMcSpatialQueries.EItemPart;
                uPartIndex : number;
            }

            class SStaticObjectContour {
                aPoints: SMcVector3D[];
                dRelativeHeight : number;
            }

            class STargetFound {
                constructor();
                eTargetType : IMcSpatialQueries.EIntersectionTargetType;
                IntersectionPoint : SMcVector3D;
                eIntersectionCoordSystem : EMcPointCoordSystem;
                pTerrain : IMcMapTerrain;
                pTerrainLayer : IMcMapLayer;
                uTargetID : SMcVariantID;
                ObjectItemData : SObjectItemFound;
                aStaticObjectContours : SStaticObjectContour[];
                aStaticObjectProperties : SMcKeyStringValue[];
            }

            class SCreateData {
                constructor();
                pDevice : IMcMapDevice;
                pCoordinateSystem : IMcGridCoordinateSystem;
                pOverlayManager : IMcOverlayManager;
                uViewportID : number;
            }
            
            class SLineOfSightPoint {
                constructor();
                Point : SMcVector3D;
                bVisible : boolean;
            }

            class SAreaOfSightMatrix {
                constructor();
                uWidth : number;
                uHeight : number;
                fAngle : number;
                fTargetResolutionInMeters : number;
                fTargetResolutionInMapUnitsX : number;
                fTargetResolutionInMapUnitsY : number;
                LeftTopPoint : SMcVector3D;				
                RightTopPoint : SMcVector3D;				
                LeftBottomPoint : SMcVector3D;			
                RightBottomPoint : SMcVector3D;
                aPointsVisibilityColors : SMcBColor[];		
            }
            class IAreaOfSight {
                Save(strFileName : string) : void;
                GetAreaOfSightMatrix(bFillPointsVisibility : boolean) : IMcSpatialQueries.SAreaOfSightMatrix;
                GetPointVisibilityColor(Point : SMcVector3D) : SMcBColor;
                GetPointVisibilityColorsSurrounding(Point : SMcVector3D, NumVisibilityColorsX : number, NumVisibilityColorsY : number) : Uint32Array;
                GetVisibilityColors() : SMcBColor[];
            }
            namespace IAreaOfSight {
                function Load(strFileName : string) : IMcSpatialQueries.IAreaOfSight;
            }
            class SPolygonsOfSight {
                constructor();
		        aaContoursPoints : SMcVector3D[][];
            }
            class SStaticObjectsIDs {
                constructor();
                pMapLayer : IMcStaticObjectsMapLayer;
                auIDs : SMcVariantID[];
                aaStaticObjectsContours : SStaticObjectContour[][];
                aaStaticObjectsProperties : SMcKeyStringValue[][];
            }
            class STraversabilityPoint {
                Point : SMcVector3D;
                eTraversability : IMcSpatialQueries.EPointTraversability;
            }
            class SSlopesData {
                constructor();
                fMaxSlope : number;
                fMinSlope : number;
                fHeightDelta : number;
            }
            class ICoverageQuality {
                GetQuality(Location : SMcVector3D, eType : IMcSpatialQueries.ICoverageQuality.ETargetType, fMovementAngle : number) : number;
            }
            namespace ICoverageQuality {
                function Create(sAreaOfSightMatrix : IMcSpatialQueries.SAreaOfSightMatrix,
                    aVisibilityColors : SMcBColor[],
                    QualityParams : IMcSpatialQueries.ICoverageQuality.SQualityParams) : IMcSpatialQueries.ICoverageQuality;
                class SQualityParams {
                    constructor();
                    fStandingRadius : number;
                    fWalkingRadius : number;
                    fVehicleRadius : number;
                    uCellFactor : number;
                }
                enum ETargetType {
                    ETT_STANDING, 
                    ETT_WALKING, 
                    ETT_VEHICLE
                }
            }
        var INTERFACE_TYPE: number;
        }
        class SMcScanGeometry {
            eCoordinateSystem : EMcPointCoordSystem;
            uGeometryType : number;
        }
        class SMcScanPointGeometry  extends SMcScanGeometry {
            constructor(_eCoordinateSystem : EMcPointCoordSystem, Point : SMcVector3D, _fPointAndLineTolerance : number);
            static GEOMETRY_TYPE : number;
        }
        class SMcScanBoxGeometry extends SMcScanGeometry {
            constructor(_eCoordinateSystem : EMcPointCoordSystem, _Box : SMcBox);
            static GEOMETRY_TYPE : number;
        }
        class SMcScanPolygonGeometry extends SMcScanGeometry {
            constructor(_eCoordinateSystem : EMcPointCoordSystem , _aPolygonVertices :SMcVector3D[]);
            static GEOMETRY_TYPE : number;
        }
    
        interface IMcPrintMap {
         /**
         * @param pauFileMemoryBuffer           pauFileMemoryBuffer.Value :     Uint8Array
         */
          PrintScreenToRawRasterData(fResolutionFactor : number, strFileNameOrRasterDataFormat : string, pauFileMemoryBuffer? : any, pauWorldFileMemoryBuffer? : any, 
            pCallback? : IMcPrintMap.IPrintCallback, astrGdalOptions? : string[]) : void;
         /**
         * @param pauFileMemoryBuffer           pauFileMemoryBuffer.Value :     Uint8Array
         */
          PrintRect2DToRawRasterData(PrintWorldRectCenter: SMcVector2D, PrintWorldRectSize : SMcVector2D, fPrintWorldRectAngle : number, fPrintScale : number, 
                fResolutionFactor : number, strFileNameOrRasterDataFormat : string, pauFileMemoryBuffer? : any, pauWorldFileMemoryBuffer? : any, 
                pCallback? : IMcPrintMap.IPrintCallback, astrGdalOptions? : string[], bPrintGeoInMetricProportion? : boolean) : void;
            CancelAsyncPrint(pCallback : IMcPrintMap.IPrintCallback) : void;
        }
        namespace IMcPrintMap {
            interface IPrintCallback {
                /** Optional */
                OnPrintFinished(eStatus : IMcErrors.ECode, strFileNameOrRasterDataFormat : string, auFileMemoryBuffer : Uint8Array, auWorldFileMemoryBuffer : Uint8Array) : void;
            }
            namespace IPrintCallback {
                function extend(strName : string, Class : any) : IPrintCallback;
            }
        }
        
////////////////////////////////////////////////////////////////////////////////////////
// IMcEditMode

    interface IMcEditMode extends IMcDestroyable {
        AutoScroll(bAutoScroll : boolean, nMarginsSize : number) : void;
        SetUtilityItems(pRectangle : IMcRectangleItem, pLine : IMcLineItem,	pText : IMcTextItem) : void;
        SetUtilityPicture(pIcon : IMcPictureItem, eType : IMcEditMode.EUtilityPictureType) : void;
        SetUtility3DEditItem(pEditItem : IMcObjectSchemeItem, eType : IMcEditMode.EUtility3DEditItemType) : void;
        Set3DEditParams(Params : IMcEditMode.S3DEditParams) : void;
	    SetRotatePictureOffset(fOffset : number) : void;
        SetMaxNumberOfPoints(uMaxNumberOfPoints : number, bForceFinishOnMaxPoints : boolean) : void;
        SetIntersectionTargets(uTargetsBitMask : number) : void;
        SetEventsCallback(pEventsCallback : IMcEditMode.ICallback) : void;
        GetEventsCallback() : IMcEditMode.ICallback;
        SetPermissions(uPermissionsBitField : number) : void;
        SetHiddenIconsPerPermission(ePermission : IMcEditMode.EPermission, auIconIndices : Uint8Array) : void;
        SetMaxRadius(dMaxRadius : number,  eCoordSystem : EMcPointCoordSystem) : void;
        SetCameraPitchRange(dMinPitch : number, dMaxPitch : number) : void;
        GetAutoScrollMode() : boolean;
        GetMarginSize() : number;
        /**
         * @param pRectangle      pRectangle.Value : IMcRectangleItem
         * @param pLine           pLine.Value : IMcLineItem
         * @param pText           pText.Value : IMcTextItem
         */
        GetUtilityItems(pRectangle : any, pLine : any, pText : any) : void;
        GetUtilityPicture(eType : IMcEditMode.EUtilityPictureType) : IMcPictureItem;
        GetUtility3DEditItem(eType : IMcEditMode.EUtility3DEditItemType) : IMcObjectSchemeItem;
        Get3DEditParams() : IMcEditMode.S3DEditParams;
        GetRotatePictureOffset() : number;
        /**
         * @param puMaxNumberOfPoints            puMaxNumberOfPoints.Value : number
         * @param pbForceFinishOnMaxPoints       pbForceFinishOnMaxPoints.Value : boolean
         */
        GetMaxNumberOfPoints(puMaxNumberOfPoints : any, pbForceFinishOnMaxPoints : any) : void;
        GetIntersectionTargets() : number;
        GetPermissions() : number;
        GetHiddenIconsPerPermission(ePermission: IMcEditMode.EPermission): Uint32Array;
        GetIconsScreenPositions(): IMcEditMode.SIconPosition[]
        GetMaxRadius(eCoordSystem : EMcPointCoordSystem) : number;
        /**
         * @param pdMinPitch            pdMinPitch.Value : number
         * @param pdMaxPitch            pdMaxPitch.Value : number
         */
        GetCameraPitchRange(pdMinPitch : any, pdMaxPitch : any) : void;
        GetLastExitStatus() : number;
        StartInitObject(pObject : IMcObject, pItem? : IMcObjectSchemeItem, bEnableDistanceDirectionMeasureForMultiPointItem? : boolean) : void;
        StartEditObject(pObject : IMcObject, pItem? : IMcObjectSchemeItem, bEnableAddingNewPointsForMultiPointItem? : boolean) : void;
        StartNavigateMap(bDrawLine : boolean, bOneOperationOnly? : boolean, bWaitForMouseClick? : boolean, MousePos? : SMcPoint, pLine? : MapCore.IMcLineItem) : void;
        StartDistanceDirectionMeasure(bShowResults? : boolean, bWaitForMouseClick? : boolean, MousePos? : SMcPoint) : void;
        StartDynamicZoom(fMinScale? : number, bWaitForMouseClick? : boolean, MousePos? : SMcPoint, pRectangle? : IMcRectangleItem,
		 e3DOperation? : IMcMapCamera.ESetVisibleArea3DOperation) : void;
        StartCalculateHeightInImage(pLine : IMcLineItem) : void;
        StartCalculateVolumeInImage(pLine : IMcLineItem) : void;
         /**
          * @param pbRenderNeeded          pbRenderNeeded.Value : boolean
          * @param peCursorType            peCursorType.Value :   IMcEditMode.ECursorType
          */
        OnMouseEvent(eEvent : IMcEditMode.EMouseEvent , MousePosition : SMcPoint, bControlKeyDown : boolean , nWheelDelta : number,	pbRenderNeeded : any, peCursorType : any, pSecondTouchPosition? : SMcPoint) : void;
        /**
         * @param pbRenderNeeded          pbRenderNeeded.Value : boolean
         */
        OnKeyEvent(eEvent : IMcEditMode.EKeyEvent, pbRenderNeeded : any) : void;
        SetKeyStep(eStepType : IMcEditMode.EKeyStepType , fStep : number) : void;
        GetKeyStep(eStepType : IMcEditMode.EKeyStepType) : number;
        IsEditingActive() : boolean;
        ExitCurrentAction(bDiscard : boolean) : void;
        SetMouseMoveUsageForMultiPointItem(eMouseMoveUsage : IMcEditMode.EMouseMoveUsage) : void;
        GetMouseMoveUsageForMultiPointItem() : IMcEditMode.EMouseMoveUsage ;
        AddOverlayManagerWorldPoint(WorldPoint : SMcVector3D) : number;
        SetPointAndLineClickTolerance(uTolerance : number) : void;
        GetPointAndLineClickTolerance() : number;
        SetRectangleResizeRelativeToCenter(bRelativeToCenter : boolean) : void;
        GetRectangleResizeRelativeToCenter() : boolean;
        SetAutoSuppressQueryPresentationMapTilesWebRequests(bSuppress : boolean) : void;
        GetAutoSuppressQueryPresentationMapTilesWebRequests() : boolean;
        ChangeObjectOperationsParams(Params : IMcEditMode.SObjectOperationsParams, bForOneOperationOnly? : boolean) : void;
        GetObjectOperationsParams() : IMcEditMode.SObjectOperationsParams;
        SetAutoChangeObjectOperationsParams(bChange : boolean) : void;
        GetAutoChangeObjectOperationsParams() : boolean;
        SetDistanceDirectionMeasureParams(Params: IMcEditMode.SDistanceDirectionMeasureParams) : void;
        GetDistanceDirectionMeasureParams() : IMcEditMode.SDistanceDirectionMeasureParams;
    }

    namespace IMcEditMode {
        function Create(pViewport : IMcMapViewport) : IMcEditMode;
        enum ECursorType {
            ECT_DEFAULT_CURSOR,	
            ECT_DRAG_CURSOR,	
            ECT_MOVE_CURSOR,	
            ECT_EDIT_CURSOR		
        }

        enum EMouseEvent {
            EME_BUTTON_PRESSED,				
            EME_BUTTON_RELEASED,			
            EME_BUTTON_DOUBLE_CLICK,		
            EME_MOUSE_MOVED_BUTTON_DOWN,	
            EME_MOUSE_MOVED_BUTTON_UP,		
            EME_MOUSE_WHEEL,
            EME_SECOND_TOUCH_PRESSED,
            EME_SECOND_TOUCH_RELEASED
        }

        enum EKeyEvent {
            EKE_MOVE_LEFT,		
            EKE_MOVE_RIGHT,		
            EKE_MOVE_UP,		
            EKE_MOVE_DOWN,		
            EKE_RAISE,			
            EKE_LOWER,			
            EKE_ROTATE_LEFT,	
            EKE_ROTATE_RIGHT,	
            EKE_ROTATE_UP,		
            EKE_ROTATE_DOWN,	
            EKE_DELETE_VERTEX,	
            EKE_NEXT_ICON,		
            EKE_PREV_ICON,		
            EKE_CONFIRM,		
            EKE_ABORT,			
        }

        enum EKeyStepType {
            EKST_MAP_MOVE_PIXELS, 
            EKST_OBJECT_MOVE_PIXELS, 
            EKST_ROTATION_DEGREES, 
            EKST_3D_EDIT_MOVE_WORLD_UNITS, 
            EKST_3D_EDIT_RESIZE_FACTOR
        }

        enum EPermission {
            EEMP_NONE, 
            EEMP_MOVE_VERTEX, 
            EEMP_BREAK_EDGE, 
            EEMP_RESIZE, 
            EEMP_ROTATE, 
            EEMP_DRAG, 
            EEMP_FINISH_TEXT_STRING_BY_KEY
        }

        enum EUtilityPictureType {
            EUPT_VERTEX_ACTIVE,
            EUPT_VERTEX_REGULAR, 
            EUPT_MID_EDGE_ACTIVE, 
            EUPT_MID_EDGE_REGULAR, 
            EUPT_MOVE_ITEM_ACTIVE, 
            EUPT_MOVE_ITEM_REGULAR,
            EUPT_MOVE_PART_ACTIVE, 
            EUPT_MOVE_PART_REGULAR,	
            EUPT_ITEM_ROTATE_ACTIVE, 
            EUPT_ITEM_ROTATE_REGULAR, 
            EUPT_TYPES
        }

        enum EUtility3DEditItemType {
            EUEIT_MOVE_ITEM_CENTER_ACTIVE, 
            EUEIT_MOVE_ITEM_CENTER_REGULAR, 
            EUEIT_MOVE_ITEM_X_ACTIVE, 
            EUEIT_MOVE_ITEM_X_REGULAR,
            EUEIT_MOVE_ITEM_Y_ACTIVE, 
            EUEIT_MOVE_ITEM_Y_REGULAR, 
            EUEIT_MOVE_ITEM_Z_ACTIVE, 
            EUEIT_MOVE_ITEM_Z_REGULAR,
            EUEIT_RESIZE_ITEM_X_ACTIVE,	
            EUEIT_RESIZE_ITEM_X_REGULAR, 
            EUEIT_RESIZE_ITEM_Y_ACTIVE, 
            EUEIT_RESIZE_ITEM_Y_REGULAR,
            EUEIT_RESIZE_ITEM_Z_ACTIVE, 
            EUEIT_RESIZE_ITEM_Z_REGULAR, 
            EUEIT_ROTATE_ITEM_YAW_ACTIVE, 
            EUEIT_ROTATE_ITEM_YAW_REGULAR,
            EUEIT_ROTATE_ITEM_PITCH_ACTIVE, 
            EUEIT_ROTATE_ITEM_PITCH_REGULAR, 
            EUEIT_ROTATE_ITEM_ROLL_ACTIVE, 
            EUEIT_ROTATE_ITEM_ROLL_REGULAR, 
            EUEIT_TYPES
        }

        enum EMouseMoveUsage {
            EMMU_REGULAR, 
            EMMU_IGNORED, 
            EMMU_ADDS_POINT,
            EMMU_TYPES
        }

        class SMeasureTextParams {
            constructor();
            dUnitsFactor : number;
            UnitsName : SMcVariantString;
            uNumDigitsAfterDecimalPoint : number;
        }

        class SDistanceDirectionMeasureParams {
            constructor();
            pDistanceTextParams : SMeasureTextParams;
            pAngleTextParams : SMeasureTextParams;
            pHeightTextParams : SMeasureTextParams;
            pText : IMcTextItem;
            pLine : IMcLineItem;
            pDirectionCoordSys : IMcGridCoordinateSystem;
            bUseMagneticAzimuth : boolean;
            pDate : Date;
        }

        class S3DEditParams {
            constructor();
            bLocalAxes : boolean;
            bKeepScaleRatio : boolean;
            fUtilityItemsOptionalScreenSize : number;
        }

        class SPermissionHiddenIcons {
            constructor();
            ePermission : EPermission;
            auIconIndices : Uint32Array;
        }

        class SIconPosition {
            constructor();
            ScreenPosition : SMcVector2D;
            ePermission : EPermission;
            uIndex : number;
            bIsActive : boolean;
        }
        
        class SObjectOperationsParams {
            constructor();
            uPermissions : IMcEditMode.EPermission;
            aPermissionsWithHiddenIcons : IMcEditMode.SPermissionHiddenIcons[];
            apUtilityPictures : IMcPictureItem[];
            pUtilityLine : IMcLineItem;
            bUtilityLineOverriden : boolean;
            fRotatePictureOffset : number;
            eMouseMoveUsageForMultiPointItem : IMcEditMode.EMouseMoveUsage;
            uPointAndLineClickTolerance : number;
            uMaxNumberOfPoints : number;
            bForceFinishOnMaxPoints : boolean;
            dMaxRadiusForImageCoordSys : number;
            dMaxRadiusForWorldCoordSys : number;
            dMaxRadiusForScreenCoordSys : number;
            bRectangleResizeRelativeToCenter : boolean;
            ap3DEditUtilityItems : IMcObjectSchemeItem[];
            b3DEditLocalAxes : boolean;
            b3DEditKeepScaleRatio : boolean;
            f3DEditUtilityItemsOptionalScreenSize : number;
            static IsDefault(Params : SObjectOperationsParams) : boolean;
            
        }

        interface ICallback {
            /** Optional */
            NewVertex(pObject : IMcObject, pItem : IMcObjectSchemeItem, WorldVertex : SMcVector3D, ScreenVertex : SMcVector3D, uVertexIndex : number, dAngle : number) : void;
            /** Optional */
            PointDeleted(pObject : IMcObject, pItem : IMcObjectSchemeItem,WorldVertex : SMcVector3D, ScreenVertex : SMcVector3D, uVertexIndex : number) : void;
            /** Optional */
            PointNewPos(pObject : IMcObject, pItem : IMcObjectSchemeItem, WorldVertex : SMcVector3D, ScreenVertex : SMcVector3D, uVertexIndex : number, dAngle : number, bDownOnHeadPoint : boolean) : void; 
            /** Optional */
            ActiveIconChanged(pObject : IMcObject, pItem : IMcObjectSchemeItem, eIconPermission : IMcEditMode.EPermission,  uIconIndex : number) : void; 
            /** Optional */
            InitItemResults(pObject : IMcObject, pItem : IMcObjectSchemeItem, nExitCode : number) : void;
            /** Optional */
            EditItemResults(pObject : IMcObject, pItem : IMcObjectSchemeItem, nExitCode : number) : void;
            /** Optional */
            DragMapResults(pViewport : IMcMapViewport, NewCenter : SMcVector3D) : void;
            /** Optional */
            RotateMapResults(pViewport : IMcMapViewport, fNewYaw : number, fNewPitch : number) : void;
            /** Optional */
            DynamicZoomResults(pViewport : IMcMapViewport, fNewScale : number, NewCenter : SMcVector3D) : void;
            /** Optional */
            DistanceDirectionMeasureResults(pViewport : IMcMapViewport, WorldVertex1 : SMcVector3D, WorldVertex2 : SMcVector3D, dDistance : number, dAngle : number) : void; 
            /** Optional */
            CalculateHeightResults(pViewport : IMcMapViewport, dHeight : number, aCoords : SMcVector3D[], nStatus : number) : void;
            /** Optional */
            CalculateVolumeResults(pViewport : IMcMapViewport, dVolume : number, aCoords : SMcVector3D[], nStatus : number) : void;
            /** Optional */
            ExitAction(nExitCode : number) : void;
            /** Optional */ 
            Release() : void;
        }
        namespace ICallback {
            function extend(strName : string, Class : any) : ICallback;
        }
    }

    namespace IMcErrors {
        function ErrorCodeToString(eErrorCode: IMcErrors.ECode) : string;
        function GetLastStorageErrorDetailedString() : string;
        enum ECode {
            SUCCESS, FAILURE, NOT_IMPLEMENTED, INVALID_PARAMETERS, INVALID_ARGUMENT, NOT_INITIALIZED, CANNOT_ALLOC_BUFFER, GDI_FAILURE,
            FILE_NOT_FOUND, RESOURCE_FILE_NOT_LOADED, RESOURCE_NOT_FOUND, FONT_ATLAS_FAILURE, COORDINATE_SYSTEMS_MISMATCH, COORDINATES_NOT_CONVERTED, COORDINATE_NOT_IN_AREA, RENDERING_DEVICE_LOST,
            CONFIGURATION_FILE_NOT_FOUND, RESOURCE_LOCATION_NOT_FOUND, ILLEGAL_COORDINATE, CANT_READ_FILE, PREV_ASYNC_OPERATION_NOT_FINISHED, ASYNC_OPERATION_CANCELED, 
            PRODUCTION_OUT_OF_MEMORY, PRODUCTION_CANT_EMPTY_DEST_DIR, PRODUCTION_CANT_CREATE_DEST_DIR, PRODUCTION_MISSING_SRC_IMAGES,
            PRODUCTION_CANT_READ_FILE, PRODUCTION_CANT_WRITE_FILE, PRODUCTION_CANT_READ_IMAGE_FILE, PRODUCTION_CANT_RESIZE_IMAGE_FILE, PRODUCTION_CANT_READ_DTM_FILE, PRODUCTION_CANT_ADD_IMAGE_FILE, PRODUCTION_CANT_ADD_DTM_FILE, PRODUCTION_SRC_FILES_NOT_FOUND,
            PRODUCTION_CANT_GET_TERRAIN_RES, PRODUCTION_DIFFERENT_TILE_SIZE, PRODUCTION_DIFFERENT_TEX_MARGIN, PRODUCTION_CANT_GET_IMAGE_SIZE, PRODUCTION_INVALID_TEX_RESOLUTION, PRODUCTION_INVALID_DTM_RESOLUTION, PRODUCTION_NO_TERRAIN_IN_DEST_DIR, PRODUCTION_CANT_READ_TILES_FILE,
            PRODUCTION_INVALID_SRC_FILE_PARAMS, PRODUCTION_MORE_THAN_ONE_IMAGE_FILE, PRODUCTION_FILE_FORMAT_NOT_SUPPORTED, PRODUCTION_CANT_PROCESS_STATIC_OBJECTS, PRODUCTION_STATIC_OBJECTS_NO_DEST_FILES, PRODUCTION_INCOMPATIBLE_RECOVERY_DATA, PRODUCTION_CANT_WRITE_RECOVERY_DATA, PRODUCTION_CANT_READ_RECOVERY_DATA,
            OBJECT_EXISTS_IN_COLLECTION, OVERLAY_EXISTS_IN_COLLECTION, OBJECT_NOT_FOUND_IN_COLLECTION, OVERLAY_NOT_FOUND_IN_COLLECTION, NOT_THE_SAME_OVERLAY_MANAGER, NO_OVERLAY, OVERLAY_ALREADY_REMOVED, OBJECTS_NOT_FOUND,
            PROPERTY_DOES_NOT_EXIST_IN_TABLE, CANT_SET_RESERVED_PROPERTY_ID, PROPERTY_TYPE_MISMATCH, RELATIVE_TO_DTM_CANNOT_BE_USED, ID_ALREADY_EXISTS, ID_NOT_FOUND, NAME_NOT_FOUND, NO_OVERLAY_MANAGER,
            CONDITIONAL_SELECTOR_DOES_NOT_EXIST, CANNOT_SET_CONDITIONAL_SELECTOR, PRODUCING_NODES_CONNECTION_LOOP, CANNOT_CONVERT_VERTEX, THE_PROPERTY_CANT_BE_SET_PER_VIEWPORT, OBJECT_STATE_CONDITIONAL_SELECTOR_CANT_BE_USED, SYMBOLOGY_SUPPORT_INIT_FAILED, SYMBOLOGY_SYMBOL_ID_NOT_FOUND,
            SYMBOLOGY_SYMBOL_ID_INVALID_UPDATE, OBJECT_WAS_NOT_CREATED_VIA_SYMBOLOGY, SYMBOLOGY_SCHEME_FILE_NOT_FOUND, SYMBOLOGY_INVALID_NUM_POINTS, SYMBOLOGY_CANT_CALCULATE_POINTS, SYMBOLOGY_INVALID_MODEL_INDICES, SYMBOLOGY_INVALID_MODEL_PARAMETERS, SYMBOLOGY_INVALID_SCHEME_PARAMETERS,
            SYMBOLOGY_AMPLIFIER_NOT_FOUND, ITEM_DOESNT_EXIST, ITEM_CANT_BE_NULL,
            ITEM_CANT_CONNECT_CONNECTED_ITEM, ITEM_CANT_CONNECT_PHYSICAL_TO_SYMBOLIC, ITEM_CANT_CONNECT_PHYSICAL_TO_SCREEN_LOCATION, ITEM_NOT_CONNECTED_CANT_SET_PROP_ID, WRITE_TO_STORAGE_FAILED, READ_FROM_STORAGE_FAILED, 
            INVALID_STORAGE_FORMAT, WRONG_STORAGE_FORMAT, STORAGE_VERSION_MISMATCH, CONDITIONAL_SELECTOR_STORAGE_ERROR, FONT_STORAGE_ERROR, TEXTURE_STORAGE_ERROR, MESH_STORAGE_ERROR, IMAGE_CALC_STORAGE_ERROR, NOT_COMPATIBLE_ATTACH_POINT_PARENT,
            INVALID_SUB_TYPE_FLAGS, ITEM_SHOULD_BE_WORLD_AND_ATTACHED_TO_TERRAIN, ITEM_SHOULD_BE_ATTACHED_TO_TERRAIN, INVALID_ORDER_OF_SLOPE_COLORS, INVALID_TEXTURE_RESOLUTION, INVALID_POINT_INDICES_AND_DUPLICATES,
            SUB_ITEMS_NOT_SUPPORTED, INVALID_ORDER_OF_SUB_ITEMS, INVALID_ITEM_DRAW_PRIORITY, DYNAMIC_MESH_CANT_DISPLAY_ITEMS_ATTACHED_TO_TERRAIN, LICENSED_FONT_CANT_BE_EMBEDDED,
            LOCAL_CACHE_NOT_INIT,
            LOCAL_CACHE_HAS_ACTIVE_LAYER, EDIT_MODE_UTILITY_ITEM_SHOULD_BE_SCREEN, EDIT_MODE_IMAGE_CALC_MISMATCH, EDIT_MODE_IS_ALREADY_ACTIVE, EDIT_MODE_IS_NOT_ACTIVE, EDIT_MODE_IS_NOT_CONNECTED, EDIT_MODE_AUTO_REFRESH_IS_NOT_ACTIVE, EDIT_MODE_ITEM_IS_NOT_SUPPORTED,
            TERRAIN_ALREADY_EXISTS, TERRAIN_NOT_FOUND, LAYER_ALREADY_EXISTS, LAYER_NOT_FOUND, LAYER_TILING_SCHEME_MISMATCH, DTM_LAYER_ALREADY_EXISTS, DTM_LAYER_DOES_NOT_EXIST, DTM_LAYER_CANT_BE_REMOVED,
            VIEWPORT_CANT_HAVE_EMPTY_TERRAIN, DTM_LAYER_CANT_BE_ADDED, NATIVE_SERVER_LAYER_NOT_VALID, LAYER_WEB_REQUEST_FAILURE, SYNC_OPERATION_ON_NATIVE_SERVER_LAYER, RAW_3D_EXTRUSION_LAYER_DTM_MISMATCH,
            NATIVE_SERVER_LAYER_AUTHENTICATION_REQUIRED, NATIVE_SERVER_LAYER_UNAUTHENTICATED, NATIVE_SERVER_LAYER_AUTHENTICATION_EXPIRED, NATIVE_SERVER_LAYER_UNAUTHORIZED, LAYER_INDEXING_FAILURE, SYNC_OPERATION_WITH_SERVER_LAYER, OPERATION_WITH_NON_NATIVE_SERVER_LAYER,
            VIEWPORT_MAP_TYPE_MISMATCH, CANNOT_DESTROY_ACTIVE_CAMERA, VIEWPORT_SIZE_MISSING, VIEWPORT_INVALID_WINDOW_HANDLE, QUERY_DTM_NOT_FOUND, TOO_MANY_TARGETS, ASYNC_QUERY_WITH_CURRENT_LOD, SYNC_QUERY_WITH_NON_CURRENT_LOD,
            IC_OUT_OF_LIMIT,
            IC_OUT_OF_WORKING_AREA, IC_TOO_MANY_OPEN_IMAGE_CALCS, IC_IMAGE_CALCS_NOT_OPENED, IC_INVALID_IMAGE_ID, IC_INPUT_ERR, IC_IMPORT_ERR, IC_RELEASE_ERR, IC_LOAD_ERR,
            IC_UNLOAD_ERR, IC_XML_ERR, IC_ALLOCATION_ERR, IC_CS_ERR, IC_G2I_ERR, IC_I2G_ERR, IC_I2LOS_ERR, IC_LOS2G_ERR,
            IC_IMAGE_ADJUSTMENT_ERR, IC_BLOCK_ADJUSTMENT_ERR, IC_GET_ERR, IC_SET_ERR, IC_READ_ERR, IC_WRITE_ERR, IC_NO_SUPPORT, IC_BAD_DTM,
            CROSSING_POLYGONS, CANT_INIT_GEOD_MAGNETIC,
            MAPLAYER_FILE_WITHOUT_COORDINATES, NOT_SUPPORTED_FOR_THIS_LAYER, LOCALE_NOT_FOUND, ACTIVE_VECTOR_LAYER_NOT_FOUND, VECTOR_3D_EXTRUSION_LAYER_NO_CONTOURS, VECTOR_3D_EXTRUSION_LAYER_NO_DTM_HEIGHTS, LAYER_INDEX_SOURCE_MISMATCH,
			MAPLAYER_FILE_WITHOUT_COORDINATE_SYSTEM, HISTOGRAM_NOT_CALCULATED, INVALID_GUESS, LISENCE_IS_INVALID, LICENSE_EXPIRED, LICENSE_BAD_FORMAT, LICENSE_FEATURE_NOT_FOUND, LICENSE_FILE_NOT_FOUND
        }
    }

////////////////////////////////////////////////////////////////////////////////////////
// General

enum PL_PL_STATUS {
        SEPARATE_PL, 
        OVERLAP_PL, 
        INTERSECT_PL, 
        RESERVED_PL, 
        TANGENT_PL, 
        TOUCHES_PL
    }

    enum PG_PG_STATUS {
        SEPARATE_PG, 
        A_IN_B_PG, 
        B_IN_A_PG, 
        SAME_PG, 
        INTERSECT_PG
    }

    enum GEOMETRIC_SHAPE {
        EG_LINE, 
        EG_RAY, 
        EG_SEGMENT, 
        EG_CIRCLE, 
        EG_ARC, 
        EG_CIRCLESECTOR, 
        EG_CIRCLESEGMENT, 
        EG_POLYLINE, 
		EG_POLYGON, 
        EG_GENERAL_OPENSHAPE, 
        EG_GENERAL_CLOSEDSHAPE, 
        EG_GENERAL_CLOSEDSHAPE_WITH_HOLES, 
        EG_GEOMETRIC_SHAPE_TYPE_NONE        
    }

    enum PG_DIRECTION {
        LOCKWISE, 
        COUNTER_CLOCKWISE, 
        SELF_INTERSECT
    }

    enum GS_POINT_TYPE {
        START_ARC_END_ARC,
        START_ARC_END_SEG,
        START_SEG_END_ARC,
        START_SEG_END_SEG,
        MID_ARC,			
        START_SEG,			
        START_ARC,			
        END_SEG,				
        END_ARC,				
        GS_POINT_TYPE_NONE
    }

    class STGeneralShapePoint {
        constructor();
        stPoint : SMcVector3D;
        ePointType :GS_POINT_TYPE;
    }

   class STCircle {
        constructor();
        stCenter : SMcVector3D;
        dRadius : number;
    }
    
    class STUnionArc {
        constructor();
        unCircleID : number;
        dStartAngle : number;
        dEndAngle : number;
    }

    class STGeneralShape {
        constructor();
        constructor(Father : STGeneralShape);
        astPoints : STGeneralShapePoint[];
    }
    
    class STUnionShape {
        constructor();
        constructor(Father : STUnionShape);
        astContours : STGeneralShape[];
        aunParticipatingCirclesIDs : Uint8Array;
    }

    enum POINT_PG_STATUS {
        POINT_NOT_IN_PG,
        POINT_IN_PG,    
        POINT_ON_PG    
    }

    enum POINT_LINE_STATUS {
        BEFORE_EDGE,
        AFTER_EDGE,
        NOT_ON_LINE,
        IS_ON_LINE,
        IS_1st_EDGE,
        IS_2cd_EDGE
    }

    enum SL_SL_STATUS {
        SEPARATE_SL,				
        OVERLAP_SL,				
        INTERSECT_SL,			
        INTERSECT_PARALLEL_SL,
        PARALLEL_SL,	
        LINE1_1st_TOUCHES_SL,
        LINE1_2cd_TOUCHES_SL,	
        LINE2_1st_TOUCHES_SL,	
        LINE2_2cd_TOUCHES_SL,	
        SAME_POINT11_SL,	
        SAME_POINT12_SL,		
        SAME_POINT21_SL,		
        SAME_POINT22_SL			
    }
    enum EMcPointCoordSystem {
        EPCS_IMAGE,
        EPCS_WORLD,
        EPCS_SCREEN
    }

    enum EExtendedGeometry {
        EEG_Unknown,		
        EEG_Point,
        EEG_LineString,		
        EEG_Polygon,
        EEG_MultiPoint,
        EEG_MultiLineString,
        EEG_MultiPolygon,
        EEG_GeometryCollection,
        EEG_None,
        EEG_LinearRing,
        EEG_Point25D,
        EEG_LineString25D,
        EEG_Polygon25D,		
        EEG_MultiPoint25D,
        EEG_MultiLineString25D,
        EEG_MultiPolygon25D,
        EEG_GeometryCollection25D
    }

    enum EAxisXAlignment {
        EXA_LEFT,
        EXA_CENTER,
        EXA_RIGHT
    }

    enum EAxisYAlignment {
        EYA_TOP,
        EYA_CENTER,
        EYA_BOTTOM
    }

    enum EFieldType {
        IntegerType,
        RealType,
        StringType,
        RawBinaryType,
        Integer64Type,
        UnSupportedType
    }

    enum EGeometry {
        LineGeometry,
        PointGeometry,
        PolygonGeometry,
        UnSupportedGeometry,
    }

    enum EMcVerticalDatumType {
        EVDT_DEFAULT,
        EVDT_GEOID,
        EVDT_ELLIPSOID
    }

    var MC_EMPTY_ID : number;
    var MC_EXTRA_CONTOUR_SUB_ITEM_ID : number;
    var MC_EXTRA_CONTOUR_VECTOR_ITEM_ID : number;
    var MC_MAX_NUM_POINTS_PER_COMPLETE_ELLIPSE : number;
    var FLT_MAX : number;
    var DBL_MAX : number;
    var INT_MAX : number;
    var UINT_MAX : number;
    var INT_MIN : number;

    interface IMcUserData {
        /** Mandatory */
        Release() : void;
        /** Optional */
        Clone() : IMcUserData;
        /** Optional */
        GetSaveBufferSize() : number;
        /** Optional */
        IsSavedBufferUTF8Bytes() : boolean;
        /** Optional */
        SaveToBuffer(aBuffer : Uint8Array) : void;
    }
    namespace IMcUserData {
        function extend(strName : string, Class : any) : IMcUserData;
    }

    interface IMcUserDataFactory {
        /** Mandatory */
        CreateUserData(aBuffer : Uint8Array) : IMcUserData;
    }
    namespace IMcUserDataFactory {
        function extend(strName : string, Class : any) : IMcUserDataFactory;
    }

	interface IMcProgressCallback {
		/** Mandatory */
        OnProgressMessage(strMessage: string, eMessageType: IMcProgressCallback.EProgressMessageType) : void;
		/** Mandatory */
		OnFileError(strFilePath : string, bRead : boolean, uTryCounter : number) : boolean;
        /** Optional */
        Release(): void;
    }
	namespace IMcProgressCallback {
		function extend(strName : string, Class : any) : IMcProgressCallback;
	
		enum EProgressMessageType {
			EPMT_NEW,      
			EPMT_ADD,     
		}
	}
	
    class SMcVariantID {
        constructor();
        constructor(Number32bitOrNumber53bitOrArrayOrVariantID : number | Uint8Array | SMcVariantID);
        constructor(u32Bit : number, u64BitHigh : number);
        constructor(u32Bit : number, u64BitHigh : number, u128BitHighLow : number, u128BitHighHigh : number);
        static Set53Bit(ID : SMcVariantID, u53Bit : number) : void;
        static Get53Bit(ID : SMcVariantID) : number;
        static Set128Bit(ID : SMcVariantID, aArray128Bit : Uint8Array) : void;
        static Get128Bit(ID : SMcVariantID) : Uint8Array;
        static SetEmpty(ID : SMcVariantID) : void;
        static IsEmpty(ID : SMcVariantID) : boolean;
		static Set128bitAsUUIDString(ID : SMcVariantID, strUUID : string) : void;
        static Get128bitAsUUIDString(ID : SMcVariantID) : string;
        static AreEqual(ID1 : SMcVariantID, ID2 : SMcVariantID) : boolean;        
        u32Bit : number;
        u64BitHigh : number;
        u128BitHighLow : number;
        u128BitHighHigh : number;
    }

    class SMcVariantString {
        constructor();
        constructor(StringOrStringArray : string | string[], _bIsUnicode : boolean);
        astrStrings : string[];
        bIsUnicode : boolean;
    }

    class SMcVariantLogFont {
        constructor();
        lfHeight : number; 
        lfWidth : number;               
        lfEscapement : number;          
        lfOrientation : number;         
        lfWeight : number;              
        lfItalic : number;              
        lfUnderline : number;           
        lfStrikeOut : number;           
        lfCharSet : number;             
        lfOutPrecision : number;        
        lfClipPrecision : number;       
        lfQuality : number;             
        lfPitchAndFamily : number;      
        lfFaceName : string;        
        bIsUnicode : boolean;
        bIsEmbedded : boolean;
    }

    class SMcSubItemData {
        constructor();
        constructor(uSubItemID : number, nPointsStartIndex : number);
        uSubItemID : number;
        nPointsStartIndex : number;
    }

    class SMcQuaternion {
        constructor();
        constructor(w : number, x : number, y : number, z : number);
        constructor(Other : SMcQuaternion);
        constructor(dYaw : number, dPitch : number, dRoll : number, bGraphicsCoordinateSystem? : boolean);
        constructor(dAngle : number, Axis : SMcVector3D);
        constructor(AxisX : SMcVector3D, AxisY : SMcVector3D, AxisZ : SMcVector3D);
        static Copy(source : SMcQuaternion) : SMcQuaternion;
        static IsEqual(This : SMcQuaternion, Other : SMcQuaternion) : boolean;
        static IsNotEqual(This : SMcQuaternion, Other : SMcQuaternion) : boolean;
        static FromYawPitchRoll(Quaternion : SMcQuaternion, dYaw : number, dPitch : number, dRoll : number, bGraphicsCoordinateSystem? : boolean) : void;
        /**
         * @param pdYaw      pdYaw.Value : number
         * @param pdPitch    pdPitch.Value : number
         * @param pdRoll     pdRoll.Value : number
         */
        static ToYawPitchRoll(Quaternion : SMcQuaternion, pdYaw : any, pdPitch : any, pdRoll : any, bGraphicsCoordinateSystem? : boolean) : void;
        static FromAngleAxis(Quaternion : SMcQuaternion, dAngle : number, Axis : SMcVector3D) : void;
        /**
         * @param pdAngle   pdAngle.Value : number
         * @param pAxis     pAxis.Value : SMcVector3D
         */
        static ToAngleAxis(Quaternion : SMcQuaternion, pdAngle : any, pAxis : any) : void;
        static FromAxes(Quaternion : SMcQuaternion, AxisX : SMcVector3D, AxisY : SMcVector3D, AxisZ : SMcVector3D) : void;
        /**
         * @param pAxisX     pAxisX.Value : SMcVector3D
         * @param pAxisY     pAxisY.Value : SMcVector3D
         * @param pAxisZ     pAxisZ.Value : SMcVector3D
         */
        static ToAxes(Quaternion : SMcQuaternion, pAxisX : any, pAxisY : any, pAxisZ : any) : void;
        static GetInverse(Quaternion : SMcQuaternion) : SMcQuaternion;
        static Plus(item1 : SMcQuaternion, item2 : SMcQuaternion) : SMcQuaternion;
        static PlusEq(target : SMcQuaternion, source : SMcQuaternion) : void;
        static Minus(item1 : SMcQuaternion, item2 : SMcQuaternion) : SMcQuaternion;
        static MinusEq(target : SMcQuaternion, source : SMcQuaternion) : void;
        static Mul(Quaternion : SMcQuaternion, d : number) : SMcQuaternion;
        static Mul(Quaternion : SMcQuaternion, Other : SMcQuaternion) : SMcQuaternion;
        static Mul(Quaternion : SMcQuaternion, Vector : SMcVector3D) : SMcVector3D;
        static Mul(Quaternion : SMcQuaternion, Vector : SMcFVector3D) : SMcFVector3D;
        w : number;
        x : number;
        y : number;
        z : number;
    }
    var qZero : SMcQuaternion;
    var qIdentity : SMcQuaternion;

    class SMcMatrix4D {
        constructor();
        constructor(w : number, x : number, y : number, z : number);
        constructor(Array4x4OrArray16OrMatrixOrQuaternion : number[][] | number[] | SMcMatrix4D | SMcQuaternion);
        static Copy(source : SMcMatrix4D) : SMcMatrix4D;
        static IsEqual(This : SMcMatrix4D, Other : SMcMatrix4D) : boolean;
        static IsNotEqual(This : SMcMatrix4D, Other : SMcMatrix4D) : boolean;
        static Mul(Matrix : SMcMatrix4D, d : number) : SMcMatrix4D;
        static MulEq(Matrix : SMcMatrix4D, d : number) : void;
        static Mul(Matrix : SMcMatrix4D, Other : SMcMatrix4D) : SMcMatrix4D;
        static MulEq(Matrix : SMcMatrix4D, Other : SMcMatrix4D) : void;
        static Mul(Matrix : SMcMatrix4D, Vector : SMcVector3D) : SMcVector3D;
        static MulEq(Matrix : SMcMatrix4D, Vector : SMcVector3D) : void;
        static Mul(Matrix : SMcMatrix4D, Vector : SMcFVector3D) : SMcFVector3D;
        static MulEq(Matrix : SMcMatrix4D, Vector : SMcFVector3D) : void;
        static Plus(Matrix1 : SMcMatrix4D, Matrix2 : SMcMatrix4D) : SMcMatrix4D;
        static PlusEq(Matrix1 : SMcMatrix4D, Matrix2 : SMcMatrix4D) : void;
        static Minus(Matrix1 : SMcMatrix4D, Matrix2 : SMcMatrix4D) : SMcMatrix4D;
        static MinusEq(Matrix1 : SMcMatrix4D, Matrix2 : SMcMatrix4D) : void;
        static SetScale(Matrix4D : SMcMatrix4D, Vector : SMcVector3D) : void;
        static GetScale(Matrix4D : SMcMatrix4D) : SMcVector3D;
        static SetRotation(Matrix4D : SMcMatrix4D, Rotation : SMcQuaternion) : void;
        static GetRotation(Matrix4D : SMcMatrix4D) : SMcQuaternion;
        static SetTranslation(Matrix4D : SMcMatrix4D, Vector : SMcVector3D) : void;
        static SetTranslation(Matrix4D : SMcMatrix4D) : SMcVector3D;
        static GetTranslation(Matrix4D : SMcMatrix4D) : SMcVector3D;
        static CalcDeterminant(Matrix4D : SMcMatrix4D) : number;
        static GetTranspose(Matrix4D : SMcMatrix4D) : SMcMatrix4D;
        static GetInverse(Matrix4D : SMcMatrix4D) : SMcMatrix4D;
        static FromTransform(Matrix4D : SMcMatrix4D, Scale : SMcVector3D, Rotation : SMcQuaternion, Translation : SMcVector3D) : void;
        static FromInverseTransform(Matrix4D : SMcMatrix4D, Scale : SMcVector3D, Rotation : SMcQuaternion, Translation : SMcVector3D) : void;
        /**
         * The array size should always be 4x4 
         */
         m : number[][];
    }
    var m4Zero : SMcMatrix4D;
    var m4Identity : SMcMatrix4D;

    class SMcRotation {
        constructor();
        constructor(fYaw : number, fPitch : number, fRoll : number, bRelativeToCurrOrientation? : boolean);
        constructor(Other : SMcRotation);
        constructor(Quaternion : SMcQuaternion, bRelativeToCurrOrientation? : boolean,	bGraphicsCoordinateSystem? : boolean);
        static Copy(source : SMcRotation) : SMcRotation;
        static IsEqual(This : SMcRotation, Other : SMcRotation) : boolean;
        static IsNotEqual(This : SMcRotation, Other : SMcRotation) : boolean;
        static ToQuaternion(Rotation : SMcRotation, bGraphicsCoordinateSystem? : boolean): SMcQuaternion;
        fYaw : number;
        fPitch : number;
        fRoll : number;
        bRelativeToCurrOrientation : boolean;
    }

    class SMcFileSource {
        constructor();
        constructor(NameOrBuffer : string | Uint8Array, bIsBuffer : boolean, strFormatExtension? : string);
        strFileName : string;
        aFileMemoryBuffer : Uint8Array;
        strFormatExtension : string;
        bIsMemoryBuffer : boolean;
    }

    class SMcFileInMemory {
        constructor();
        strFileName : string;
        auMemoryBuffer : Uint8Array;
    }

    class SMcKeyStringValue {
        constructor();
        strKey : string;
        strValue : string;
    }

    class SMcKeyFloatValue {
        constructor();
        strKey : string;
        fValue : number;
    }

    class SMcBColor {
        constructor();
        constructor(r : number, g : number, b : number, a : number);
        constructor(Color : SMcBColor, bDummy : boolean);
        constructor(uARGB : number);
        r : number;
        g : number;
        b : number;
        a : number;
    }
    var bcBlackTransparent : SMcBColor;
    var bcBlackOpaque : SMcBColor;
    var bcWhiteTransparent : SMcBColor;
    var bcWhiteOpaque : SMcBColor;

    class SMcFColor {
        constructor();
        constructor(r : number, g : number, b : number, a : number);
    	constructor(Color : SMcBColor);
        r : number;
        g : number;
        b : number;
        a : number;
    }
    var fcBlackTransparent : SMcFColor;
    var fcBlackOpaque : SMcFColor;
    var fcWhiteTransparent : SMcFColor;
    var fcWhiteOpaque : SMcFColor;

    class SMcSize {
        constructor();
        constructor(initCX : number, initCY : number);
        cx : number;
        cy : number;
    }

    class SMcPoint{
        constructor();
        constructor(initX : number, initY : number);
        x : number;
        y : number; 
    }

    class SMcRect{
        constructor();
        constructor(l : number, t : number, r : number, b : number);
        left : number;
        top : number;
        right : number;
        bottom : number;
     }

    class SMcVector3D {
        constructor(x : number, y : number, z : number);
        constructor(v : SMcVector3D | SMcVector2D);
        x : number;
        y : number;
        z : number;
    }
    namespace SMcVector3D {
        function Copy(source : SMcVector3D) : SMcVector3D;
        function IsEqual(Matrix1 : SMcVector3D, item2 : SMcVector3D) : boolean;
        function IsNotEqual(item1 : SMcVector3D, item2 : SMcVector3D) : boolean;
        function PlusEq(target : SMcVector3D, source : SMcVector3D) : void;
        function MinusEq(target : SMcVector3D, source : SMcVector3D) : void;
        function MulEq(target : SMcVector3D, source : SMcVector3D) : void;
        function DivEq(target : SMcVector3D, source : SMcVector3D) : void;
        function Plus(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function Minus(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function Mul(item1 : SMcVector3D, item2 : number) : SMcVector3D;
        function Mul(item1 : number, item2 : SMcVector3D) : SMcVector3D;
        function Mul(item1 : SMcVector3D, item2 : SMcVector3D) : number;
        function Div(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function Div(item1 : SMcVector3D, item2 : number) : SMcVector3D;
        function CrossProduct(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function CrossProductEq(target : SMcVector3D, source : SMcVector3D) : void;
        function Average(item1 : SMcVector3D, item2 : SMcVector3D) : SMcVector3D;
        function AverageEq(target : SMcVector3D, source : SMcVector3D) : void;
        function SquareLength(vector : SMcVector3D) : number;
        function Length(vector : SMcVector3D) : number;
        function MulAdd(target : SMcVector3D, dMul : number, vAdd : SMcVector3D) : void;
        function GetMulAdded(vector : SMcVector3D, dMul : number, vAdd : SMcVector3D) : SMcVector3D;
        function Normalize(vector : SMcVector3D) : void;
        function GetNormalized(vector : SMcVector3D) : SMcVector3D;
        function GetLinearInterpolationWith(vector : SMcVector3D, vSecond : SMcVector3D, dInterpolationParam : number) : SMcVector3D;
        /**
         * @param pdYaw      pdYaw.Value : number
         * @param pdPitch    pdPitch.Value : number
         */
        function GetRadianYawPitchFromForwardVector(vector : SMcVector3D, pdYaw : any, pdPitch : any) : void;
        /**
         * @param pdYaw      pdYaw.Value : number
         * @param pdPitch    pdPitch.Value : number
         */
        function GetDegreeYawPitchFromForwardVector(vector : SMcVector3D, pdYaw : any, pdPitch : any) : void;
         /**
         * @param pdPitch    pdPitch.Value : number
         * @param pdRoll     pdRoll.Value : number
         */
        function GetRadianPitchRollFromUpVector(vector : SMcVector3D, pdPitch : any, pdRoll : any) : void;
         /**
         * @param pdPitch    pdPitch.Value : number
         * @param pdRoll     pdRoll.Value : number
         */
        function GetDegreePitchRollFromUpVector(vector : SMcVector3D, pdPitch : any, pdRoll : any) : void;
        function RotateByRadianYawAngle(vector : SMcVector3D, dYaw : number) : void;
        function RotateByDegreeYawAngle(vector : SMcVector3D, dYaw : number) : void;
        function RotateByRadianYawPitchRoll(vector : SMcVector3D, dYaw : number, dPitch : number, dRoll:number) : void;
        function RotateByDegreeYawPitchRoll(vector : SMcVector3D, dYaw : number, dPitch : number, dRoll:number) : void;
    }
    var v3Zero : SMcVector3D;
    var v3MinDouble : SMcVector3D;
    var v3MaxDouble : SMcVector3D;
    var MC_VECTOR_DOUBLE_EPS : number;
    
    class SMcFVector3D {
        constructor(x : number, y : number, z : number);
        constructor(v : SMcFVector3D | SMcFVector2D);
        x : number;
        y : number;
        z : number;
    }
    namespace SMcFVector3D {
        function Copy(source : SMcFVector3D) : SMcFVector3D;
        function IsEqual(item1 : SMcFVector3D, item2 : SMcFVector3D) : boolean;
        function IsNotEqual(item1 : SMcFVector3D, item2 : SMcFVector3D) : boolean;
        function PlusEq(target : SMcFVector3D, source : SMcFVector3D) : void;
        function MinusEq(target : SMcFVector3D, source : SMcFVector3D) : void;
        function MulEq(target : SMcFVector3D, source : SMcFVector3D) : void;
        function DivEq(target : SMcFVector3D, source : SMcFVector3D) : void;
        function Plus(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function Minus(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function Mul(item1 : SMcFVector3D, item2 : number) : SMcFVector3D;
        function Mul(item1 : number, item2 : SMcFVector3D) : SMcFVector3D;
        function Mul(item1 : SMcFVector3D, item2 : SMcFVector3D) : number;
        function Div(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function Div(item1 : SMcFVector3D, item2 : number) : SMcFVector3D;
        function CrossProduct(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function CrossProductEq(target : SMcFVector3D, source : SMcFVector3D) : void;
        function Average(item1 : SMcFVector3D, item2 : SMcFVector3D) : SMcFVector3D;
        function AverageEq(target : SMcFVector3D, source : SMcFVector3D) : void;
        function SquareLength(vector : SMcFVector3D) : number;
        function Length(vector : SMcFVector3D) : number;
        function MulAdd(target : SMcFVector3D, dMul : number, vAdd : SMcFVector3D) : void;
        function GetMulAdded(vector : SMcFVector3D, dMul : number, vAdd : SMcFVector3D) : SMcVector3D;
        function Normalize(vector : SMcFVector3D) : void;
        function GetNormalized(vector : SMcFVector3D) : SMcFVector3D;
        function GetLinearInterpolationWith(vector : SMcFVector3D, vSecond : SMcFVector3D, dInterpolationParam : number) : SMcFVector3D;
        /**
         * @param pdYaw      pdYaw.Value : number
         * @param pdPitch    pdPitch.Value : number
         */
        function GetRadianYawPitchFromForwardVector(vector : SMcFVector3D, pdYaw : any, pdPitch : any) : void;
        /**
         * @param pdYaw      pdYaw.Value : number
         * @param pdPitch    pdPitch.Value : number
         */
        function GetDegreeYawPitchFromForwardVector(vector : SMcFVector3D, pdYaw : any, pdPitch : any) : void;
         /**
         * @param pdPitch    pdPitch.Value : number
         * @param pdRoll     pdRoll.Value : number
         */
        function GetRadianPitchRollFromUpVector(vector : SMcFVector3D, pdPitch : any, pdRoll : any) : void;
         /**
         * @param pdPitch    pdPitch.Value : number
         * @param pdRoll     pdRoll.Value : number
         */
        function GetDegreePitchRollFromUpVector(vector : SMcFVector3D, pdPitch : any, pdRoll : any) : void;
        function RotateByRadianYawAngle(vector : SMcFVector3D, dYaw : number) : void;
        function RotateByDegreeYawAngle(vector : SMcFVector3D, dYaw : number) : void;
        function RotateByRadianYawPitchRoll(vector : SMcFVector3D, dYaw : number, dPitch : number, dRoll:number) : void;
        function RotateByDegreeYawPitchRoll(vector : SMcFVector3D, dYaw : number, dPitch : number, dRoll:number) : void;
    }
    var vf3Zero : SMcFVector3D;
    var vf3MinFloat : SMcFVector3D;
    var vf3MaxFloat : SMcFVector3D;
    var MC_VECTOR_FLOAT_EPS : number;

    class SMcVector2D {
        constructor();
        constructor(x : number, y : number);
        constructor(v : SMcVector2D | SMcVector3D);
        x : number;
        y : number;                        
    }
    namespace SMcVector2D {
        function Copy(source : SMcVector2D) : SMcVector2D;
        function IsEqual(item1 : SMcVector2D, item2 : SMcVector2D) : boolean;
        function IsNotEqual(item1 : SMcVector2D, item2 : SMcVector2D) : boolean;
        function PlusEq(target : SMcVector2D, source : SMcVector2D) : void;
        function MinusEq(target : SMcVector2D, source : SMcVector2D) : void;
        function MulEq(target : SMcVector2D, source : SMcVector2D) : void;
        function DivEq(target : SMcVector2D, source : SMcVector2D) : void;
        function Plus(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function Minus(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function Mul(item1 : SMcVector2D, item2 : number) : SMcVector2D;
        function Mul(item1 : number, item2 : SMcVector2D) : SMcVector2D;
        function Mul(item1 : SMcVector2D, item2 : SMcVector2D) : number;
        function Div(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function Div(item1 : SMcVector2D, item2 : number) : SMcVector2D;
        function CrossProduct(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function Average(item1 : SMcVector2D, item2 : SMcVector2D) : SMcVector2D;
        function AverageEq(target : SMcVector2D, source : SMcVector2D) : void;
        function SquareLength(vector : SMcVector2D) : number;
        function Length(vector : SMcVector2D) : number;
        function MulAdd(target : SMcVector2D, dMul : number, vAdd : SMcVector2D) : void;
        function GetMulAdded(vector : SMcVector2D, dMul : number, vAdd : SMcVector2D) : SMcVector2D;
        function Normalize(vector : SMcVector2D) : void;
        function GetNormalized(vector : SMcVector2D) : SMcVector2D;
        function GetLinearInterpolationWith(vector : SMcVector2D, vSecond : SMcVector2D, dInterpolationParam : number) : SMcVector2D;
        function GetYawAngleRadians(vector : SMcVector2D) : number;
        function GetYawAngleDegrees(vector : SMcVector2D) : number;
        function RotateByRadianYawAngle(vector : SMcVector2D, dYaw : number) : void;
        function RotateByDegreeYawAngle(vector : SMcVector2D, dYaw : number) : void;
    }
    var v2Zero : SMcVector2D;
    var v2MinDouble : SMcVector2D;
    var v2MaxDouble : SMcVector2D;

    class SMcFVector2D {
        constructor();
        constructor(x : number, y : number);
        constructor(v : SMcFVector2D | SMcFVector3D);
        x : number;
        y : number;                        
    }
    namespace SMcFVector2D {
        function Copy(source : SMcFVector2D) : SMcFVector2D;
        function IsEqual(item1 : SMcFVector2D, item2 : SMcFVector2D) : boolean;
        function IsNotEqual(item1 : SMcFVector2D, item2 : SMcFVector2D) : boolean;
        function PlusEq(target : SMcFVector2D, source : SMcFVector2D) : void;
        function MinusEq(target : SMcFVector2D, source : SMcFVector2D) : void;
        function MulEq(target : SMcFVector2D, source : SMcFVector2D) : void;
        function DivEq(target : SMcFVector2D, source : SMcFVector2D) : void;
        function Plus(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function Minus(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function Mul(item1 : SMcFVector2D, item2 : number) : SMcFVector2D;
        function Mul(item1 : number, item2 : SMcFVector2D) : SMcFVector2D;
        function Mul(item1 : SMcFVector2D, item2 : SMcFVector2D) : number;
        function Div(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function Div(item1 : SMcFVector2D, item2 : number) : SMcFVector2D;
        function CrossProduct(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function Average(item1 : SMcFVector2D, item2 : SMcFVector2D) : SMcFVector2D;
        function AverageEq(target : SMcFVector2D, source : SMcFVector2D) : void;
        function SquareLength(vector : SMcFVector2D) : number;
        function Length(vector : SMcVector2D) : number;
        function MulAdd(target : SMcVector2D, dMul : number, vAdd : SMcVector2D) : void;
        function GetMulAdded(vector : SMcVector2D, dMul : number, vAdd : SMcVector2D) : SMcVector2D;
        function Normalize(vector : SMcVector2D) : void;
        function GetNormalized(vector : SMcVector2D) : SMcVector2D;
        function GetLinearInterpolationWith(vector : SMcVector2D, vSecond : SMcVector2D, dInterpolationParam : number) : SMcVector2D;
        function GetYawAngleRadians(vector : SMcVector2D) : number;
        function GetYawAngleDegrees(vector : SMcVector2D) : number;
        function RotateByRadianYawAngle(vector : SMcVector2D, dYaw : number) : void;
        function RotateByDegreeYawAngle(vector : SMcVector2D, dYaw : number) : void;
    }
    var vf2Zero : SMcFVector2D;
    var vf2MinFloat : SMcFVector2D;
    var vf2MaxFloat : SMcFVector2D;

    class SMcBox {
        constructor();
        constructor(MinVertex : SMcVector3D, MaxVertex : SMcVector3D)
        constructor(dMinX : number, dMinY : number, dMinZ : number, dMaxX : number, dMaxY : number, dMaxZ : number);   
        constructor(Box : SMcBox);
        MinVertex : SMcVector3D;
        MaxVertex : SMcVector3D;               
    }

    namespace SMcBox {
        function Size(box : SMcBox) : SMcVector3D;
        function SizeX(box : SMcBox) : number;
        function SizeY(box : SMcBox) : number;
        function SizeZ(box : SMcBox) : number;
        function CenterPoint(box : SMcBox) : SMcVector3D;
        function VertexInBox(box : SMcBox, Vertex : SMcVector3D) : boolean;
        function VertexInBoxXY(box : SMcBox, Vertex : SMcVector3D) : boolean;
        function BoxInBox(box1 : SMcBox, box2 : SMcBox) : boolean;
        function Contains(box1 : SMcBox, box2 : SMcBox) : boolean;
        function Inflate(box : SMcBox, vector1 : SMcVector3D, vector2 : SMcVector3D) : void;
        function Deflate(box : SMcBox, vector1 : SMcVector3D, vector2 : SMcVector3D) : void;
        function Offset(box : SMcBox, x : number, y : number, z : number) : void;
        function Intersect(box : SMcBox, box1 : SMcBox, box2 : SMcBox) : boolean;
        function Union(box : SMcBox, box1 : SMcBox, box2 : SMcBox) : boolean;
        function Normalize(box : SMcBox) : void;
        function Copy(source : SMcBox) : SMcBox;
        function IsEqual(item1 : SMcBox, item2 : SMcBox) : boolean;
        function IsNotEqual(item1 : SMcBox, item2 : SMcBox) : boolean;
    }

     class SMcPlane {
        constructor();
        constructor(Normal : SMcVector3D, dLocationOrPoint : number | SMcVector3D);
        constructor(Point1 : SMcVector3D, Point2 : SMcVector3D, Point3 : SMcVector3D);
        Normal : SMcVector3D;
        dLocation : number;
     }

     class SMcAttenuation {
        constructor();
        constructor(fConst : number, fLinear : number, fSquare : number, fRange : number);
        constructor(Attenuation : SMcAttenuation);
        fConst  : number;	
        fLinear : number;
        fSquare : number;
        fRange  : number;
     }
     var aNoAttenuation : SMcAttenuation;
     var aLinearAttenuation : SMcAttenuation;
     var aSquareAttenuation : SMcAttenuation;

     class SMcAnimation {
        constructor();
        constructor(strAnimationName : string, bLoop : boolean);
        strAnimationName : string;
        bLoop : boolean;
    }

    interface IMcImage extends IMcBase {
        Clone() : IMcImage;
        GetFileSource() : SMcFileSource;
        GetPixelBuffer() : Uint8Array;
        GetNumMipmaps() : number;
        /**
        * @param puWidth        puWidth.Value : number
        * @param puHeight       puHeight.Value : number
        */
        GetSize(puWidth : any, puHeight : any) : void;
        GetPixelFormat() : IMcTexture.EPixelFormat;
        CalcPixelBufferSize(uWidth : number, uHeight : number, ePixelFormat : IMcTexture.EPixelFormat, uNumMipmaps? : number) : number;
        SaveToFile(strFileName : string) : void;
        Save(strFormatExtension : string) : Uint8Array;
    }
    namespace IMcImage {
        enum EResizeFilter {
            ERF_NEAREST,
            ERF_BILINEAR
        }
        function Create(ImageSource : SMcFileSource) : IMcImage;
        function Create(aPixelBuffer : Uint8Array, uWidth : number, uHeight : number, ePixelFormat : IMcTexture.EPixelFormat, uNumMipmaps? : number) : IMcImage;
        function Create(pSrcImage : IMcImage, uWidth? : number, uHeight? : number, eFilter? : IMcImage.EResizeFilter, bFlipAroundX? : boolean, bFlipAroundY? : boolean) : IMcImage;
    }

    class CMcError {
        name: number;
        message: string;
        constructor();
        Init(name : number, message : string) : void;
    }
    
   /**
     * The array size is always 256
     */
    type MC_HISTOGRAM = Float64Array;
    type CMcTime = Date;
}

declare function McStartMapCore(options? : { locateFile(filename: string, directory : string): string; }): Promise<void>;