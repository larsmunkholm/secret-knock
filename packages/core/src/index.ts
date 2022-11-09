import { useCallback, useState, useRef } from "react";

interface Options {
    longPressMs?: number;
    pauseMs?: number;
    timeoutMs?: number;
    resetWhenWrong?: boolean;
}

const useSecretKnockCore = (sequence: string, options?: Options) => {
    const [progress, setProgress] = useState(0);
    const expectedSequence = useRef(sequence);
    const inputSequence = useRef("");
    const knockedInAt = useRef(0);
    const locked = useRef(true);
    const timeout = useRef<ReturnType<typeof setTimeout>>();

    const { longPressMs, pauseMs, timeoutMs, resetWhenWrong } = {
        longPressMs: 500,
        pauseMs: 1500,
        timeoutMs: 2000,
        resetWhenWrong: true,
        ...options,
    };

    const reset = (newSequence?: string) => {
        clearTimeout(timeout.current);
        setProgress(0);
        knockedInAt.current = 0;
        inputSequence.current = "";
        locked.current = true;

        if (typeof newSequence === "string") {
            expectedSequence.current = newSequence;
        }
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

            if (
                match.length <= inputSequence.current.length &&
                resetWhenWrong
            ) {
                reset();
            } else {
                setProgress(newProgress);

                knockedInAt.current = 0;
                inputSequence.current = match;
                locked.current = newProgress < 1;

                if (
                    expectedSequence.current[match.length] === " " ||
                    expectedSequence.current[match.length] === "/"
                ) {
                    timeout.current = setTimeout(
                        () =>
                            updateInputSequence(
                                expectedSequence.current[match.length],
                            ),
                        pauseMs,
                    );
                } else if (locked.current) {
                    timeout.current = setTimeout(() => reset(), timeoutMs);
                }
            }
        },
        [getMatch, pauseMs, timeoutMs, resetWhenWrong],
    );

    const onKnockIn = useCallback(() => {
        if (locked.current) {
            knockedInAt.current = Date.now();
            clearTimeout(timeout.current);
            timeout.current = setTimeout(
                () => updateInputSequence("-"),
                longPressMs,
            );
        }
    }, [updateInputSequence, longPressMs]);

    const onKnockOut = useCallback(() => {
        if (locked.current && knockedInAt.current) {
            clearTimeout(timeout.current);
            updateInputSequence(".");
        }
    }, [updateInputSequence]);

    return {
        progress,
        getInputSequence: () => inputSequence.current,
        reset,
        onKnockIn,
        onKnockOut,
    };
};

export default useSecretKnockCore;
