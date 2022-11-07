import React, { useCallback } from "react";
import useSecretKnockCore from "@secret-knock/core";
import { Pressable, PressableProps } from "react-native";

interface Options {
    component?: any;
    longPressMs?: number;
    waitMs?: number;
    timeoutMs?: number;
}

/**
 * Create a secret knock.
 *
 * @param {string} sequence A string of characters, "." meaning press, "-" meaning long press, and "/" meaning pause
 * @param {Object} [options]
 * @param {String} [options.component]   A component that accepts onPressIn and onPressOut - defaults to React Native's Pressable
 * @param {String} [options.longPressMs] How long is a long press? Defaults to 500 ms
 * @param {String} [options.waitMs]      How long is a wait between presses going to be? Defaults to 1500 ms
 * @param {String} [options.timeoutMs]   How long before the secret knock times out and resets? Defaults to 2000 ms
 */
export const useSecretKnock = <
    T extends { children?: PressableProps["children"] } = PressableProps,
>(
    sequence: string,
    options?: Options,
) => {
    const { component: Component, ...coreOptions } = {
        component: Pressable,
        ...options,
    };
    const { progress, reset, onKnockIn, onKnockOut } = useSecretKnockCore(
        sequence,
        coreOptions,
    );

    const Knocker = useCallback(
        ({ children, ...props }: T) => (
            <Component {...props} onPressIn={onKnockIn} onPressOut={onKnockOut}>
                {children}
            </Component>
        ),
        [Component, onKnockIn, onKnockOut],
    );

    return {
        locked: progress < 1,
        unlocked: progress >= 1,
        progress,
        reset,
        Knocker,
    };
};
