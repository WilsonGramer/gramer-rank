import { useState } from "react";
import _ from "lodash";
import * as math from "mathjs";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import * as mathquill from "react-mathquill";

mathquill.addStyles();

const App = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState();

    return (
        <>
            <h1>Gramer Rank</h1>

            <p>
                The “Gramer Rank” of a function is the number of unique derivatives of that
                function.
            </p>
            <p>Use this website to calculate the Gramer Rank of a function!</p>

            <br />

            <p>Function:</p>

            <mathquill.EditableMathField
                style={{ width: 300 }}
                latex={input}
                onChange={(mathField) => setInput(mathField.latex())}
            />

            <p>
                <button onClick={() => setOutput(input ? gramerRank(input) : undefined)}>
                    Calculate
                </button>
            </p>

            {output &&
                ("error" in output ? (
                    <p>{output.error}</p>
                ) : (
                    <>
                        <p>
                            Your function has a Gramer Rank of <b>{output.rank}:</b>
                        </p>

                        <ol start={0}>
                            {output.steps.map((step, index) => (
                                <li key={index}>
                                    <Latex strict>{`$${step.toTex()}$`}</Latex>
                                </li>
                            ))}
                        </ol>
                    </>
                ))}
        </>
    );
};

export const gramerRank = (f) => {
    try {
        const steps = [math.simplify(f)];

        while (_.uniqBy(steps, (step) => step.toString()).length === steps.length) {
            const df = math.derivative(_.last(steps), "x");
            steps.push(df);
        }

        return {
            rank: steps.length - 2,
            steps: _.initial(steps),
        };
    } catch (error) {
        return { error: error.toString() };
    }
};

export default App;
