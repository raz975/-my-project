import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import NestedMenuItem from "./NestedMenuItem.jsx";

function SortableRow({ item, onEdit, onDelete, isAdmin, lang }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {isAdmin && (
          <span
            {...listeners}
            style={{
              cursor: "grab",
              userSelect: "none",
              fontSize: "18px",
              color: "#666",
              touchAction: "none"
            }}
            title="Перетащить"
          >
            ☰
          </span>
        )}
        <NestedMenuItem item={item} onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin} lang={lang} />
      </div>
    </div>
  );
}

export default function MenuTree({ items, setItems, onEdit, onDelete, isAdmin, lang }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <ul style={{ padding: 0, margin: 0, position: "relative" }}>
          {items.map(item => (
            <SortableRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin} lang={lang} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}