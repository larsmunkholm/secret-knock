import React, { ReactNode, useCallback } from "react";
import { Pressable, PressableProps } from "react-native";
import useSecretKnockCore from "@secret-knock/core";

interface Options<T> {
    component?: (props: T) => ReactNode;
    longPressMs?: number;
    pauseMs?: number;
    timeoutMs?: number;
}

/**
 * Create a secret knock.
 *
 * @param {string} sequence A string of characters, "." meaning press, "-" meaning long press, and "/" meaning pause
 * @param {Object} [options]
 * @param {String} [options.component]   A component that accepts onPressIn and onPressOut - defaults to React Native's Pressable
 * @param {String} [options.longPressMs] How long is a long press? Defaults to 500 ms
 * @param {String} [options.pauseMs]     How long is a pause between knocks going to be? Defaults to 1500 ms
 * @param {String} [options.timeoutMs]   How long before the secret knock times out and resets? Defaults to 2000 ms
 */
export const useSecretKnock = <T extends Record<string, any> = PressableProps>(
    sequence: string,
    options?: Options<T>,
) => {
    const { component: Component, ...coreOptions } = {
        component: Pressable,
        ...options,
    };
    const { progress, getInputSequence, reset, onKnockIn, onKnockOut } =
        useSecretKnockCore(sequence, coreOptions);

    const Knocker = useCallback<(props: T) => ReactNode>(
        ({ children, ...props }) => (
            // @ts-ignore
            <Component
                {...props}
                onPressIn={(event) => {
                    onKnockIn();
                    if (props.onPressIn) {
                        props.onPressIn(event);
                    }
                }}
                onPressOut={(event) => {
                    onKnockOut();
                    if (props.onPressOut) {
                        props.onPressOut(event);
                    }
                }}
            >
                {children}
            </Component>
        ),
        [Component, onKnockIn, onKnockOut],
    );

    return {
        locked: progress < 1,
        unlocked: progress >= 1,
        progress,
        getInputSequence,
        reset,
        Knocker,
    };
};
