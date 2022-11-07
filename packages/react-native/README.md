# 🤫✊🚪 Secret knock
A hook for handling secret knocks in **React Native**.

This also exists for [React](https://www.npmjs.com/package/@secret-knock/react).

## Install
```
// 🧶 Yarn
yarn add @secret-knock/react-native

// 📦 NPM
npm install --save @secret-knock/react-native
```

## Example
```
import React from "react";
import { Pressable, Text, View } from "react-native";
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
        <View>
            <Knocker>
                <Text>Knock me!</Text>
            </Knocker>

            <View style={{ backgroundColor: "#ccc" }}>
                <View
                    style={{
                        height: 10,
                        width: `${progress * 100}%`,
                        backgroundColor: unlocked ? "lime" : "red",
                    }}
                />
            </View>

            {unlocked && (
                <Pressable onPress={reset}>
                    <Text>Reset</Text>
                </Pressable>
            )}
        </View>
    );
};
```
