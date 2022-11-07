# 🤫✊🚪 Secret knock
A hook for handling secret knocks in **React**.

This also exists for [React Native](https://www.npmjs.com/package/@secret-knock/react-native).

## Install
```
// 🧶 Yarn
yarn add @secret-knock/react

// 📦 NPM
npm install --save @secret-knock/react
```

## Example
```
import React from "react";
import { useSecretKnock } from "@secret-knock/react-native";

export const HiddenSecret = () => {
    // press, press, press, long press,
    // pause, press, press, press,
    // long press, long press, long press
    const secretKnockSequence = "...-/...---";

    const {
        unlocked,
        progress,
        Knocker,
        reset,
    } = useSecretKnock(secretKnockSequence);

    return (
        <div>
            <Knocker>
                Knock me!
            </Knocker>

            <div style={{ backgroundColor: "#ccc" }}>
                <div
                    style={{
                        height: "10px",
                        width: `${progress * 100}%`,
                        backgroundColor: unlocked ? "lime" : "red",
                    }}
                />
            </div>

            {unlocked && (
                <button onPress={reset}>
                    Reset
                </button>
            )}
        </div>
    );
};
```
