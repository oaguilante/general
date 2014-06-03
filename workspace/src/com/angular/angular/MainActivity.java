package com.angular.angular;

import android.os.Bundle;
import org.apache.cordova.*;
//import org.apache.cordova.DroidGap;

public class MainActivity extends DroidGap {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.setIntegerProperty("splashscreen", R.drawable.splash);
		super.onCreate(savedInstanceState);
		super.loadUrl("file:///android_asset/www/login.html",5000);
	}

}