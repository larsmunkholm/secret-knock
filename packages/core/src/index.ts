import { useCallback, useState, useRef } from "react";

interface Options {
    longPressMs?: number;
    waitMs?: number;
    timeoutMs?: number;
}

const useSecretKnockCore = (sequence: string, options?: Options) => {
    const [progress, setProgress] = useState(0);
    const expectedSequence = useRef(sequence);
    const inputSequence = useRef("");
    const awaitPressOut = useRef(false);
    const timeout = useRef<NodeJS.Timeout>();

    const { longPressMs, waitMs, timeoutMs } = {
        longPressMs: 500,
        waitMs: 1500,
        timeoutMs: 2000,
        ...options,
    };

    const getMatch = useCallback((a: string, b: string): string => {
        if (a.endsWith(b)) {
            return b;
        }

        return getMatch(a, b.substring(0, b.length - 1));
    }, []);

    const updateInputSequence = useCallback(
        (knockType: string) => {
            awaitPressOut.current = false;
            const totalInput = (inputSequence.current + knockType).slice(
                -expectedSequence.current.length,
            );
            const match = getMatch(totalInput, expectedSequence.current);
            inputSequence.current = match;
            const newProgress = match.length / expectedSequence.current.length;
            setProgress(newProgress);
            if (expectedSequence.current[match.length] === "/") {
                timeout.current = setTimeout(
                    () => updateInputSequence("/"),
                    waitMs,
                );
            } else {
                timeout.current = setTimeout(() => reset(), timeoutMs);
            }
        },
        [getMatch, waitMs, timeoutMs],
    );

    const onKnockIn = useCallback(() => {
        if (progress < 1) {
            awaitPressOut.current = true;
            clearTimeout(timeout.current);
            timeout.current = setTimeout(
                () => updateInputSequence("-"),
                longPressMs,
            );
        }
    }, [progress, updateInputSequence, longPressMs]);

    const onKnockOut = useCallback(() => {
        if (progress < 1 && awaitPressOut.current) {
            clearTimeout(timeout.current);
            updateInputSequence(".");
        }
    }, [progress, updateInputSequence]);

    const reset = (newSequence?: string) => {
        setProgress(0);
        inputSequence.current = "";

        if (typeof newSequence === "string") {
            expectedSequence.current = newSequence;
        }
    };

    return {
        progress,
        reset,
        onKnockIn,
        onKnockOut,
    };
};

export default useSecretKnockCore;
