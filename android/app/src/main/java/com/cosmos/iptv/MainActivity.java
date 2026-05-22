package com.cosmos.iptv;

import android.os.Bundle;
import android.view.KeyEvent;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    /**
     * Intercept TV remote D-pad events and dispatch them to the webview as
     * window.cosmosRemoteKey(direction) JavaScript calls.
     *
     * Directions: "up", "down", "left", "right", "enter", "back"
     */
    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            String direction = null;
            switch (event.getKeyCode()) {
                case KeyEvent.KEYCODE_DPAD_UP:
                    direction = "up";
                    break;
                case KeyEvent.KEYCODE_DPAD_DOWN:
                    direction = "down";
                    break;
                case KeyEvent.KEYCODE_DPAD_LEFT:
                    direction = "left";
                    break;
                case KeyEvent.KEYCODE_DPAD_RIGHT:
                    direction = "right";
                    break;
                case KeyEvent.KEYCODE_DPAD_CENTER:
                case KeyEvent.KEYCODE_ENTER:
                    direction = "enter";
                    break;
                case KeyEvent.KEYCODE_BACK:
                    direction = "back";
                    break;
            }

            if (direction != null) {
                String js = String.format(
                    "window.dispatchEvent(new CustomEvent('cosmos:remote', { detail: '%s' }));",
                    direction
                );
                bridge.eval(js, null);
                return true;
            }
        }
        return super.dispatchKeyEvent(event);
    }
}
