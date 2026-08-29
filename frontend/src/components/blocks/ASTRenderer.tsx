import {
    useEffect,
    useState,
} from "react";

import type { ASTNode } from "../../types/document";
import type { AtomicBlockState } from "../../types/blockState";

import * as Y from "yjs";

import HeadingBlock from "./HeadingBlock";
import ParagraphBlock from "./ParagraphBlock";
import CodeBlock from "./CodeBlock";
import ListBlock from "./ListBlock";
import ASTBlock from "./ASTBlock";

import {
    createAtomicBlockState,
} from "../../state/atomicBlockState";

interface ASTRendererProps {
    nodes: ASTNode[];

    onChange?: (
        id: string,
        content: string,
    ) => void;

    yDoc: Y.Doc | null;
    userId: string;
    userName: string;
}

function ASTRenderer({
    nodes,
    onChange,
    yDoc,
    userId,
    userName,
}: ASTRendererProps) {
    const [
        blockStates,
        setBlockStates,
    ] = useState<
        Record<string, AtomicBlockState>
    >({});

    useEffect(() => {
        setBlockStates((currentStates) => {
            const nextStates = {
                ...currentStates,
            };

            nodes.forEach((node) => {
                if (!nextStates[node.id]) {
                    nextStates[node.id] =
                        createAtomicBlockState(
                            node.id,
                        );
                }
            });

            return nextStates;
        });
    }, [nodes]);

    return (
        <div>
            {nodes.map((node) => {
                const state =
                    blockStates[node.id] ??
                    createAtomicBlockState(
                        node.id,
                    );

                let block: React.ReactNode;

                switch (node.type) {
                    case "heading":
                        block = (
                            <HeadingBlock
                                node={node}
                                onChange={onChange}
                                yDoc={yDoc}
                                userId={userId}
                                userName={userName}
                            />
                        );
                        break;

                    case "paragraph":
                        block = (
                            <ParagraphBlock
                                node={node}
                                onChange={onChange}
                                yDoc={yDoc}
                                userId={userId}
                                userName={userName}
                            />
                        );
                        break;

                    case "code":
                        block = (
                            <CodeBlock
                                node={node}
                                onChange={onChange}
                                yDoc={yDoc}
                                userId={userId}
                                userName={userName}
                            />
                        );
                        break;

                    case "list":
                        block = (
                            <ListBlock
                                node={node}
                            />
                        );
                        break;

                    default:
                        block = (
                            <div>
                                Unsupported node type:{" "}
                                {node.type}
                            </div>
                        );
                }

                return (
                    <ASTBlock
                        key={node.id}
                        node={node}
                        state={state}
                    >
                        {block}
                    </ASTBlock>
                );
            })}
        </div>
    );
}

export default ASTRenderer;