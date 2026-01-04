// MyEditModeCallback.ts
export function createMyCEditModeCallback(
    onEditResult: (obj: MapCore.IMcObject, exitCode: number) => void,
    onTileLoad: (tileCount: number) => void
  ) {
    // Create a subclass of IMcEditMode.ICallback
    const MyCEditModeCallback: any = MapCore.IMcEditMode.ICallback.extend(
      "IMcEditMode.ICallback",
      {
        // Optional: constructor to capture the handler
        __construct: function (_onEditResult: any) {
          this.__parent.__construct.call(this);
          this._onEditResult = _onEditResult;          
        },
  
        // Called by MapCore when an edit finishes on an item
        EditItemResults: function (
          pObject: MapCore.IMcObject,
          _pItem: MapCore.IMcObjectSchemeItem,
          nExitCode: number
        ) {
          // Use your own acceptance logic; many samples check nExitCode === 1
          // (Your original default did this too.)
          if (this._onEditResult) {
            this._onEditResult(pObject, nExitCode);
          }
        },

        InitItemResults: function(          
          pObject: MapCore.IMcObject,
          _pItem: MapCore.IMcObjectSchemeItem,
          nExitCode: number
        )
        {
          if (this._onEditResult)
          {
            this._onEditResult(pObject, nExitCode);
          }
        },
  
        // Optional end-of-action signal
        ExitAction: function (_nExitCode: number) {},
  
        // Optional clean-up (per your existing pattern)
        Release: function () {
          this.delete();
        },
      }
    );
  
    // Create an instance and pass your handler to __construct
    // (emscripten-style classes often take ctor args this way)
    return new MyCEditModeCallback(onEditResult);
  }
  