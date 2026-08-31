import { useEffect, useState } from "react";

import type {
    DocumentData,
    ASTNode,
} from "../../types/document";

import {
    updateYjsNodeContent,
} from "../../services/collaboration/yjsUpdates";

import {
    exportDocumentPDF,
    downloadPDF,
} from "../../services/exportService";

import ASTRenderer from "../blocks/ASTRenderer";
import { useYjsDocument } from "../../hooks/useYjsDocument";

interface DocumentViewerProps {
    document: DocumentData;
    onChange: (document: DocumentData) => void;
}

function DocumentViewer({
    document,
    onChange,
}: DocumentViewerProps) {
    /*
     * Keep the same user ID for this
     * browser session.
     */
    const [userId] = useState(() => {
        const existing =
            sessionStorage.getItem(
                "syncdoc-user-id",
            );

        if (existing) {
            return existing;
        }

        const id =
            crypto.randomUUID();

        sessionStorage.setItem(
            "syncdoc-user-id",
            id,
        );

        return id;
    });

    /*
     * User name.
     *
     * Stored in sessionStorage so the
     * same tab keeps the same name.
     */
    const [userName, setUserName] =
        useState(() => {
            const existing =
                sessionStorage.getItem(
                    "syncdoc-user-name",
                );

            return existing || "Anonymous";
        });

    /*
     * Change the current user's name.
     */
    const changeUserName = () => {
        const newName =
            window.prompt(
                "Enter your name",
                userName,
            );

        if (newName === null) {
            return;
        }

        const trimmedName =
            newName.trim();

        if (!trimmedName) {
            return;
        }

        sessionStorage.setItem(
            "syncdoc-user-name",
            trimmedName,
        );

        setUserName(trimmedName);
    };

    const {
        doc: yDoc,
        nodes: yNodes,
        astNodes,
        presenceUsers,
        editingUsers,
        connected: yjsConnected,
    } = useYjsDocument(
        document._id,
        userId,
        userName,
    );

    /*
     * Connection status.
     *
     * We currently have two states:
     *
     * connected
     * reconnecting
     *
     * We are not changing yjsClient.ts,
     * so false means the client is
     * disconnected/reconnecting.
     */
    const [
        connectionStatus,
        setConnectionStatus,
    ] = useState<
        "connected" | "reconnecting"
    >("reconnecting");

    /*
     * Update connection status whenever
     * the Yjs connection changes.
     */
    useEffect(() => {
        if (yjsConnected) {
            setConnectionStatus(
                "connected",
            );
        } else {
            setConnectionStatus(
                "reconnecting",
            );
        }
    }, [
        yjsConnected,
    ]);

    /*
     * Local AST state.
     *
     * This keeps the editor responsive
     * while Yjs handles collaboration.
     */
    const [localNodes, setLocalNodes] =
        useState<ASTNode[]>(
            document.nodes,
        );

    /*
     * PDF export state.
     */
    const [
        exportingPDF,
        setExportingPDF,
    ] = useState(false);

    const [
        exportError,
        setExportError,
    ] = useState<string | null>(null);

    /*
     * Reset local state when switching
     * documents.
     */
    useEffect(() => {
        setLocalNodes(
            document.nodes,
        );

        setExportError(null);
        setExportingPDF(false);
    }, [
        document._id,
    ]);

    /*
     * Use Yjs state when connected.
     */
    useEffect(() => {
        if (!yjsConnected) {
            return;
        }

        setLocalNodes(astNodes);
    }, [
        astNodes,
        yjsConnected,
    ]);

    /*
     * Update a single AST node.
     *
     * React:
     * - updates the targeted node
     * - recreates only the affected
     *   parent path
     *
     * Yjs:
     * - updates only the targeted
     *   Y.Map node
     */
    const updateNodeContent = (
        id: string,
        content: string,
    ) => {
        /*
         * Update React immediately.
         *
         * This keeps the local editor
         * responsive while Yjs handles
         * collaboration.
         */
        setLocalNodes(
            (currentNodes) => {
                const updateNodes = (
                    nodes: ASTNode[],
                ): ASTNode[] => {
                    return nodes.map(
                        (node) => {
                            if (
                                node.id === id
                            ) {
                                return {
                                    ...node,
                                    content,
                                };
                            }

                            if (
                                node.children?.length
                            ) {
                                const updatedChildren =
                                    updateNodes(
                                        node.children,
                                    );

                                const childrenChanged =
                                    updatedChildren.some(
                                        (
                                            child,
                                            index,
                                        ) =>
                                            child !==
                                            node.children?.[
                                                index
                                            ],
                                    );

                                if (
                                    childrenChanged
                                ) {
                                    return {
                                        ...node,
                                        children:
                                            updatedChildren,
                                    };
                                }
                            }

                            return node;
                        },
                    );
                };

                return updateNodes(
                    currentNodes,
                );
            },
        );

        /*
         * Update only the targeted Yjs node.
         */
        if (
            yDoc &&
            yNodes
        ) {
            const updated =
                updateYjsNodeContent(
                    yDoc,
                    id,
                    content,
                );

            if (!updated) {
                console.warn(
                    "⚠️ Yjs node not found:",
                    id,
                );
            }

            return;
        }

        /*
         * REST fallback when Yjs is
         * not available.
         */
        setLocalNodes(
            (currentNodes) => {
                onChange({
                    ...document,
                    nodes:
                        currentNodes,
                });

                return currentNodes;
            },
        );
    };

    /*
     * Export the current document as PDF.
     */
    const handleExportPDF =
        async () => {
            if (exportingPDF) {
                return;
            }

            setExportingPDF(true);
            setExportError(null);

            try {
                /*
                 * Request the PDF from the
                 * backend export endpoint.
                 */
                const pdf =
                    await exportDocumentPDF(
                        document._id,
                    );

                /*
                 * Trigger the browser download.
                 */
                downloadPDF(
                    pdf,
                    document.title,
                );
            } catch (error) {
                console.error(
                    "Failed to export PDF:",
                    error,
                );

                setExportError(
                    error instanceof Error
                        ? error.message
                        : "Failed to export document as PDF.",
                );
            } finally {
                setExportingPDF(false);
            }
        };

    /*
     * Generate initials for an avatar.
     *
     * Examples:
     *
     * Midhun      -> M
     * Arun        -> A
     * Midhun G    -> MG
     * Arun Kumar  -> AK
     */
    const getInitials = (
        name: string,
    ): string => {
        const trimmedName =
            name.trim();

        if (!trimmedName) {
            return "?";
        }

        const parts =
            trimmedName.split(
                /\s+/,
            );

        if (parts.length === 1) {
            return parts[0][0]
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[
                parts.length - 1
            ][0]
        ).toUpperCase();
    };

    return (
        <div
            style={{
                marginTop: "30px",
                padding: "20px",
                border:
                    "1px solid #444",
                borderRadius: "10px",
            }}
        >
            <div
                style={{
                    display:
                        "flex",
                    justifyContent:
                        "space-between",
                    alignItems:
                        "center",
                    marginBottom:
                        "20px",
                }}
            >
                <h2>
                    {document.title}
                </h2>

                <div
                    style={{
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap: "16px",
                    }}
                >
                    {/* Yjs connection status */}
                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "6px",
                            fontSize:
                                "14px",
                        }}
                    >
                        <span
                            style={{
                                width:
                                    "9px",
                                height:
                                    "9px",
                                borderRadius:
                                    "50%",
                                backgroundColor:
                                    connectionStatus ===
                                        "connected"
                                        ? "#4caf50"
                                        : "#ff9800",
                                display:
                                    "inline-block",
                            }}
                        />

                        <span>
                            {connectionStatus ===
                                "connected"
                                ? "Connected"
                                : "Reconnecting..."}
                        </span>
                    </div>

                    {/* Presence */}
                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "8px",
                        }}
                    >
                        <span>
                            🟢
                        </span>

                        {/* User avatars */}
                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                            }}
                        >
                            {presenceUsers.map(
                                (
                                    user,
                                    index,
                                ) => (
                                    <div
                                        key={
                                            user.userId
                                        }
                                        style={{
                                            position:
                                                "relative",
                                            width:
                                                "32px",
                                            height:
                                                "32px",
                                            borderRadius:
                                                "50%",
                                            border:
                                                "2px solid white",
                                            backgroundColor:
                                                "#555",
                                            color:
                                                "white",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            fontSize:
                                                "12px",
                                            fontWeight:
                                                "bold",
                                            marginLeft:
                                                index ===
                                                    0
                                                    ? "0"
                                                    : "-8px",
                                            cursor:
                                                "default",
                                            boxSizing:
                                                "border-box",
                                        }}
                                    >
                                        {getInitials(
                                            user.userName,
                                        )}

                                        {editingUsers.some(
                                            (
                                                editor,
                                            ) =>
                                                editor.userId ===
                                                user.userId,
                                        ) && (
                                            <span
                                                title={`${user.userName} is editing`}
                                                style={{
                                                    position:
                                                        "absolute",
                                                    right:
                                                        "-4px",
                                                    bottom:
                                                        "-4px",
                                                    width:
                                                        "16px",
                                                    height:
                                                        "16px",
                                                    borderRadius:
                                                        "50%",
                                                    background:
                                                        "#222",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    fontSize:
                                                        "9px",
                                                    border:
                                                        "1px solid white",
                                                }}
                                            >
                                                ✏️
                                            </span>
                                        )}
                                    </div>
                                ),
                            )}
                        </div>

                        {/* Online count */}
                        <span>
                            {
                                presenceUsers.length
                            }{" "}
                            online
                        </span>
                    </div>

                    {/* Export PDF */}
                    <button
                        type="button"
                        onClick={
                            handleExportPDF
                        }
                        disabled={
                            exportingPDF
                        }
                        style={{
                            padding:
                                "6px 10px",
                            borderRadius:
                                "6px",
                            border:
                                "1px solid #555",
                            background:
                                exportingPDF
                                    ? "#333"
                                    : "#1f1f23",
                            color:
                                "#fff",
                            cursor:
                                exportingPDF
                                    ? "not-allowed"
                                    : "pointer",
                            opacity:
                                exportingPDF
                                    ? 0.7
                                    : 1,
                        }}
                    >
                        {exportingPDF
                            ? "Exporting..."
                            : "Export PDF"}
                    </button>

                    {/* Change name */}
                    <button
                        type="button"
                        onClick={
                            changeUserName
                        }
                        style={{
                            padding:
                                "6px 10px",
                            borderRadius:
                                "6px",
                            border:
                                "1px solid #555",
                            background:
                                "#1f1f23",
                            color:
                                "#fff",
                            cursor:
                                "pointer",
                        }}
                    >
                        Change name
                    </button>
                </div>
            </div>

            {/* Export error */}
            {exportError && (
                <div
                    style={{
                        marginBottom:
                            "12px",
                        padding:
                            "8px 12px",
                        border:
                            "1px solid #f44336",
                        borderRadius:
                            "6px",
                        color:
                            "#f44336",
                        fontSize:
                            "14px",
                    }}
                >
                    {exportError}
                </div>
            )}

            <ASTRenderer
                nodes={
                    localNodes
                }
                onChange={
                    updateNodeContent
                }
                yDoc={yDoc}
                userId={userId}
                userName={
                    userName
                }
            />
        </div>
    );
}

export default DocumentViewer;