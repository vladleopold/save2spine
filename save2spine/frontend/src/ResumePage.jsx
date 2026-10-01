import React from 'react';
import { Studio } from './cv/Studio.jsx';

/**
 * /resume — расширенное резюме.
 *
 * Отдельная страница от /cv: здесь полные описания каждого места работы,
 * профиль, ключевые достижения и дополнительные разделы. Визуальная и ATS
 * версии переключаются кнопкой, как и на /cv.
 */
export default function ResumePage() {
  return <Studio kind="resume" />;
}
