import type { ReactNode } from "react";

interface EditableBlockProps {
    value: string;
    onChange: (value: string) => void;
    children?: ReactNode;
}

function EditableBlock({
    value,
    onChange,
    children,
}: EditableBlockProps) {
    return (
        <div
            style={{
                marginBottom: "12px",
            }}
        >
            <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                rows={2}
                style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #666",
                    borderRadius: "6px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    fontSize: "16px",
                    background: "#1f1f23",
                    color: "#ffffff",
                }}
            />

            {children}
        </div>
    );
}

export default EditableBlock;