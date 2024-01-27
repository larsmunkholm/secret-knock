import React, { ButtonHTMLAttributes, ReactNode, useCallback } from "react";
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
 * @param {String} [options.component]   A component that accepts onMouseDown, onMouseUp, onTouchStart, and onTouchEnd - defaults to HTML's button element
 * @param {String} [options.longPressMs] How long is a long press? Defaults to 500 ms
 * @param {String} [options.pauseMs]     How long is a pause between knocks going to be? Defaults to 1500 ms
 * @param {String} [options.timeoutMs]   How long before the secret knock times out and resets? Defaults to 2000 ms
 */
export const useSecretKnock = <
    T extends Record<string, any> = ButtonHTMLAttributes<HTMLButtonElement>,
>(
    sequence: string,
    options?: Options<T>,
) => {
    const { component: Component, ...coreOptions } = {
        component: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
            <button {...props} />
        ),
        ...options,
    };
    const { progress, getInputSequence, reset, onKnockIn, onKnockOut } =
        useSecretKnockCore(sequence, coreOptions);

    const Knocker = useCallback<(props: T) => ReactNode>(
        ({ children, ...props }) => (
            // @ts-ignore
            <Component
                {...props}
                onMouseDown={(event) => {
                    onKnockIn();
                    if (props.onMouseDown) {
                        props.onMouseDown(event);
                    }
                }}
                onMouseUp={(event) => {
                    onKnockOut();
                    if (props.onMouseUp) {
                        props.onMouseUp(event);
                    }
                }}
                onTouchStart={(event) => {
                    onKnockIn();
                    if (props.onTouchStart) {
                        props.onTouchStart(event);
                    }
                }}
                onTouchEnd={(event) => {
                    onKnockOut();
                    if (props.onTouchEnd) {
                        props.onTouchEnd(event);
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
