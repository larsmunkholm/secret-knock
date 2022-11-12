# 🤫✊🚪 Secret knock
A hook for handling secret knocks in **React Native**.

This also exists for [React](https://www.npmjs.com/package/@secret-knock/react).

## 🚪 Install
```
// 🧶 Yarn
yarn add @secret-knock/react-native

// 📦 NPM
npm install --save @secret-knock/react-native
```

## ✊ Usage
`import { useSecretKnock } from "@secret-knock/react-native";`

**useSecretKnock** takes two properties:

### 1. The secret sequence

A mandatory string representing the correct sequence of knocks:

`const { ... } = useSecretKnock("...---/...");`

| Character      | Represents     | Time                    |
|----------------|----------------|-------------------------|
| `"."`          | A normal press | Less than 500 ms        |
| `"-"`          | A long press   | 500 ms                  |
| `"/"` or `" "` | A pause        | No pressing for 1500 ms |

Waiting for 2000 ms between presses will reset the sequence.

### 2. The optional options

If you're not satisfied, maybe you should try playing around for yourself a bit.

```
import { useSecretKnock } from "@secret-knock/react-native";
import { MyCustomButton } from "../MyCustomButton";

const { ... } = useSecretKnock("...",
    {
        component: MyCustomButton,
        longPressMs: 500,
        pauseMs: 1500,
        timeoutMs: 2000,
        resetWhenWrong: true,
    }
);
```

| Option           | Type                   | Default value | Description                                                                                                                                              |
|------------------|------------------------|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `component`      | (props) => JSX.Element | `Pressable`   | Use this if you want to use your own button instead of React Native's own `Pressable`                                                                    |
| `longPressMs`    | number                 | `500`         | The amount of time to press and hold for it to register as a "long press" (`"-"`)                                                                        |
| `pauseMs`        | number                 | `1500`        | The amount of time to pause between knocks for it to register as a pause in the input sequence (`"/"` or `" "`)                                          |
| `timeoutMs`      | number                 | `2000`        | Exceeding this amount of time between knocks wil reset the input sequence.                                                                               |
| `resetWhenWrong` | boolean                | `true`        | Whether or not to reset the input sequence when a wrong knock has been registered. I think it's best to keep this set to `true`, but maybe you disagree. |


## 🤫 Example
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
