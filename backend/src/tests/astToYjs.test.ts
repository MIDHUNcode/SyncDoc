import { describe, expect, it } from "vitest";
import * as Y from "yjs";

import {
    astNodeToYMap,
    astToYArray,
    initializeYDocFromAST,
} from "../services/collaboration/astToYjs";

describe("AST → Yjs", () => {
    const nodes = [
        {
            id: "node-1",
            type: "heading" as const,
            content: "SyncDoc",
            attributes: {},
            children: [],
        },
        {
            id: "node-2",
            type: "paragraph" as const,
            content: "Collaborative editor",
            attributes: {},
            children: [],
        },
    ];

    it("should convert an AST node into a Y.Map", () => {
        const yDoc = new Y.Doc();

        const yNodes = yDoc.getArray<Y.Map<any>>("testNodes");

        yDoc.transact(() => {
            yNodes.push([astNodeToYMap(nodes[0])]);
        });

        const yNode = yNodes.get(0);

        expect(yNode.get("id")).toBe("node-1");
        expect(yNode.get("type")).toBe("heading");
        expect(yNode.get("content")).toBe("SyncDoc");
        expect(yNode.get("attributes")).toEqual({});
    });

    it("should convert AST nodes into a Y.Array", () => {
        const yDoc = new Y.Doc();

        const rootNodes = yDoc.getArray<Y.Map<any>>("nodes");

        yDoc.transact(() => {
            for (const node of nodes) {
                rootNodes.push([
                    astNodeToYMap(node),
                ]);
            }
        });

        expect(rootNodes.length).toBe(2);

        const firstNode = rootNodes.get(0);

        expect(firstNode.get("id")).toBe("node-1");
        expect(firstNode.get("type")).toBe("heading");
        expect(firstNode.get("content")).toBe("SyncDoc");

        const secondNode = rootNodes.get(1);

        expect(secondNode.get("id")).toBe("node-2");
        expect(secondNode.get("type")).toBe("paragraph");
        expect(secondNode.get("content")).toBe("Collaborative editor");
    });

    it("should initialize a Y.Doc from an AST", () => {
        const yDoc = new Y.Doc();

        initializeYDocFromAST(yDoc, nodes);

        const yNodes = yDoc.getArray<Y.Map<any>>("nodes");

        expect(yNodes.length).toBe(2);

        expect(yNodes.get(0).get("id")).toBe("node-1");
        expect(yNodes.get(1).get("id")).toBe("node-2");
    });

    it("should not duplicate nodes when initialized twice", () => {
        const yDoc = new Y.Doc();

        initializeYDocFromAST(yDoc, nodes);
        initializeYDocFromAST(yDoc, nodes);

        const yNodes = yDoc.getArray<Y.Map<any>>("nodes");

        expect(yNodes.length).toBe(2);
    });

    it("should preserve nested children", () => {
        const nestedNodes = [
            {
                id: "list-1",
                type: "list" as const,
                attributes: {},
                children: [
                    {
                        id: "item-1",
                        type: "listItem" as const,
                        content: "First item",
                        attributes: {},
                        children: [],
                    },
                ],
            },
        ];

        const yDoc = new Y.Doc();

        const rootNodes = yDoc.getArray<Y.Map<any>>("nodes");

        yDoc.transact(() => {
            rootNodes.push([
                astNodeToYMap(nestedNodes[0]),
            ]);
        });

        const yNode = rootNodes.get(0);

        const children = yNode.get(
            "children",
        ) as Y.Array<Y.Map<any>>;

        expect(children.length).toBe(1);

        expect(children.get(0).get("id")).toBe("item-1");
        expect(children.get(0).get("content")).toBe("First item");
    });
});