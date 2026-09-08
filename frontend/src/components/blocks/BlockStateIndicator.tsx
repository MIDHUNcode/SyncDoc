import type { AtomicBlockState } from "../../types/blockState";

interface BlockStateIndicatorProps {
  state: AtomicBlockState;
}

export default function BlockStateIndicator({
  state,
}: BlockStateIndicatorProps) {
  if (state.isLocked) {
    return (
      <span
        className="syncdoc-block-state syncdoc-block-state-locked"
        data-state="locked"
      >
        🔒 Locked
      </span>
    );
  }

  if (state.isEditing) {
    return (
      <span
        className="syncdoc-block-state syncdoc-block-state-editing"
        data-state="editing"
      >
        ✏️ Editing
      </span>
    );
  }

  if (state.isActive) {
    return (
      <span
        className="syncdoc-block-state syncdoc-block-state-active"
        data-state="active"
      >
        Active
      </span>
    );
  }

  return null;
}
