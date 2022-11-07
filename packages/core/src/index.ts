import { useCallback, useState, useRef } from "react";

interface Options {
    longPressMs?: number;
    pauseMs?: number;
    timeoutMs?: number;
}

const useSecretKnockCore = (sequence: string, options?: Options) => {
    const [progress, setProgress] = useState(0);
    const expectedSequence = useRef(sequence);
    const inputSequence = useRef("");
    const awaitPressOut = useRef(false);
    const locked = useRef(true);
    const timeout = useRef<NodeJS.Timeout>();

    const { longPressMs, pauseMs, timeoutMs } = {
        longPressMs: 500,
        pauseMs: 1500,
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
            const totalInput = (inputSequence.current + knockType).slice(
                -expectedSequence.current.length,
            );
            const match = getMatch(totalInput, expectedSequence.current);
            const newProgress = match.length / expectedSequence.current.length;

            setProgress(newProgress);

            awaitPressOut.current = false;
            inputSequence.current = match;
            locked.current = newProgress < 1;

            if (expectedSequence.current[match.length] === "/") {
                timeout.current = setTimeout(
                    () => updateInputSequence("/"),
                    pauseMs,
                );
            } else {
                timeout.current = setTimeout(() => reset(), timeoutMs);
            }
        },
        [getMatch, pauseMs, timeoutMs],
    );

    const onKnockIn = useCallback(() => {
        if (locked.current) {
            awaitPressOut.current = true;
            clearTimeout(timeout.current);
            timeout.current = setTimeout(
                () => updateInputSequence("-"),
                longPressMs,
            );
        }
    }, [updateInputSequence, longPressMs]);

    const onKnockOut = useCallback(() => {
        if (locked.current && awaitPressOut.current) {
            clearTimeout(timeout.current);
            updateInputSequence(".");
        }
    }, [updateInputSequence]);

    const reset = (newSequence?: string) => {
        setProgress(0);
        locked.current = true;
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
