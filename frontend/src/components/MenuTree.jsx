import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import NestedMenuItem from "./NestedMenuItem.jsx";

function SortableRow({ item, onEdit, onDelete, isAdmin, lang }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span {...listeners} style={{ cursor: "grab", userSelect: "none" }}>☰</span>
        <NestedMenuItem item={item} onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin} lang={lang} />
      </div>
    </div>
  );
}

export default function MenuTree({ items, setItems, onEdit, onDelete, isAdmin, lang }) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <ul style={{ padding: 0, margin: 0 }}>
          {items.map(item => (
            <SortableRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin} lang={lang} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}