import React, { useCallback } from "react";
import useSecretKnockCore from "@secret-knock/core";

interface Options {
    component?: any;
    longPressMs?: number;
    pauseMs?: number;
    timeoutMs?: number;
}

/**
 * Create a secret knock.
 *
 * @param {string} sequence A string of characters, "." meaning press, "-" meaning long press, and "/" meaning pause
 * @param {Object} [options]
 * @param {String} [options.component]   A component that accepts onMouseDown, onMouseUp, onTouchStart, and onTouchEnd - defaults to HTML's button
 * @param {String} [options.longPressMs] How long is a long press? Defaults to 500 ms
 * @param {String} [options.pauseMs]     How long is a pause between knocks going to be? Defaults to 1500 ms
 * @param {String} [options.timeoutMs]   How long before the secret knock times out and resets? Defaults to 2000 ms
 */
export const useSecretKnock = <T extends React.ReactNode>(
    sequence: string,
    options?: Options,
) => {
    const { component: Component, ...coreOptions } = {
        component: <button />,
        ...options,
    };
    const { progress, getInputSequence, reset, onKnockIn, onKnockOut } =
        useSecretKnockCore(sequence, coreOptions);

    const Knocker = useCallback(
        // @ts-ignore
        ({ children, ...props }: T) => (
            <Component
                {...props}
                onMouseDown={onKnockIn}
                onMouseUp={onKnockOut}
                onTouchStart={onKnockIn}
                onTouchEnd={onKnockOut}
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
