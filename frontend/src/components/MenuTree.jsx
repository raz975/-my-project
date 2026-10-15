import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { t } from "../translations.js";

function SortableRow({ item, onEdit, onDelete, isAdmin, lang, level, onReorder }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const [open, setOpen] = useState(true);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto"
  };

  const hasChildren = item.children?.length > 0;

  return (
    <li style={{ listStyle: "none", marginBottom: "8px", marginLeft: level > 0 ? "25px" : 0 }}>
      <div ref={setNodeRef} style={style} {...attributes}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 11px", background: "white", borderRadius: "9px", width: "fit-content", maxWidth: "100%" }}>
          {isAdmin && (
            <span {...listeners} style={{ cursor: "grab", userSelect: "none", fontSize: "18px", color: "#666", touchAction: "none" }} title="Перетащить">
              ☰
            </span>
          )}
          <span onClick={() => hasChildren && setOpen(!open)} style={{ cursor: hasChildren ? "pointer" : "default" }}>
            {hasChildren ? (open ? "📂" : "📁") : "📄"}
          </span>
          <span>{item.display_name || item.name}</span>
          {item.url && <small style={{ color: "#777" }}>{item.url}</small>}
          {isAdmin && (
            <>
              <button onClick={() => onEdit(item)} style={{ border: "none", borderRadius: "10px", padding: "5px 10px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "#2196f3", color: "white" }}>{t(lang, "edit")}</button>
              <button onClick={() => onDelete(item.id)} style={{ border: "none", borderRadius: "10px", padding: "5px 10px", cursor: "pointer", fontFamily: "Franklin Gothic Medium", background: "red", color: "white" }}>{t(lang, "delete")}</button>
            </>
          )}
        </div>

        {hasChildren && open && (
          <MenuTree
            items={item.children}
            setItems={newChildren => {
              const updated = { ...item, children: newChildren };
              onReorder(updated);
            }}
            onEdit={onEdit}
            onDelete={onDelete}
            isAdmin={isAdmin}
            lang={lang}
            level={level + 1}
          />
        )}
      </div>
    </li>
  );
}

export default function MenuTree({ items, setItems, onEdit, onDelete, isAdmin, lang, level = 0 }) {
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
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <ul style={{ padding: 0, margin: 0, position: "relative" }}>
          {items.map(item => (
            <SortableRow
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
              lang={lang}
              level={level}
              onReorder={updated => {
                const idx = items.findIndex(i => i.id === updated.id);
                if (idx !== -1) {
                  const newItems = [...items];
                  newItems[idx] = updated;
                  setItems(newItems);
                }
              }}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}