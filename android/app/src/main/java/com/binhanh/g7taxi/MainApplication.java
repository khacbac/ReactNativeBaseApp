package com.binhanh.g7taxi;

import android.app.Application;

import com.airbnb.android.react.maps.MapsPackage;
import com.binhanh.staxi.react.NativePakage;
import com.facebook.react.BuildConfig;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.rnfs.RNFSPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import org.pgsqlite.SQLitePluginPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
             return true;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new SQLitePluginPackage(),
                    new MainReactPackage(),
                    new SvgPackage(),
                    new RNFSPackage(),
                    new PickerPackage(),
                    new MapsPackage(),
                    new NativePakage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
