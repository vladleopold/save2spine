import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function AdminGallery() {
  // Обработчик submit для dev-проекта
  const handleDevSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const payload = {
      id: Number(form.id),
      title: form.title,
      description: form.description,
      link: form.link,
      }

  // ...existing code...
}

}
export default AdminGallery;
