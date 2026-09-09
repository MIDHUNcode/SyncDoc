import {
    useEffect,
    useState,
} from "react";

import type { ASTNode } from "../../types/document";
import type { AtomicBlockState } from "../../types/blockState";

import {
    sanitizeASTForRendering,
} from "../../services/security/sanitizer";

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

    const updateBlockState = (
        nodeId: string,
        updates: Partial<AtomicBlockState>,
    ) => {
        setBlockStates((currentStates) => {
            const currentState =
                currentStates[nodeId] ??
                createAtomicBlockState(
                    nodeId,
                );

            return {
                ...currentStates,
                [nodeId]: {
                    ...currentState,
                    ...updates,
                },
            };
        });
    };

    const sanitizedNodes =
        sanitizeASTForRendering(nodes);

    return (
        <div>
            {sanitizedNodes.map((node) => {
                const state =
                    blockStates[node.id] ??
                    createAtomicBlockState(
                        node.id,
                    );

                const handleEditingChange = (
                    isEditing: boolean,
                ) => {
                    updateBlockState(
                        node.id,
                        {
                            isEditing,
                            isActive:
                                isEditing
                                    ? true
                                    : state.isActive,
                        },
                    );
                };

                const handleLockChange = (
                    isLocked: boolean,
                ) => {
                    updateBlockState(
                        node.id,
                        {
                            isLocked,
                            isEditing:
                                isLocked
                                    ? false
                                    : state.isEditing,
                        },
                    );
                };

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
                                onEditingChange={
                                    handleEditingChange
                                }
                                onLockChange={
                                    handleLockChange
                                }
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
                                onEditingChange={
                                    handleEditingChange
                                }
                                onLockChange={
                                    handleLockChange
                                }
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
                                onEditingChange={
                                    handleEditingChange
                                }
                                onLockChange={
                                    handleLockChange
                                }
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