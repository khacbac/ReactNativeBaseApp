package com.binhanh.g7taxi;

import android.content.Intent;
import android.support.v4.app.ActivityCompat;

import com.binhanh.staxi.react.Permissions.PermissionListener;
import com.binhanh.staxi.react.Permissions.PermissionsManager;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity implements ActivityCompat.OnRequestPermissionsResultCallback, PermissionListener{

    private PermissionsManager permissionsManager;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "G7Taxi";
    }

    @Override
    public void attach(PermissionsManager manager) {
        permissionsManager = manager;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(permissionsManager != null)
            permissionsManager.onActivityResult(requestCode, resultCode, data);

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(permissionsManager != null)
            permissionsManager.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
